import { Component, ViewChild, OnInit, AfterViewInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CvfastNewComponent } from 'src/app/cvfastFiles/cvfast-new/cvfast-new.component';
import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { CrudOperationsService } from 'src/app/crud-operations.service';
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-general-task-add',
    templateUrl: './general-task-add.component.html',
    styleUrls: ['./general-task-add.component.css'],
    providers: [CrudOperationsService]
})
export class GeneralTaskAddComponent implements OnInit {
    @ViewChild("mainForm", { static: false }) mainForm: NgForm;
    @ViewChild(CvfastNewComponent) cvfast!: CvfastNewComponent;
    module = 'tasks';
    milestoneObject = null;
    caseMembers = [];
    nonInvitedMembers = [];
    hasCase = false;
    mode = "Add"
    user = this.utility.getUserDetails();
    currentDate = new Date()
    emailArray = {}
    selectedUsers = [];
    @ViewChild(CvfastNewComponent) inviteText!: CvfastNewComponent;
    isUploadingData = false;
    @Output() closeModal = new EventEmitter<boolean>();
    isInvite = false;
    currentCase = null;

    constructor(
        private route: ActivatedRoute,
        public utility: UtilityServiceV2,
        public formInterface: CrudOperationsService,
        private router: Router,
        private dataService: ApiDataService,
        private cdref: ChangeDetectorRef
    ) { }

    updateTaskId(taskId) {
        this.formInterface.resetForm();
        this.cvfast.resetForm();
        if (taskId) {
            this.mode = "Update"
            this.formInterface.hasData(taskId).then(() => this.cdref.detectChanges());
        }
    }

    ngAfterViewInit(): void {
        this.formInterface.mainForm = this.mainForm
        this.formInterface.cvfast = this.cvfast;
        this.currentDate = new Date();
    }

    ngOnInit(): void {
        this.formInterface.section = JSON.parse(JSON.stringify(this.utility.apiData[this.module]));
        this.formInterface.resetForm();
        this.formInterface.object.startDate = new Date().getTime();
        this.formInterface.loadDependencies().then(() => {
            this.route.parent.paramMap.subscribe((milestoneParams) => {
                if (!milestoneParams.get("milestoneId") || milestoneParams.get("milestoneId") == "") {
                    swal("No Milestone exists for selected task")
                    this.router.navigate([this.formInterface.section.backUrl])
                    return;
                }
                let promises = [this.utility.loadPreFetchData("patients"), this.utility.loadPreFetchData("cases"), this.utility.loadPreFetchData("users")]
                Promise.all(promises)
                    .then((values) => {
                        this.formInterface.section.backUrl = '/milestones/milestone-details/' + milestoneParams.get("milestoneId")
                        this.dataService.getallData(this.utility.baseUrl + "milestones?milestoneId" + "=" + milestoneParams.get("milestoneId"), true).subscribe((Response) => {
                            if (!Response) {
                                swal("No Milestone exists for selected task")
                                this.router.navigate([this.formInterface.section.backUrl])
                                return;
                            }
                            this.milestoneObject = JSON.parse(Response.toString())
                            this.formInterface.object.milestoneId = this.milestoneObject.milestoneId
                            this.formInterface.object.caseId = this.milestoneObject.caseId
                            this.formInterface.object.patientId = this.milestoneObject.patientId
                            this.formInterface.object.patientName = this.milestoneObject.patientName
                            this.populateCaseMembers(this.formInterface.object.caseId)

                            this.route.parent.parent.parent.paramMap.subscribe((caseParams) => {

                                if (caseParams.get("caseId") && caseParams.get("caseId") != "") {
                                    this.hasCase = true;
                                    this.formInterface.section.backUrl = '/cases/cases/case-view/' + this.milestoneObject.caseId + '/milestones/milestone-details/' + this.milestoneObject.milestoneId
                                }
                                else
                                    this.formInterface.section.backUrl = '/milestones/milestone-details/' + this.milestoneObject.milestoneId
                            });

                            this.route.paramMap.subscribe((params) => {
                                if (params.get("taskId") && params.get("taskId") != "") {
                                    this.mode = "Update"
                                    this.formInterface.hasData(params.get("taskId"))
                                }
                            });
                        });
                    });
            });
        })
    }

    //Special functions for this class
    populateCaseMembers(caseId) {
        this.currentCase = this.utility.metadata.cases.find((cs) => cs.caseId == this.formInterface.object.caseId)
        //caseinvites --> get accepted uses of this case --> send api for emailaddressarray --> bind users
        this.dataService.getallData(this.utility.baseUrl + "caseinvites?caseId=" + caseId, true).subscribe(
            (Response) => {
                let data = JSON.parse(Response.toString());
                this.emailArray = {}
                data.forEach((item) => {
                    if (this.user.emailAddress != item.invitedUserMail)
                        this.emailArray[item.invitedUserMail] = item;
                })
                let invited = []
                let nonInvited = [];
                this.formInterface.dependentData['users'].forEach((item) => {
                    if (item.emailAddress == this.currentCase.resourceOwner && this.user.emailAddress != item.emailAddress) invited.push(item)
                    if (Object.keys(this.emailArray).includes(item.emailAddress)) {
                        invited.push(item)
                    } else {
                        nonInvited.push(item)
                    }
                });
                this.caseMembers = [...invited]
                this.nonInvitedMembers = [...nonInvited]
            }, (error) => {
                this.utility.showError(error.status)
                this.formInterface.isLoadingData = false;
            });
    }

