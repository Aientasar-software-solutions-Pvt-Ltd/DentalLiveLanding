//@ts-nocheck
import { ListData, UtilityService } from '../../../users/utility.service';
import { ApiDataService } from '../../../users/api-data.service';
import { Component, OnInit } from '@angular/core';
import { AccdetailsService } from '../../../accdetails.service';

@Component({
  selector: 'app-packages-list',
  templateUrl: './packages-list.component.html',
  styleUrls: ['./packages-list.component.css']
})
export class PackagesListComponent implements OnInit, ListData {

  constructor(private dataService: ApiDataService, public utility: UtilityService, private usr: AccdetailsService) { }
  isLoadingData = false;
  objectList: any;
  pristineData: any;
  itemsPerPage = 10;
  pageNumber = 0;
  // select this appropriately
  object = this.utility.apiData.packages;//speical case object casting is for packages,however microservice is userpurchase
  user = this.usr.getUserDetails()['emailAddress'];

  loadData() {
    // Get Form Data via API
    this.dataService.getallData(`https://chvuidsbp0.execute-api.us-west-2.amazonaws.com/default/userpurchases?email=${this.user}&live=true`, true).subscribe(
      (Response) => {
        if (Response) Response = JSON.parse(Response.toString());
        this.objectList = Response;
        this.pristineData = Response;
      }, error => {

      }, () => {
        this.isLoadingData = false;
      });
  }

  ngOnInit() {
    this.isLoadingData = true;
    this.objectList = [];
    this.loadData();
  }

  filterData(filterValue: string) {
    this.objectList = this.pristineData.filter((product) => {
      if (product.firstName || product.lastName || product.dependencies.package.packageName || product.dependencies.role.roleName) {
        return (
          product.firstName.toLowerCase().includes(filterValue) || product.lastName.toLowerCase().includes(filterValue) || product.dependencies.package.packageName.toLowerCase().includes(filterValue) || product.dependencies.role.roleName.toLowerCase().includes(filterValue)
        );
      }
    });
  }

  sortData(sortValue: string) {
    switch (sortValue) {
      case '0': {
        this.objectList = this.objectList.sort((a, b) => (a.firstName > b.firstName) ? 1 : -1);
        break;
      }
      case '1': {
        this.objectList = this.objectList.sort((a, b) => (a.dependencies.package.packageName > b.dependencies.package.packageName) ? 1 : -1);
        break;
      }
      case '2': {
        this.objectList = this.objectList.sort((a, b) => (a.dependencies.role.roleName > b.dependencies.role.roleName) ? 1 : -1);
        break;
      }
    }
  }

  counter(items: number) {
    return new Array(Math.ceil(items / this.itemsPerPage));
  }

  // helper function
  // tslint:disable-next-line:variable-name
  changePage(number: number) {
    this.pageNumber = number * this.itemsPerPage;
  }
}