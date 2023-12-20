import { CvfastNewComponent } from 'src/app/cvfastFiles/cvfast-new/cvfast-new.component';
import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiDataService } from '../../users/api-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import "@lottiefiles/lottie-player";
import { NgForm } from '@angular/forms';
import { filter } from 'smart-array-filter';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-case-members',
    templateUrl: './case-members.component.html',
    styleUrls: ['./case-members.component.css']
})
export class CaseMembersComponent implements OnInit {

    @ViewChild(CvfastNewComponent) inviteText!: CvfastNewComponent;
    module = 'caseinvites';
    isLoadingData = true;
    baseDataPirstine: any;
    baseData: any;
    shimmer = Array;
    caseId = "";
    dtOptions: DataTables.Settings = {};
    user = this.utility.getUserDetails()
    selectedItem = null;
    selectedUsers = [];
    isUploadingData = false;
    invitations = ""
    nonInvitedMembers = [];
    caseDetail = null;
    checkboxedUsers = [];
    @ViewChild('selectAll') selectAll: ElementRef;
    isInvite = false;


    constructor(
        private route: ActivatedRoute,
        private dataService: ApiDataService,
        private router: Router,
        public utility: UtilityServiceV2,
        private cdref: ChangeDetectorRef
    ) { }

    ngOnInit(): void {

        this.route.parent.paramMap.subscribe(async (params) => {

            if (!this.caseId) {
                if (!params.get("caseId") || params.get("caseId") == "") {
                    this.router.navigate(['/cases/cases'])
                } else
                    this.caseId = params.get("caseId");
            }

            await this.utility.loadPreFetchData("users");
            await this.utility.loadPreFetchData("cases");
            await this.utility.loadPreFetchData("patients");
            await this.utility.loadPreFetchData("practices");

            if (this.caseId) {
                let caseDetails = this.utility.metadata.cases.find((item) => item.caseId == this.caseId)
                if (caseDetails)
                    this.caseDetail = { ...caseDetails }
                else
                    this.router.navigate(['/cases/cases'])
                this.loadBaseData()
                this.getNonInvitedMembers(caseDetails)

                this.utility.getArrayObservable().subscribe(array => {
                    if (array.some(el => el.module === this.module && el.isProcessed))
                        this.loadBaseData(true)
                });
            }
        });

        this.dtOptions = {
            dom: '<"datatable-top"f>rt<"datatable-bottom"lip><"clear">',
            pagingType: 'full_numbers',
            pageLength: 10,
            processing: true,
            responsive: true,
            language: {
                search: " <div class='search'><i class='bx bx-search'></i> _INPUT_</div>",
                lengthMenu: "Items per page _MENU_",
                info: "_START_ - _END_ of _TOTAL_",
                paginate: {
                    first: "<i class='bx bx-first-page'></i>",
                    previous: "<i class='bx bx-chevron-left'></i>",
                    next: "<i class='bx bx-chevron-right'></i>",
                    last: "<i class='bx bx-last-page'></i>"
                },
            },
            columnDefs: [{
                "defaultContent": "-",
                "targets": "_all"
            }]
        };
    }

    searchText(event: any) {
        var v = event.target.value;  // getting search input value
        $('#dataTables').DataTable().search(v).draw();
    }

    loadBaseData(reload = false) {
        if (this.baseData && !reload) return;
        this.isLoadingData = true;
        try {
            let url = this.utility.baseUrl + this.module;
            if (this.caseId) url = url + "?caseId=" + this.caseId
            this.dataService.getallData(url, true).subscribe(Response => {
                this.isLoadingData = false;
                if (Response) {
                    let data = JSON.parse(Response.toString());
                    this.baseDataPirstine = this.baseData = data.sort((first, second) => 0 - (first.dateUpdated < second.dateUpdated ? -1 : 1));
                    this.cdref.detectChanges()
                    //stupid library used-->fix required for no data label
                    if (this.baseData.length > 0) {
                        Array.from(document.getElementsByClassName('dataTables_empty')).forEach(element => {
                            element.classList.add('d-none')
                        });
                    }
                }
            }, (error) => {
                this.utility.showError(error.status)
                this.isLoadingData = false;
            });
        } catch (error) {
            console.log(error)
            this.isLoadingData = false;
        }
    }

    filterSubmit(form: NgForm) {
        let query = "";
        if (form.value.dateFrom) {
            query = query + ' dateCreated:>' + new Date(form.value.dateFrom).getTime()
        }
        if (form.value.dateTo) {
            query = query + ' dateCreated:>' + new Date(form.value.dateTo).getTime()
        }
        let filterData = filter(this.baseDataPirstine, {
            keywords: query
        });
        this.baseData = filterData
    }

    //runs on caseChange 
    async getNonInvitedMembers(caseDetail) {
        //get list of invited members
        this.nonInvitedMembers = [];
        if (!caseDetail) return;
        try {
            let url = this.utility.baseUrl + this.module + "?caseId=" + this.caseDetail.caseId;
            let Response = await this.dataService.getallData(url, true).toPromise()
            if (Response) {
                let members = JSON.parse(Response.toString());
                if (!members || members.length == 0) {
                    this.nonInvitedMembers = [...this.utility.metadata.users]
                } else {
                    let assignMem = []
                    this.utility.metadata.users.forEach(arr => {
                        if (!members.find(user => user.invitedUserMail == arr.emailAddress))
                            assignMem.push(arr);
                    });
                    this.nonInvitedMembers = assignMem
                }
                //remove case owner from list
                const index = this.nonInvitedMembers.findIndex(element => element.emailAddress == caseDetail.resourceOwner);
                if (index >= 0) this.nonInvitedMembers.splice(index, 1);
            }

        } catch (error) {
            (error['status']) ? this.utility.showError(error['status']) : swal("Error processing request,please try again");
            return;
        }
    }

