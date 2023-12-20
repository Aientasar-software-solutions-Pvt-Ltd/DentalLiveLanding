import { Component, ViewChild, OnInit, AfterViewInit, Input, ChangeDetectorRef, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CvfastNewComponent } from 'src/app/cvfastFiles/cvfast-new/cvfast-new.component';
import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { CrudOperationsService } from 'src/app/crud-operations.service';
import { ApiDataService } from '../../users/api-data.service';
import swal from 'sweetalert';
import { ReferralGuideComponent } from '../referral-guide/referral-guide.component';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
    selector: 'app-referral-add',
    templateUrl: './referral-add.component.html',
    styleUrls: ['./referral-add.component.css'],
    providers: [CrudOperationsService]
})
export class ReferralAddComponent implements OnInit {
    @ViewChild('caseSelect') caseSelect: NgSelectComponent;
    @ViewChild("mainForm", { static: false }) mainForm: NgForm;
    @ViewChild(CvfastNewComponent) cvfast!: CvfastNewComponent;
    @ViewChild(ReferralGuideComponent) orders: ReferralGuideComponent;
    module = 'referrals';
    caseMembers = [];
    viewInit = false;
    hasCase = false;
    hasPatient = false;
    mode = "Add"
    user = this.utility.getUserDetails();
    currentCases = [];
    nonInvitedMembers = [];
    selectedUsers = [];
    isUploadingData = false;
    emailArray = {}
    @ViewChild(CvfastNewComponent) inviteText!: CvfastNewComponent;
    isInvite = false;

    patientObject = null;
    caseObject = null;
    today = new Date();

    constructor(
        private route: ActivatedRoute,
        public utility: UtilityServiceV2,
        public formInterface: CrudOperationsService,
        private dataService: ApiDataService,
    ) { }

    ngAfterViewInit(): void {
        this.viewInit = true;
        this.formInterface.mainForm = this.mainForm
        this.formInterface.cvfast = this.cvfast;
        if (this.formInterface.object.toothguide)
            this.orders.setToothGuide(this.formInterface.object.toothguide)
    }

    ngOnInit(): void {
        this.formInterface.section = JSON.parse(JSON.stringify(this.utility.apiData[this.module]));
        this.formInterface.resetForm();
        this.loadData();
        this.formInterface.object.members = [];
    }

