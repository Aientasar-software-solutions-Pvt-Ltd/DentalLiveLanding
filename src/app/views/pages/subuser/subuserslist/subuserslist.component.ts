//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import sortArray from 'sort-array';
import { AccdetailsService } from '../../accdetails.service';
import { ApiDataService } from '../../users/api-data.service';
import { ListData, UtilityService } from '../../users/utility.service';

@Component({
  selector: 'app-subuserslist',
  templateUrl: './subuserslist.component.html',
  styleUrls: ['./subuserslist.component.css']
})
export class SubuserslistComponent implements OnInit, ListData {
  constructor(
    private dataService: ApiDataService,
    private utility: UtilityService,
    private usr: AccdetailsService
  ) { }

  isLoadingData = false;
  objectList: any = {};
  pristineData: any;
  itemsPerPage = 10;
  pageNumber = 0;
  // select this appropriately
  object = this.utility.apiData.subUser;
  private user = this.usr.getUserDetails()['emailAddress'];

  loadData() {
    //Get Form Data via API
    this.dataService.getallData(this.object.ApiUrl + `?did=${this.user}`, true)
      .subscribe(Response => {
        if (Response) Response = JSON.parse(Response.toString());
        this.objectList = Response;
        this.pristineData = Response;
        console.log(Response);
      }, error => {

      }, () => {
        this.isLoadingData = false;
      })
  }

  ngOnInit() {
    this.isLoadingData = true;
    this.objectList = [];
    this.loadData();
  }

  filterData(filterValue: string) {
    if (!filterValue) {
      this.objectList = this.pristineData;
      return;
    }
    this.objectList = this.pristineData.filter((subuser) => {
      if (subuser.firstName || subuser.lastName || subuser.email)
        return (
          subuser.firstName.toLowerCase().includes(filterValue) || subuser.lastName.toLowerCase().includes(filterValue) || subuser.email.toLowerCase().includes(filterValue)
        );
    });
  }

  sortBoolean: any = {};
  sortData(sortValue) {
    this.sortBoolean[sortValue] = this.sortBoolean[sortValue] ? false : true;
    sortArray(this.objectList, { by: sortValue, order: this.sortBoolean[sortValue] ? 'desc' : 'asc' });
  }

  counter(items: number) {
    return new Array(Math.round(items / this.itemsPerPage));
  }

  getCount() {
    return parseInt(this.itemsPerPage.toString()) + parseInt(this.pageNumber.toString());
  }

  // helper function
  changePage(number: number) {
    this.pageNumber = number * this.itemsPerPage;
  }
}