    //special function for this class
    async sendInvite(cvfast: CvfastNewComponent) {
        if (!this.caseDetail) {
            swal("Please Select A Case To Continue");
            return;
        }
        if (this.selectedUsers.length == 0) {
            swal("Please Select Members");
            return;
        }
        this.isUploadingData = true;

        //process cvfast Files --> send invites
        try {
            let cvfastText = await cvfast.processFiles();
            let promises = []
            this.selectedUsers.forEach(user => {
                let invite = {
                    "invitationId": "",
                    "caseId": this.caseDetail.caseId,
                    "patientId": this.caseDetail.patientId,
                    "patientName": this.caseDetail.patientName,
                    "invitedUserMail": user.emailAddress,
                    "invitedUserId": user.dentalId,
                    "presentStatus": 0,
                    "invitationText": cvfastText,
                }
                promises.push(this.dataService.postData(this.utility.baseUrl + this.module, JSON.stringify(invite), true).toPromise())
            });
            await Promise.all(promises)
            swal("Invitations sent succesfully")
            document.getElementById("addInvite").click();
            this.resetInviteForm()
            this.isUploadingData = false;
            this.loadBaseData(true)
        } catch (error) {
            (error['status']) ? this.utility.showError(error['status']) : swal("Error processing request,please try again");
            this.isUploadingData = false;
            return;
        }
    }

    async removeMember() {
        if (!this.selectedItem) return
        let item = { ...this.selectedItem }
        this.isUploadingData = true;
        try {
            let result = await swal('Are you sure want to delete this invitation?', {
                buttons: ["Cancel", "Continue"],
            })
            if (result) {
                item.presentStatus = 3;
                swal("Processing...please wait...", {
                    buttons: [false, false],
                    closeOnClickOutside: false,
                });
                await this.dataService.putData(this.utility.baseUrl + this.module, JSON.stringify(item), true).toPromise();
                swal.close();
                this.selectedItem = null;
                this.isUploadingData = false;
                this.loadBaseData(true)
            }
        } catch (error) {
            swal.close();
            (error['status']) ? this.utility.showError(error['status']) : swal("Error processing request,please try again");
            return;
        }
    }

    resetInviteForm() {
        this.selectedUsers = [];
        this.inviteText.resetForm();
        this.isInvite = false;
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

        if (!this.caseDetail) {
            swal("Please Select A Case To Continue");
            return;
        }

        swal("Processing...please wait...", {
            buttons: [false, false],
            closeOnClickOutside: false,
        });

        this.dataService.getallData(this.utility.baseUrl + "sendinvite?caseId=" + this.caseDetail.caseId + "&name=" + form.value.name + "&email=" + form.value.email, true).subscribe(Response => {
            if (Response) Response = JSON.parse(Response.toString());
            swal.close();
            swal('New member invited successfully');
            form.reset()
        }, error => {
            if (error.status == 418)
                swal("User already a member of Dental-Live")
            else
                (error['status']) ? this.utility.showError(error['status']) : swal("Error processing request,please try again");
            return;
        });
    }

    toggleSelectAll(e) {
        this.checkboxedUsers = [];
        if (e.currentTarget.checked) this.checkboxedUsers = [...this.baseData];
        this.baseData.map(item => item.isChecked = !item.isChecked)
    }

    checkMember(e, member) {
        if (e.currentTarget.checked)
            this.checkboxedUsers.push(member)
        else {
            this.checkboxedUsers = this.checkboxedUsers.filter(object => {
                return member !== object;
            });
        }
    }

    sendMailAll(isSchedule) {
        if (this.checkboxedUsers.length == 0) {
            swal("Please Select Members");
            return;
        }

        if (this.selectAll.nativeElement.checked) {
            // Swal.fire({
            //   title: `You have initiated a ${isSchedule ? 'Schedule Meeting' : 'Email'}  with all the Colleagues,Would you like to continue?`,
            //   showCancelButton: true,
            //   confirmButtonText: 'Yes,Continue',
            //   denyButtonText: `Cacnel`,
            // }).then((result) => {
            //   if (result.isConfirmed) {
            //     let emails = this.checkboxedUsers.map(item => { return item.invitedUserMail })
            //     let link = `/mail/compose/${isSchedule ? 1 : 0}/${this.caseDetail?.patientId}/${this.caseDetail?.caseId
            //       }/${emails.join(",")}"`
            //     this.router.navigate([link]);
            //   }
            // })
            let emails = this.checkboxedUsers.map(item => { return item.invitedUserMail })
            let link = `/mail/compose/${isSchedule ? 1 : 0}/${this.caseDetail?.patientId}/${this.caseDetail?.caseId
                }/${emails.join(",")}`
            this.router.navigate([link]);
        } else {
            let emails = this.checkboxedUsers.map(item => { return item.invitedUserMail })
            let link = `/mail/compose/${isSchedule ? 1 : 0}/${this.caseDetail?.patientId}/${this.caseDetail?.caseId
                }/${emails.join(",")}`
            this.router.navigate([link]);
        }
    }

    getUserImage(email) {
        let img = this.utility.getMetaData(
            email,
            "emailAddress",
            ["imageSrc"],
            "users"
        )
        let imgArray = img && img.toString().split(",")
        return (imgArray && imgArray.length > 0) ? "<img class='avatar avatar-icon avatar-sm rounded-circle my-2 me-2' src=" + this.utility.apiData.users.bucketUrl + imgArray[0] + ">" : " <span class='avatar-icon my-2 me-2' > " +
            this.utility
                .getMetaData(
                    email,
                    "emailAddress",
                    ["accountfirstName", "accountlastName"],
                    "users"
                ).toString().charAt(0)
            + " </span>"
    }

}