    async loadData() {
        await this.utility.loadPreFetchData("practices");
        await this.utility.loadPreFetchData("users");

        this.formInterface.loadDependencies().then(() => {
            this.formInterface.dependentData['patients'] = this.formInterface.dependentData['patients'].map(item => {
                item.fullName = item.firstName + " " + item.lastName;
                return item
            })
            this.currentCases = this.formInterface.dependentData['cases']

            this.route.parent.parent.paramMap.subscribe((parentParams) => {
                if (parentParams.get("caseId") && parentParams.get("caseId") != "") {
                    this.hasPatient = true
                    this.hasCase = true
                }


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
                            this.formInterface.hasData(params.get("id")).then((Reposne) => {
                                this.orders.setToothGuide(this.formInterface.object.toothguide);
                                this.populateCaseMembers(this.formInterface.object.caseId)
                            })
                        }
                    } else {
                        if (parentParams.get("caseId") && parentParams.get("caseId") != "") {
                            this.formInterface.loadCaseData(parentParams.get("caseId"))
                            this.populateCaseMembers(parentParams.get("caseId"))
                        }
                    }
                });
            });
        })
    }

    //Special functions for this class
    selectPatient(patientId) {
        this.formInterface.object.caseId = null
        this.caseMembers = []
        this.formInterface.object.members = []
        this.patientObject = null;
        if (!patientId) return;
        this.patientObject = this.formInterface.dependentData['patients'].find((cs) => cs.patientId == patientId)
        this.currentCases = patientId ? this.formInterface.dependentData['cases'].filter((cs) => cs.patientId == patientId) : this.formInterface.dependentData['cases']
        this.formInterface.object.patientId = patientId
    }

    selectCase(caseId) {
        this.formInterface.object.caseId = ""
        this.caseMembers = []
        this.formInterface.object.members = []
        this.caseObject = null;
        if (!caseId) return;
        //this.formInterface.object.patientId = event.patientId
        this.formInterface.object.caseId = caseId
        this.caseObject = this.formInterface.dependentData['cases'].find((cs) => cs.caseId == caseId)
        //this.formInterface.object.patientName = event.patientName
        this.populateCaseMembers(this.formInterface.object.caseId)
    }

    populateCaseMembers(caseId) {
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
                    if (Object.keys(this.emailArray).includes(item.emailAddress)) {
                        invited.push(item)
                    } else {
                        nonInvited.push(item)
                    }
                });
                this.caseMembers = [...invited]
                this.nonInvitedMembers = [...nonInvited]
                //members were changed from multiple to single in 5.21 cycle,to accomodate this code is implemented
                if (this.formInterface?.object?.members && this.formInterface.object.members.length > 0)
                    this.formInterface.object.members = this.formInterface.object.members[0].toString()
            }, (error) => {
                this.utility.showError(error.status)
                this.formInterface.isLoadingData = false;
            });
    }

    customSubmit(form, isDraft = false) {
        this.formInterface.object.isDraft = isDraft;

        if (this.formInterface.object.referralId && isDraft) {
            swal("Draft Not Allowed")
            return
        }

        // if (this.mode == "Add") {
        // 	let date1 = new Date(this.formInterface.object.startdate);
        // 	let date2 = new Date();

        // 	date1.setHours(0, 0, 0, 0);
        // 	date2.setHours(0, 0, 0, 0);

        // 	if (date1 < date2) {
        // 		swal("Start Date Should Not Be Less Than Today’s Date")
        // 		return
        // 	}
        // }

        // if (this.formInterface.object.startdate > this.formInterface.object.enddate) {
        // 	swal("End Date Should Be Greater Than Start Date")
        // 	return
        // }

        if (!this.formInterface.object.members) this.formInterface.object.members = [];

        if (this.hasCase)
            this.formInterface.section.backUrl = '/cases/cases/case-view/' + this.formInterface.object.caseId + '/referrals'
        this.formInterface.object.toothguide = this.orders.getToothGuide()
        if (!isDraft && this.formInterface.object.members.length == 0) {
            swal("Please Assign Member To Continue")
            return
        }
        if (isDraft && this.formInterface.object?.members.length > 0) {
            swal("Assigning Members To Draft Is Not Allowed")
            return
        }
        if (!isDraft && Object.keys(this.formInterface.object.toothguide).length === 0) {
            swal("Tooth Guide Should Not be Empty")
            return;
        }

        //members were changed from multiple to single in 5.21 cycle,to accomodate this code is implemented
        if (this.formInterface.object.members.length > 0) this.formInterface.object.members = [this.formInterface.object.members]
        this.formInterface.object.presentStatus = parseInt(this.formInterface.object.presentStatus);
        this.formInterface.onSubmit()
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

        //process cvfast Files --> send invites
        try {
            let cvfastText = await cvfast.processFiles();
            let promises = []
            let toBeAddedMembers = []
            this.selectedUsers.forEach(user => {
                toBeAddedMembers.push(user.dentalId);
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
            //this was changed --> single memeber only in 5.21 deleee
            //this.formInterface.object.members = [...this.formInterface.object.members, ...toBeAddedMembers]
            this.formInterface.object.mebers = [toBeAddedMembers[0]]
            this.populateCaseMembers(this.formInterface.object.caseId)
        } catch (error) {
            (error['status']) ? this.utility.showError(error['status']) : swal("Error processing request,please try again");
            this.isUploadingData = false;
            return;
        }
    }

    resetInviteForm() {
        this.selectedUsers = [];
        this.inviteText.resetForm();
        this.isInvite = false;
    }
}