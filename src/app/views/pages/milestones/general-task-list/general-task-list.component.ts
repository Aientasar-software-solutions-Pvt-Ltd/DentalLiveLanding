import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { Component, Input, OnInit } from '@angular/core';
import { ApiDataService } from '../../users/api-data.service';
import { AccdetailsService } from '../../accdetails.service';
import { ActivatedRoute, Router } from '@angular/router';
import "@lottiefiles/lottie-player";
import { NgForm } from '@angular/forms';
import { filter } from 'smart-array-filter';

@Component({
  selector: 'app-general-task-list',
  templateUrl: './general-task-list.component.html',
  styleUrls: ['./general-task-list.component.css']
})
export class GeneralTaskListComponent implements OnInit {

  module = 'tasks';
  isLoadingData = true;
  baseDataPirstine: any;
  baseData: any;
  shimmer = Array;
  milestoneId = "";
  dtOptions: DataTables.Settings = {};
  user = this.utility.getUserDetails()

  constructor(private route: ActivatedRoute, private dataService: ApiDataService, private router: Router, public utility: UtilityServiceV2, private usr: AccdetailsService) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe((params) => {
 
      if (params.get("milestoneId") && params.get("milestoneId") != "")
        this.milestoneId = params.get("milestoneId");
      this.loadBaseData();
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
      let url = this.utility.baseUrl + this.module;
      if (this.milestoneId) url = url + "?milestoneId=" + this.milestoneId
      this.dataService.getallData(url, true).subscribe(Response => {
        if (Response) {
          let data = JSON.parse(Response.toString());
          this.baseDataPirstine = this.baseData = data.sort((first, second) => 0 - (first.dateCreated > second.dateCreated ? -1 : 1));
          this.isLoadingData = false;
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
}