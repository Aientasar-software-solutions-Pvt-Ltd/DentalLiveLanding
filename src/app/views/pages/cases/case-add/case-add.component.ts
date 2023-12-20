import { filter } from 'rxjs/operators';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CvfastNewComponent } from 'src/app/cvfastFiles/cvfast-new/cvfast-new.component';
import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { CrudOperationsService } from 'src/app/crud-operations.service';
import swal from 'sweetalert';
import { Location } from '@angular/common';

@Component({
    selector: 'app-case-add',
    templateUrl: './case-add.component.html',
    styleUrls: ['./case-add.component.css'],
    providers: [CrudOperationsService]
})
export class CaseAddComponent implements OnInit, AfterViewInit {

    @ViewChild("mainForm", { static: false }) mainForm: NgForm;
    @ViewChild(CvfastNewComponent) cvfast!: CvfastNewComponent;
    module = 'cases';
    hasPatient = false;
    mode = "Add"
    user = this.utility.getUserDetails()

    constructor(
        private router: Router,
        private location: Location,
        private route: ActivatedRoute,
        public utility: UtilityServiceV2,
        public formInterface: CrudOperationsService,
    ) { }

    ngAfterViewInit(): void {
        this.formInterface.mainForm = this.mainForm
        this.formInterface.cvfast = this.cvfast;
    }

    ngOnInit(): void {
        this.formInterface.section = this.utility.apiData[this.module]
        this.formInterface.resetForm();
        this.formInterface.loadDependencies().then(() => {
            console.log(this.formInterface.dependentData['patients'])
            this.route.paramMap.subscribe((params) => {
                if (params.get("id") && params.get("id") != "") {
                    this.formInterface.hasData(params.get("id"));
                    this.mode = "Update"
                }

                if (params.get("patientId") && params.get("patientId") != "") {
                    this.hasPatient = true;
                    var result = this.formInterface.dependentData['patients'].find(item => item.patientId == params.get("patientId"));
                    this.formInterface.object.patientId = result.patientId
                    this.formInterface.object.patientName = result.firstName + " " + result.lastName
                }
            });
        })
    }

    //Special functions for this class
    customSubmit() {
        if (this.formInterface.object.caseType.length == 0) {
            swal("Please Select Atleast One Case Type.");
            return;
        }
        if (this.formInterface.object.patientId) {
            let patient = this.formInterface.dependentData['patients'].find(e => e.patientId == this.formInterface.object.patientId)
            if (patient) this.formInterface.object.patientName = patient.firstName + " " + patient.lastName
        }
        this.formInterface.onSubmit()
    }

    checkCase(id) {
        if (this.formInterface.object.caseType.includes(id)) {
            this.formInterface.object.caseType.splice(this.formInterface.object.caseType.indexOf(id), 1);
            return;
        }
        this.formInterface.object.caseType.push(id);
    }

    filteredPatients() {
        if (this?.formInterface?.dependentData['patients'])
            return this.formInterface.dependentData['patients'].filter(item => item.resourceOwner == this.user.emailAddress)
    }

    goBack() {
        if (this.location.getState()['navigationId'] > 1) {
            this.location.back();
        } else {
            this.router.navigate(['/dashboard']); // Go to a fixed route if no previous location is available
        }
    }
}
