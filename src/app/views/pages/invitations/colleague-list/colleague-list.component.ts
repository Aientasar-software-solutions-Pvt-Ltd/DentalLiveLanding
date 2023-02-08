import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { Component, Input, OnInit } from '@angular/core';
import { ApiDataService } from '../../users/api-data.service';
import { AccdetailsService } from '../../accdetails.service';
import { ActivatedRoute, Router } from '@angular/router';
import "@lottiefiles/lottie-player";
import { NgForm } from '@angular/forms';
import { filter } from 'smart-array-filter';
@Component({
  selector: 'app-colleague-list',
  templateUrl: './colleague-list.component.html',
  styleUrls: ['./colleague-list.component.css']
})
export class ColleagueListComponent implements OnInit {

  module = 'users';
  isLoadingData = true;
  baseDataPirstine: any;
  baseData: any;
  shimmer = Array;
  dtOptions: DataTables.Settings = {};
  user = this.utility.getUserDetails()

  constructor(private route: ActivatedRoute, private dataService: ApiDataService, private router: Router, public utility: UtilityServiceV2, private usr: AccdetailsService) { }

  ngOnInit(): void {
    this.loadBaseData();

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
      let data = this.utility.metadata.users;
      console.log(data)
      if (data) {
        this.baseDataPirstine = this.baseData = data.sort((first, second) => 0 - (first.dateCreated > second.dateCreated ? -1 : 1));
        this.isLoadingData = false;
      }
    } catch (error) {
      console.log(error)
    }
  }


  filterSubmit(form: NgForm) {
    let query = "";
    if (form.value.accountFirstName) {
      query = query + ' accountFirstName:' + form.value.accountFirstName
    }
    if (form.value.accountLastName) {
      query = query + ' accountLastName:' + form.value.accountLastName
    }
    if (form.value.emailAddress) {
      query = query + ' emailAddress:' + form.value.emailAddress
    }
    if (form.value.city) {
      query = query + ' city:' + form.value.city
    }
    if (form.value.country) {
      query = query + ' country:' + form.value.country
    }
    let filterData = filter(this.baseDataPirstine, {
      keywords: query
    });
    this.baseData = filterData
  
  }

}
