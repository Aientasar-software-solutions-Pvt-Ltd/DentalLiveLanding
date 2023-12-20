import { Component, ViewChild, OnInit, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { CrudOperationsService } from 'src/app/crud-operations.service';
import { ApiDataService } from '../../users/api-data.service';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert';


@Component({
    selector: 'app-add-files',
    templateUrl: './add-files.component.html',
    styleUrls: ['./add-files.component.css'],
    providers: [CrudOperationsService]
})
export class AddFilesComponent implements OnInit {
    @ViewChild("mainForm", { static: false }) mainForm: NgForm;
    module = 'casefiles';
    hasCase = false;
    mode = "Add"

    //new file added --> added to newUplaodedFiles array --> processed and saved with names in files array
    //in edit --> old files removed --> directly remove from files array 


    constructor(
        private route: ActivatedRoute,
        public utility: UtilityServiceV2,
        public formInterface: CrudOperationsService,
    ) { }

    ngAfterViewInit(): void {
        this.formInterface.mainForm = this.mainForm
    }

    ngOnInit(): void {
        this.formInterface.section = this.utility.apiData[this.module]
        this.formInterface.resetForm();
        this.formInterface.object.newUploadedFiles = [];
        this.formInterface.loadDependencies().then(() => {

            this.route.parent.parent.paramMap.subscribe((parentParams) => {

                if (parentParams.get("caseId") && parentParams.get("caseId") != "")
                    this.hasCase = true

                this.route.paramMap.subscribe((params) => {

                    if (params.get("id") && params.get("id") != "") {
                        this.mode = "Update"
                        this.formInterface.hasData(params.get("id")).then(() => {
                            this.formInterface.object.newUploadedFiles = [];
                        });
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
    selectCase(event) {
        this.formInterface.object.caseId = ""
        if (!event) return;
        this.formInterface.object.caseId = event.caseId
        this.formInterface.object.patientId = event.patientId
        this.formInterface.object.patientName = event.patientName
    }

    loadBinaryFiles(event) {
        if (event.target.files.length > 0) {
            if (!this.formInterface?.object?.newUploadedFiles) this.formInterface.object.newUploadedFiles = [];
            Array.from(event.target.files).map((file) => {
                this.formInterface.object.newUploadedFiles.push({ name: this.getUniqueName(file['name']), binaryData: file })
            });
        }
    }

    removeFiles(index, attachment, isTemp) {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this file!",
            buttons: ['CANCEL', 'CONTINUE'],
        })
            .then((willDelete) => {
                if (willDelete) {
                    attachment.classList.add('animate__lightSpeedOutRight');
                    setTimeout(() => {
                        isTemp ? this.formInterface.object.newUploadedFiles.splice(index, 1) : this.formInterface.object.files.splice(index, 1)
                    }, 500);
                }
            });
    }

    getUniqueName(name) {
        let arr = this.formInterface.object.files.concat(this.formInterface.object.newUploadedFiles);
        let i = 0;
        do {
            if (i > 0) name = name.split('.')[0] + '_' + i + '.' + name.split('.')[1];
            i++;
        } while (arr.some(user => user.name == name));
        return name;
    }

    customDelete() {
        this.formInterface.section.backUrl = '/cases/cases/case-view/' + this.formInterface.object.caseId + '/files'
        this.formInterface.deleteData(this.formInterface.object.fileUploadId)
    }

}
