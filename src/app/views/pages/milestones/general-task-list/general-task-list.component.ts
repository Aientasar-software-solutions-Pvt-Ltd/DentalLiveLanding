import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ApiDataService } from '../../users/api-data.service';
import { AccdetailsService } from '../../accdetails.service';
import { ActivatedRoute, Router } from '@angular/router';
import "@lottiefiles/lottie-player";
import { NgForm } from '@angular/forms';
import { filter } from 'smart-array-filter';
import { GeneralTaskAddComponent } from '../general-task-add/general-task-add.component';

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
  currentTime = Date.now();
  PendingcaseMembers = [];
  @Output() getData = new EventEmitter<any>();
  @Input() isModal = false;
  showTaskModal = false;
  caseDetail = null;
  @ViewChild(GeneralTaskAddComponent) addEditTask!: GeneralTaskAddComponent;

  constructor(private route: ActivatedRoute, private dataService: ApiDataService, private router: Router, public utility: UtilityServiceV2, private usr: AccdetailsService) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe((params) => {
      if (params.get("milestoneId") && params.get("milestoneId") != "") {
        this.milestoneId = params.get("milestoneId");
        if (!this.milestoneId) return
        this.loadBaseData();
      }
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
      let url = this.utility.baseUrl + this.module;

      if (this.milestoneId) url = url + "?milestoneId=" + this.milestoneId
      this.dataService.getallData(url, true).subscribe(Response => {
        if (Response) {
          let data = JSON.parse(Response.toString());
          this.baseDataPirstine = this.baseData = data.sort((first, second) => 0 - (first.dateCreated > second.dateCreated ? -1 : 1));
          this.getData.emit(this.baseData);
          this.isLoadingData = false;
          if (this.baseData && this.baseData.length > 0) {
            this.populatePendingCaseMembers(this.baseData[0].caseId);
            let caseDetails = this.utility.metadata.cases.find((item) => item.caseId == this.baseData[0].caseId)
            if (caseDetails)
              this.caseDetail = { ...caseDetails }
          }

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

  populatePendingCaseMembers(caseId) {
    this.dataService.getallData(this.utility.baseUrl + "caseinvites?caseId=" + caseId + "&presentStatus=0", true).subscribe(
      (Response) => {
        let data = JSON.parse(Response.toString());
        this.PendingcaseMembers = []
        data.forEach((item) => {
          if (this.user.emailAddress != item.invitedUserMail)
            this.PendingcaseMembers.push(item.invitedUserMail);
        })
        console.log(this.PendingcaseMembers)
      }, (error) => {
        this.utility.showError(error.status)
      });
  }

  hasPendingRequest(memberMail) {
    return this.PendingcaseMembers.includes(memberMail)
  }

  getUserImage(mail) {
    let img = this.utility.getMetaData(
      mail,
      "emailAddress",
      ["imageSrc"],
      "users"
    )
    return (img) ? "<img class='avatar avatar-icon avatar-sm rounded-circle my-2 me-2' src=" + this.utility.apiData.users.bucketUrl + encodeURIComponent(img.toString()) + ">" : " <span class='avatar-icon my-2 me-2' > " +
      this.utility.getMetaData(
        mail,
        "emailAddress",
        ["accountfirstName", "accountlastName"],
        "users"
      ).toString().charAt(0)
      + " </span>"
  }

  isTaskEdit = false;

  assignTask(taskId) {
    this.isTaskEdit = taskId;
    this.addEditTask.updateTaskId(taskId);
    this.showTaskModal = true;
  }

  closeTask() {
    this.isTaskEdit = false;
    this.addEditTask.formInterface.resetForm();
    this.addEditTask.cvfast.resetForm();
    this.showTaskModal = false;
  }
}