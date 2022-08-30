import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AccdetailsService } from './views/pages/accdetails.service';
import { ApiDataService } from './views/pages/users/api-data.service';
import { UtilityService } from './views/pages/users/utility.service';


(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class InvoiceGeneratorService {

  section = this.utility.apiData.userPurchases;
  object: any;

  user = this.usr.getUserDetails()['emailAddress'];
  constructor(private http: HttpClient, private dataService: ApiDataService, private utility: UtilityService, public datepipe: DatePipe, private usr: AccdetailsService) { }
  loadData(id) {
    this.dataService.getallData(this.section.ApiUrl + `?email=${this.user}&id=${id}`, true).subscribe(
      (Response) => {
        if (Response) Response = JSON.parse(Response.toString());
        this.object = Response;
        var docDefinition = {
          content: [
            {
              columns: [
                {
                  image: 'data:image/png;base64,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',
                  margin: [0, 3, 0, 0],
                },
                [
                  {
                    text: 'Invoice',
                    color: '#1991EB',
                    fontSize: 28,
                    bold: true,
                    alignment: 'left',
                    margin: [0, 0, 0, 15],
                  },
                  {
                    stack: [
                      {
                        width: '100%',
                        margin: [0, 0, 0, 5],
                        columns: [
                          {
                            text: 'Invoice Number :  ',
                            color: '#011A3E',
                            bold: true,
                            width: '*',
                            fontSize: 12,
                          },
                          {
                            text: this.object.customerInvoiceId,
                            color: '#354053',
                            fontSize: 12,
                            alignment: 'left',
                            width: '70%',
                          },
                        ],
                      },
                      {
                        margin: [0, 0, 0, 5],
                        columns: [
                          {
                            text: 'Date :  ',
                            color: '#011A3E',
                            bold: true,
                            fontSize: 12,
                            width: '*',
                          },
                          {
                            text: this.datepipe.transform(this.object.dateCreated, 'mediumDate'),
                            color: '#354053',
                            fontSize: 12,
                            alignment: 'left',
                            width: '70%',
                          },
                        ],
                      },
                      {
                        margin: [0, 0, 0, 5],
                        columns: [
                          {
                            text: 'Status :  ',
                            color: '#011A3E',
                            bold: true,
                            fontSize: 12,
                            width: '*',
                          },
                          {
                            text: 'PAID',
                            fontSize: 14,
                            alignment: 'left',
                            color: '#354053',
                            width: '70%',
                          },
                        ],
                      }
                    ],
                  }
                ],
              ],
            },
            {
              columns: [
                {
                  text: 'Bill To',
                  width: '50%',
                  color: '#011A3E',
                  bold: true,
                  fontSize: 14,
                  alignment: 'left',
                  margin: [0, 20, 0, 5],
                },
                {
                  text: 'Bill From',
                  width: '50%',
                  color: '#011A3E',
                  bold: true,
                  fontSize: 14,
                  alignment: 'left',
                  margin: [0, 20, 0, 5],
                },
              ],
            },
            {
              columns: [
                {
                  text: this.object.dependencies.user.accountfirstName + ' ' + this.object.dependencies.user.accountlastName,
                  color: '#354053',
                  width: '50%',
                  alignment: 'left'
                },
                {
                  text: 'ATP Group Inc.',
                  width: '50%',
                  color: '#354053',
                  alignment: 'left',
                },
              ],
            },
            {
              columns: [
                {
                  text: 'Email ID : ',
                  color: '#011A3E',
                  bold: true,
                  width: '50%',
                  margin: [0, 15, 0, 5],
                },
                {
                  text: 'Address',
                  width: '50%',
                  color: '#011A3E',
                  bold: true,
                  margin: [0, 15, 0, 3],
                }
              ],
            },
            {
              columns: [
                {
                  text: this.object.dependencies.user.emailAddress,
                  color: '#354053',
                  width: '50%',
                  margin: [0, 5, 0, 5],
                },
                {
                  text: '6175 Hwy 7, Unit 1A | Woodbridge, ON | L4H 0P6',
                  width: '50%',
                  color: '#354053'
                }
              ],
            },
            {
              columns: [
                {
                  text: 'Address',
                  color: '#011A3E',
                  bold: true,
                  width: '50%',
                  margin: [0, 10, 0, 5],
                }
              ],
            },
            {
              columns: [
                {
                  text: this.object.dependencies.user.address != "" ? this.object.dependencies.user.address : "--",
                  color: '#354053',
                  width: '50%',
                  margin: [0, 10, 0, 5],
                }
              ],
            },
            '\n',
            {
              columns: [
                {
                  text: 'Payment Mode',
                  color: '#011A3E',
                  bold: true,
                  fontSize: 14,
                  alignment: 'left',
                  margin: [0, 10, 0, 5],
                }
              ],
            },
            {
              columns: [
                {
                  text: ' Paypal',
                  color: '#354053',
                  alignment: 'left',
                }
              ],
            },
            {
              columns: [
                {
                  text: 'Details',
                  color: '#011A3E',
                  bold: true,
                  fontSize: 14,
                  alignment: 'left',
                  margin: [0, 10, 0, 5],
                }
              ],
            },
            {
              columns: [
                {
                  text: this.object.dependencies.package.packageName + ' ' + (this.object.isAddOn ? this.object.dependencies.package.addOnList.find((o) => o.addOnId == this.object.addOnId).addonName + " - Addon" : "") + '\n' +
                    "Products : " + this.object.dependencies.package.products + '\n' +
                    "Description : " + this.object.dependencies.package.description + '\n' +
                    "Users Allocated : " + (this.object.isAddOn ? (this.object.dependencies.package.addOnList.find((o) => o.addOnId == this.object.addOnId).parameterId == 0 ? this.object.dependencies.package.addOnList.find((o) => o.addOnId == this.object.addOnId).parameterValue : "-") : this.object.dependencies.package.usersAllocated) + '\n' +
                    "Storage Allocated : " + (this.object.isAddOn ? (this.object.dependencies.package.addOnList.find((o) => o.addOnId == this.object.addOnId).parameterId == 1 ? this.object.dependencies.package.addOnList.find((o) => o.addOnId == this.object.addOnId).parameterValue + "GB" : "-") : this.object.dependencies.package.usersAllocated),
                  color: '#354053',
                  alignment: 'left',
                },
              ],
            },
            '\n',
            {
              width: '100%',
              alignment: 'center',
              text: 'Purchase Details',
              bold: true,
              margin: [0, 20, 0, 10],
              fontSize: 15,
              color: '#011A3E',
            },
            {
              table: {
                headerRows: 1,
                widths: ['*', 80],
                body: [
                  [
                    {
                      text: 'ITEM DESCRIPTION',
                      fillColor: '#f5f5f5',
                      border: [false, true, false, true],
                      margin: [0, 5, 0, 5],
                      textTransform: 'uppercase',
                      color: '#011A3E',
                    },
                    {
                      text: 'ITEM TOTAL',
                      border: [false, true, false, true],
                      alignment: 'right',
                      fillColor: '#f5f5f5',
                      margin: [0, 5, 0, 5],
                      textTransform: 'uppercase',
                      color: '#011A3E',
                    },
                  ],
                  [
                    {
                      text: this.object.dependencies.package.packageName + ' ' + (this.object.isAddOn ? this.object.dependencies.package.addOnList.find((o) => o.addOnId == this.object.addOnId).addonName + " - Addon" : "") + '\n' +
                        "Products : " + this.object.dependencies.package.products + '\n' +
                        "Description : " + this.object.dependencies.package.description + '\n' +
                        "Users Allocated : " + (this.object.isAddOn ? (this.object.dependencies.package.addOnList.find((o) => o.addOnId == this.object.addOnId).parameterId == 0 ? this.object.dependencies.package.addOnList.find((o) => o.addOnId == this.object.addOnId).parameterValue : "-") : this.object.dependencies.package.usersAllocated) + '\n' +
                        "Storage Allocated : " + (this.object.isAddOn ? (this.object.dependencies.package.addOnList.find((o) => o.addOnId == this.object.addOnId).parameterId == 1 ? this.object.dependencies.package.addOnList.find((o) => o.addOnId == this.object.addOnId).parameterValue + "GB" : "-") : this.object.dependencies.package.usersAllocated),
                      border: [false, false, false, true],
                      margin: [0, 5, 0, 5],
                      alignment: 'left',
                      color: '#354053',
                    },
                    {
                      border: [false, false, false, true],
                      text: '$ ' + this.object.actualPrice + ' USD',
                      alignment: 'right',
                      margin: [0, 5, 0, 5],
                      color: '#354053',
                    },
                  ],
                  [
                    {
                      text: this.object.dependencies.coupon.discount ? 'Coupon Discount (' + this.object.dependencies.coupon.couponName + ') - ' + this.object.dependencies.coupon.discount + '%' : "No Coupon Applied",
                      border: [false, false, false, true],
                      margin: [0, 5, 0, 5],
                      alignment: 'left',
                      color: '#354053',
                    },
                    {
                      border: [false, false, false, true],
                      text: this.object.dependencies.coupon.discount ? '$ ' + ((this.object.dependencies.coupon.discount / 100) * this.object.actualPrice) + ' USD' : "--",
                      alignment: 'right',
                      margin: [0, 5, 0, 5],
                      color: '#354053',
                    },
                  ],
                ],
              },
            },
            '\n',
            {
              table: {
                headerRows: 1,
                widths: ['*', 'auto'],
                body: [
                  [
                    {
                      text: 'Payment total',
                      border: [false, false, false, false],
                      alignment: 'right',
                      margin: [0, 0, 0, 5],
                      color: '#354053',
                    },
                    {
                      border: [false, false, false, false],
                      text: '$ ' + this.object.price + ' USD',
                      alignment: 'right',
                      margin: [0, 0, 0, 5],
                      color: '#354053',
                    },
                  ],
                  [
                    {
                      text: 'Tax Price',
                      border: [false, false, false, false],
                      alignment: 'right',
                      margin: [0, 0, 0, 5],
                      color: '#354053',
                    },
                    {
                      text: '$ ' + this.object.taxPrice + ' USD',
                      border: [false, false, false, false],
                      alignment: 'right',
                      margin: [0, 0, 0, 5],
                      color: '#354053',
                    },
                  ],
                  [
                    {
                      text: 'Total Amount',
                      bold: true,
                      fontSize: 20,
                      alignment: 'right',
                      border: [false, false, false, false],
                      margin: [0, 5, 0, 5],
                      color: '#354053',
                    },
                    {
                      text: '$ ' + this.object.totalPrice + ' USD',
                      bold: true,
                      fontSize: 20,
                      alignment: 'right',
                      border: [false, false, false, false],
                      margin: [0, 5, 0, 5],
                      color: '#354053',
                    },
                  ],
                ],
              },
            },
            '\n',
            {
              text: 'Thank you for using DentalLive. As always, if you need a hand, our Support Team is here to help. Reach us at help@dentallive.com or 1-416-744-4275.',
              color: '#354053',
              alignment: 'center',
              fontSize: '10'
            },
          ],
        }
        pdfMake.createPdf(docDefinition).open();
      }, error => {
      })
  }
}
