import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { Component, OnInit } from '@angular/core';
import "@lottiefiles/lottie-player";
import { NgForm } from '@angular/forms';
import { filter } from 'smart-array-filter';

@Component({
    selector: 'app-patients-list',
    templateUrl: './patients-list.component.html',
    styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit {

    module = 'patients';
    isLoadingData = true;
    pristineData: any;
    data: any;
    shimmer = Array;
    dtOptions: DataTables.Settings = {};
    user = this.utility.getUserDetails()
    caseList: any;

    constructor(public utility: UtilityServiceV2) { }

    ngOnInit(): void {
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
        this.loadPatients(true);
        this.utility.getArrayObservable().subscribe(array => {
            console.log(array)
            if (array.some(el => el.module === this.module && el.isProcessed))
                this.loadPatients(true);
        });
    }

    searchText(event: any) {
        var v = event.target.value;  // getting search input value
        $('#dataTables').DataTable().search(v).draw();
    }

    async loadPatients(force = false) {
        if (!force && this.data) return;
        await this.utility.loadPreFetchData("cases", true);
        await this.utility.loadPreFetchData("patients", true);
        this.data = [];
        this.pristineData = [];
        this.isLoadingData = true;


        //edge case when there is only one patient
        if (this.utility.metadata["patients"].length == 1)
            this.utility.metadata["patients"][0]['caseList'] = this.utility.metadata.cases.filter((item) => item.patientId == this.utility.metadata["patients"][0].patientId);


        this.data = this.utility.metadata["patients"].sort((first, second) => {
            if (!first.hasOwnProperty("caseList"))
                first['caseList'] = this.utility.metadata.cases.filter((item) => item.patientId == first.patientId);

            if (!second.hasOwnProperty("caseList"))
                second['caseList'] = this.utility.metadata.cases.filter((item) => item.patientId == second.patientId);

            return 0 - (first.firstName > second.firstName ? -1 : 1);
        });

        //stupid library used-->fix required for no data label
        if (this.data.length > 0) {
            Array.from(document.getElementsByClassName('dataTables_empty')).forEach(element => {
                element.classList.add('d-none')
            });
        }
        this.isLoadingData = false;
    }

    isActive(): any {
        let isActive = true;
        this.data.forEach(element => {
            if (element["caseRunningStatus"] > 1) isActive = false;
        });
        return isActive;
    }

    getCaseCount(data, type) {
        let count = 0;
        if (!data) return count;
        data.forEach(element => {
            if (type) {
                if (!element["caseRunningStatus"] || element["caseRunningStatus"] <= 1) count = count + 1;
            }
            else if (element["caseRunningStatus"] > 1) count = count + 1
        });
        return count;
    }

    filterSubmit(form: NgForm) {
        let query = "";
        if (form.value.firstName) {
            query = query + ' firstName:' + form.value.firstName
        }
        if (form.value.dateFrom) {
            query = query + ' dateCreated:>' + new Date(form.value.dateFrom).getTime()
        }
        if (form.value.dateTo) {
            query = query + ' dateCreated:>' + new Date(form.value.dateTo).getTime()
        }
        let filterData = filter(this.pristineData, {
            keywords: query
        });
        this.data = filterData;
    }
}