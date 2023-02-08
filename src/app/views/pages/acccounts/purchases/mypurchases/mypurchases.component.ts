//@ts-nocheck
import { ListData, UtilityService } from '../../../users/utility.service';
import { ApiDataService } from '../../../users/api-data.service';
import { Component, OnInit } from '@angular/core';
import { InvoiceGeneratorService } from 'src/app/views/pages/invoice-generator.service';
import sortArray from 'sort-array';
import { AccdetailsService } from '../../../accdetails.service';

@Component({
  selector: 'app-mypurchases',
  templateUrl: './mypurchases.component.html',
  styleUrls: ['./mypurchases.component.css']
})
export class MypurchasesComponent implements OnInit, ListData {
  constructor(private dataService: ApiDataService, private utility: UtilityService, private invoice: InvoiceGeneratorService, private usr: AccdetailsService) { }
  isLoadingData = false;
  objectList: any;
  pristineData: any;
  itemsPerPage = 10;
  pageNumber = 0;
  // select this appropriately
  object = this.utility.apiData.userPurchases;
  user = this.usr.getUserDetails()['emailAddress'];
  loadData() {
    // Get Form Data via API
    this.dataService.getallData(this.object.ApiUrl + `?email=${this.user}`, true).subscribe(
      (Response) => {
        if (Response) Response = JSON.parse(Response.toString());
        this.objectList = Response;
        this.pristineData = Response;
        this.objectList = this.objectList.sort((a, b) => (a.dateCreated > b.dateCreated) ? 1 : -1);
      }, error => {
      }, () => {
        this.isLoadingData = false;
      });
  }
  loadInvoice(id) {
    this.invoice.loadData(id);
  }
  ngOnInit() {
    this.isLoadingData = true;
    this.objectList = [];
    this.loadData();
  }
  filterData(filterValue: string) {
    this.objectList = this.pristineData.filter((product) => {
      if (product.couponCode || product.dependencies.package.packageName) {
        return (
          product.couponCode.toLowerCase().includes(filterValue) || product.dependencies.package.packageName.toLowerCase().includes(filterValue));
      }
    });
  }
  getAddOnName(id, purchase) {
    for (let addon of purchase.dependencies.package.addOnList) {
      if (addon.addOnId == id) return addon.addonName;
    }
  }

  sortBoolean: any = {};
  sortData(sortValue) {
    this.sortBoolean[sortValue] = this.sortBoolean[sortValue] ? false : true;
    if (sortValue.includes('.'))
      sortArray(this.objectList, {
        by: 'value', order: this.sortBoolean[sortValue] ? 'desc' : 'asc', computed: {
          value: row => {
            let rowSelect;
            for (let ar of sortValue.split("."))
              rowSelect ? rowSelect = rowSelect[ar] : rowSelect = row[ar];
            return rowSelect;
          }
        }
      });
    else
      sortArray(this.objectList, { by: sortValue, order: this.sortBoolean[sortValue] ? 'desc' : 'asc' });
  }

  counter(items: number) {
    return new Array(Math.round(items / this.itemsPerPage));
  }
  // helper function
  // tslint:disable-next-line:variable-name
  changePage(number: number) {
    this.pageNumber = number * this.itemsPerPage;
  }
  findAddOn(Package, addOnID) {
    return Package.addOnList.find(e => e.addonID == addOnID)
  }
}
