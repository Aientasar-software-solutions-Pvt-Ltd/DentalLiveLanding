import { Component, OnInit } from "@angular/core";
import { AccdetailsService } from "../../../accdetails.service";
import { ApiDataService } from "../../../users/api-data.service";
import { NgForm } from "@angular/forms";
import { filter } from "rxjs";
import { UtilityServiceV2 } from "src/app/utility-service-v2.service";
import { UtilityService } from "../../../users/utility.service";
import * as CryptoJS from 'crypto-js';
import { environment } from "src/environments/environment";
import swal from 'sweetalert';


@Component({
  selector: 'app-list-practice',
  templateUrl: './list-practice.component.html',
  styleUrls: ['./list-practice.component.css']
})
export class ListPracticeComponent implements OnInit {
  module = 'practices';
  isLoadingData = true;
  practiceDataPirstine: any;
  practiceData: any;
  shimmer = Array;
  dtOptions: DataTables.Settings = {};
  user = this.utility.getUserDetails()

  constructor(private dataService: ApiDataService, public utilityold: UtilityService, public utility: UtilityServiceV2) { }

  ngOnInit(): void {
    console.log(this.user)
    this.loadPractices();
    this.utility.getArrayObservable().subscribe(array => {
      if (array.some(el => el.module === this.module && el.isProcessed))
        this.loadPractices(true)
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

  loadPractices(force = false) {
    if (!force && this.practiceData) return;
    this.practiceData = []
    this.isLoadingData = true;
    let url = this.utility.baseUrl + this.module + '?resourceOwner=' + this.user.emailAddress;
    this.dataService.getallData(url, true).subscribe(Response => {
      if (Response) {
        let data = JSON.parse(Response.toString());
        this.practiceDataPirstine = this.practiceData = data.sort((first, second) => 0 - (first.dateCreated > second.dateCreated ? -1 : 1));
        //stupid library used-->fix required for no data label
        if (this.practiceData.length > 0) {
          Array.from(document.getElementsByClassName('dataTables_empty')).forEach(element => {
            element.classList.add('d-none')
          });
        }
      }
      this.isLoadingData = false;
    }, (error) => {
      this.utility.showError(error.status)
      this.isLoadingData = false;
    });
  }

  filterSubmit(form: NgForm) {
    let query = "";
    if (form.value.practiceName) {
      query = query + ' practiceName:' + form.value.practiceName
    }
    if (form.value.city) {
      query = query + ' city:' + form.value.practiceName
    }
    if (form.value.country) {
      query = query + ' country:' + form.value.practiceName
    }
    if (form.value.dateFrom) {
      query = query + ' dateCreated:>' + new Date(form.value.dateFrom).getTime()
    }
    if (form.value.dateTo) {
      query = query + ' dateCreated:>' + new Date(form.value.dateTo).getTime()
    }
    let filterData = filter(this.practiceDataPirstine, {
      keywords: query
    });
    this.practiceData = filterData
  }

  async makePrimary(practiceId) {
    let result = await swal('Are you sure want to make this Practice as your Primary Practice?', {
      buttons: ["Cancel", "Continue"],
    })
    if (result) {
      //post request here,both add & update are sent as post
      swal("Processing request...please wait...", {
        buttons: [false, false],
        closeOnClickOutside: false,
      });
      try {
        let userDetails = await this.dataService.getData(this.utilityold.apiData.userAccounts.ApiUrl, this.user.emailAddress, true).toPromise();
        if (!userDetails) return swal("Failed To Process Request, Please Try Again");
        let object = JSON.parse(userDetails.toString());
        object.primaryPractice = practiceId;
        object.isEdit = true;

        await this.dataService.putData(this.utilityold.apiData.userAccounts.ApiUrl, JSON.stringify(object)).toPromise();
        swal("Updated succesfully")
        this.user.primaryPractice = practiceId;
        let encrypt = CryptoJS.AES.encrypt(JSON.stringify(this.user), environment.decryptKey).toString();
        sessionStorage.setItem('usr', encrypt);

      } catch (error) {
        console.log(error)
        swal("Failed To Process Request, Please Try Again");
      }
    }
  }
}