    customSubmit(form) {
        if (this.mode == "Add") {
            let startDate = new Date(form.value.startdate);
            startDate.setHours(0, 0, 0, 0);
            var todaysDate = new Date();
            todaysDate.setHours(0, 0, 0, 0);

            if (startDate < todaysDate) {
                Swal.fire({
                    title: 'The Due Date must be later than the Start Date. Please select a different date and time..',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                })
                return
            }
        }

        if (!form.value.duedate) {
            Swal.fire({
                title: 'Please enter the Due Date.',
                showCancelButton: false,
                confirmButtonText: 'OK'
            })
            return
        }

        if (form.value.startdate > form.value.duedate) {
            swal("Due Date Should Be Greater Than Start Date")
            return
        }

        this.formInterface.object.startdate = new Date(form.value.startdate).getTime();
        this.formInterface.object.duedate = new Date(form.value.duedate).getTime();

        this.formInterface.object.milestoneId = this.milestoneObject.milestoneId
        this.formInterface.object.caseId = this.milestoneObject.caseId
        this.formInterface.object.patientId = this.milestoneObject.patientId
        this.formInterface.object.patientName = this.milestoneObject.patientName


        this.formInterface.onSubmit().then((response) => {
            console.log(this.formInterface.object);
            console.log(response)
            if (response) {
                // this.mainForm.reset()
                this.closeModal.emit()
            }
        }, (error) => { console.log(error) })
    }

    async addNewMember(form: NgForm) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (form.invalid) {
            swal("Enter Name and Email Address Feilds")
            form.form.markAllAsTouched();
            return;
        }

        if (!form.value['email'].match(mailformat)) {
            swal("Enter Proper Email Address")
            form.form.markAllAsTouched();
            return;
        }

        if (!this.formInterface.object.caseId) {
            swal("Please Select A Case To Continue");
            return;
        }

        swal("Processing...please wait...", {
            buttons: [false, false],
            closeOnClickOutside: false,
        });

        this.dataService.getallData(this.utility.baseUrl + "sendinvite?caseId=" + this.formInterface.object.caseId + "&name=" + form.value.name + "&email=" + form.value.email, true).subscribe(Response => {
            if (Response) Response = JSON.parse(Response.toString());
            swal.close();
            swal('New member invited successfully');
            form.reset()
        }, error => {
            swal.close();
            if (error.status == 418)
                swal("User already a member of Dental-Live")
            else
                (error['status']) ? this.utility.showError(error['status']) : swal("Error processing request,please try again");
            return;
        });
    }

    //special function for this class
    async sendInvite(cvfast: CvfastNewComponent) {

        if (this.selectedUsers.length == 0) {
            swal("Please Select Members");
            return;
        }
        this.isUploadingData = true;

        this.formInterface.object.milestoneId = this.milestoneObject.milestoneId
        this.formInterface.object.caseId = this.milestoneObject.caseId
        this.formInterface.object.patientId = this.milestoneObject.patientId
        this.formInterface.object.patientName = this.milestoneObject.patientName

        //process cvfast Files --> send invites
        try {
            let cvfastText = await cvfast.processFiles();
            let promises = []
            let toBeAddedMembers = []
            this.selectedUsers.forEach(user => {
                toBeAddedMembers.push(user.emailAddress);
                let invite = {
                    "invitationId": "",
                    "caseId": this.formInterface.object.caseId,
                    "patientId": this.formInterface.object.patientId,
                    "patientName": this.formInterface.object.patientName,
                    "invitedUserMail": user.emailAddress,
                    "invitedUserId": user.dentalId,
                    "presentStatus": 0,
                    "invitationText": cvfastText,
                }
                promises.push(this.dataService.postData(this.utility.baseUrl + 'caseinvites', JSON.stringify(invite), true).toPromise())
            });
            await Promise.all(promises)
            swal("Invitations sent succesfully")
            document.getElementById("addInvite").click();
            this.resetInviteForm()
            this.isUploadingData = false;
            if (toBeAddedMembers.length > 0) this.formInterface.object.memberMail = toBeAddedMembers[0]
            this.populateCaseMembers(this.formInterface.object.caseId)
        } catch (error) {
            (error['status']) ? this.utility.showError(error['status']) : swal("Error processing request,please try again");
            return;
        }
    }

    resetInviteForm() {
        this.selectedUsers = [];
        this.inviteText.resetForm();
        this.isInvite = false;
    }

}