import { Component, ViewChild, OnInit, AfterViewInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CvfastNewComponent } from 'src/app/cvfastFiles/cvfast-new/cvfast-new.component';
import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { CrudOperationsService } from 'src/app/crud-operations.service';
import swal from 'sweetalert';

@Component({
    selector: 'app-milestone-add',
    templateUrl: './milestone-add.component.html',
    styleUrls: ['./milestone-add.component.css'],
    providers: [CrudOperationsService]
})
export class MilestoneAddComponent implements OnInit {
    @ViewChild("mainForm", { static: false }) mainForm: NgForm;
    @ViewChild(CvfastNewComponent) cvfast!: CvfastNewComponent;
    module = 'milestones';
    hasCase = false;
    mode = "Add"
    user = this.utility.getUserDetails();
    currentDate = new Date()
    currentCases = [];
    caseMembers = [];
    hasPatient = false;

    patientObject = null;
    caseObject = null;

    constructor(
        private route: ActivatedRoute,
        public utility: UtilityServiceV2,
        public formInterface: CrudOperationsService,
    ) { }

    ngAfterViewInit(): void {
        this.formInterface.mainForm = this.mainForm
        this.formInterface.cvfast = this.cvfast;
        this.currentDate = new Date();
    }

    async loadDep() {
        await this.utility.loadPreFetchData("practices");
        await this.utility.loadPreFetchData("users");
    }

    ngOnInit(): void {

        this.formInterface.section = JSON.parse(JSON.stringify(this.utility.apiData[this.module]));
        this.formInterface.resetForm();
        this.formInterface.loadDependencies().then(() => {

            this.formInterface.dependentData['patients'] = this.formInterface.dependentData['patients'].map(item => {
                item.fullName = item.firstName + " " + item.lastName;
                return item
            })

            this.currentCases = this.formInterface.dependentData['cases']

            this.route.parent.parent.paramMap.subscribe((parentParams) => {

                this.loadDep();

                if (parentParams.get("caseId") && parentParams.get("caseId") != "")
                    this.hasCase = true

                this.route.paramMap.subscribe((params) => {

                    if (params.get("id") && params.get("id") != "") {
                        if (params.get("id").startsWith('pid_')) {
                            this.hasPatient = true
                            this.selectPatient(params.get("id").slice(4))
                            if (params.get("cid") && params.get("cid") != "") {
                                this.hasCase = true
                                this.selectCase(params.get("cid"))
                            }
                        } else {
                            this.mode = "Update"
                            this.formInterface.hasData(params.get("id"));
                        }
                    } else {
                        if (parentParams.get("caseId") && parentParams.get("caseId") != "") {
                            this.formInterface.loadCaseData(parentParams.get("caseId"))
                        }
                    }
                });
            });
        })
    }

    //Special functions for this class
    selectPatient(patientId) {
        this.formInterface.object.caseId = null
        this.patientObject = null;
        if (!patientId) return;
        this.patientObject = this.formInterface.dependentData['patients'].find((cs) => cs.patientId == patientId)
        this.currentCases = patientId ? this.formInterface.dependentData['cases'].filter((cs) => cs.patientId == patientId) : this.formInterface.dependentData['cases']
        this.formInterface.object.patientId = patientId
    }

    //Special functions for this class
    selectCase(caseId) {
        this.formInterface.object.caseId = ""
        this.caseObject = null;
        if (!caseId) return;
        this.formInterface.object.caseId = caseId
        this.caseObject = this.formInterface.dependentData['cases'].find((cs) => cs.caseId == caseId)
        // this.formInterface.object.patientId = event.patientId
        // this.formInterface.object.patientName = event.patientName
    }

    toInt(val, event) {
        this.formInterface.object[val] = Number(event);
    }

    customSubmit(form) {
        if (this.mode == "Add") {
            let startDate = new Date(form.value.startdate);
            startDate.setHours(0, 0, 0, 0);
            var todaysDate = new Date();
            todaysDate.setHours(0, 0, 0, 0);

            if (startDate < todaysDate) {
                swal("Start Date Should Not Be Less Than Today’s Date")
                return
            }
        }

        if (!form.value.duedate) {
            swal("Enter Due Date")
            return
        }

        if (form.value.startdate > form.value.duedate) {
            swal("Due Date Should Be Greater Than Start Date")
            return
        }

        this.formInterface.object.startdate = new Date(form.value.startdate).getTime();
        this.formInterface.object.duedate = new Date(form.value.duedate).getTime();

        if (this.hasCase)
            this.formInterface.section.backUrl = '/cases/cases/case-view/' + this.formInterface.object.caseId + '/milestones'
        this.formInterface.onSubmit()
    }
}