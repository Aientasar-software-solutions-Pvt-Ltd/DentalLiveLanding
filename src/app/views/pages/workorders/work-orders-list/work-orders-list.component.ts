import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { Component, Input, OnInit } from '@angular/core';
import { ApiDataService } from '../../users/api-data.service';
import { AccdetailsService } from '../../accdetails.service';
import { ActivatedRoute, Router } from '@angular/router';
import "@lottiefiles/lottie-player";
import { NgForm } from '@angular/forms';
import { filter } from 'smart-array-filter';

@Component({
    selector: 'app-work-orders-list',
    templateUrl: './work-orders-list.component.html',
    styleUrls: ['./work-orders-list.component.css']
})
export class WorkOrdersListComponent implements OnInit {
    module = 'workorders';
    isLoadingData = true;
    baseDataPirstine: any;
    baseData: any;
    shimmer = Array;
    caseId = "";
    dtOptions: DataTables.Settings = {};
    user = this.utility.getUserDetails()
    currentTime = Date.now();
    caseDetail = null;

    constructor(private route: ActivatedRoute, private dataService: ApiDataService, private router: Router, public utility: UtilityServiceV2, private usr: AccdetailsService) { }

    ngOnInit(): void {

        this.route.parent.parent.paramMap.subscribe(async (params) => {
            if (params.get("caseId") && params.get("caseId") != "") {
                await this.utility.loadPreFetchData("cases");
                this.caseId = params.get("caseId");
                let caseDetails = this.utility.metadata.cases.find((item) => item.caseId == this.caseId)
                if (caseDetails)
                    this.caseDetail = { ...caseDetails }
            }
            this.loadBaseData();
        });


        this.utility.getArrayObservable().subscribe(array => {
            if (array.some(el => el.module === this.module && el.isProcessed))
                this.loadBaseData()
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

    async loadBaseData() {
        try {
            await this.utility.loadPreFetchData("users");
            await this.utility.loadPreFetchData("cases");
            await this.utility.loadPreFetchData("patients");
            await this.utility.loadPreFetchData("practices");
            await this.utility.loadPreFetchData("caseinvites");
            let url = this.utility.baseUrl + this.module;
            if (this.caseId) url = url + "?caseId=" + this.caseId
            this.dataService.getallData(url, true).subscribe(Response => {
                if (Response) {
                    let data = JSON.parse(Response.toString());
                    data = data.filter(obj => !obj.isDraft || (obj.isDraft && obj.resourceOwner == this.user.emailAddress));
                    this.baseDataPirstine = this.baseData = data.sort((first, second) => 0 - (first.dateCreated > second.dateCreated ? -1 : 1));
                    this.isLoadingData = false;
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
        if (form.value.title) {
            query = query + ' title:' + form.value.title
        }
        if (form.value.dateFrom) {
            query = query + ' dateCreated:>' + new Date(form.value.dateFrom).getTime()
        }
        if (form.value.dateTo) {
            query = query + ' dateCreated:<' + new Date(form.value.dateTo).getTime()
        }
        let filterData = filter(this.baseDataPirstine, {
            keywords: query
        });
        this.baseData = filterData
    }

    getUserImage(members) {
        let img = this.utility.getMetaData(
            members,
            "dentalId",
            ["imageSrc"],
            "users"
        )
        let user = this.utility.getMetaData(
            members,
            "dentalId",
            ["accountfirstName", "accountlastName"],
            "users"
        )?.toString()?.charAt(0)
        let imgArray = img && img.toString().split(",")
        return (imgArray && imgArray.length > 0) ? "<img class='avatar avatar-icon avatar-sm rounded-circle my-2 me-2' src=" + this.utility.apiData.users.bucketUrl + encodeURIComponent(imgArray[0]) + ">" : " <span class='avatar-icon my-2 me-2' > " + user + " </span>"
    }

    hasPendingRequest(members, caseId) {
        return this.utility.metadata['caseinvites'].some(x => x['caseId'] == caseId && x['presentStatus'] == 0 && x['invitedUserId'] == members[0]);
    }

    getPatientImage(pid) {
        let img = this.utility.getMetaData(
            pid,
            "patientId",
            ["image"],
            "patients"
        )
        return (img) ? "<img class='avatar avatar-icon avatar-sm rounded-circle my-2 me-2' src=https://dentallive-patients.s3.us-west-2.amazonaws.com/" + encodeURIComponent(img.toString()) + ">" : " <span class='avatar-icon my-2 me-2' > " +
            this.utility.getMetaData(
                pid,
                "patientId",
                ["firstName", "lastName"],
                "patients"
            ).toString().charAt(0)
            + " </span>"
    }
}