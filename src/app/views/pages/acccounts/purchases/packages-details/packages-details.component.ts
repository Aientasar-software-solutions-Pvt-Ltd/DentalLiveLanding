//@ts-nocheck
import { UtilityService } from '../../../users/utility.service';
import { PermissionGuardService } from '../../../permission-guard.service';
import { ApiDataService } from '../../../users/api-data.service';
import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from "sweetalert";
import { AccdetailsService } from '../../../accdetails.service';

@Component({
    selector: 'app-packages-details',
    templateUrl: './packages-details.component.html',
    styleUrls: ['./packages-details.component.css']
})
export class PackagesDetailsComponent implements OnInit {

    constructor(private router: Router, private route: ActivatedRoute, private dataService: ApiDataService, private utility: UtilityService, private permGuard: PermissionGuardService, private usr: AccdetailsService) { }

    section = this.utility.apiData.packages;//speical case object casting is for packages,however microservice is userpurchase
    object: any;
    isLoadingData = false;
    user = this.usr.getUserDetails();
    status = 0;
    packageID = null;

    loadData() {
        this.dataService.getallData(`https://chvuidsbp0.execute-api.us-west-2.amazonaws.com/default/userpurchases?email=${this.user['emailAddress']
            }&package=${this.packageID}`, true).subscribe(
                (Response) => {
                    if (Response) Response = JSON.parse(Response.toString());
                    let current = new Date();
                    if (Response['activationDate'] > current || (Response['deactivationDate'] && Response['deactivationDate'] <= current) || (Response['expirationDate'] && Response['expirationDate'] <= current)) {
                        swal("Package has Expired");
                        this.router.navigate(['/mail/packages']);
                    }
                    this.object = Response;
                    this.getStatus(Response);
                    this.isLoadingData = false;
                }, error => {
                    swal("No Package Exists");
                    this.router.navigate(['/mail/packages']);
                })
    }

    getStatus(Response) {
        let currentTime = new Date();
        if (Response['activationDate'] > currentTime || (Response['deactivationDate'] > 0 && Response['deactivationDate'] <= currentTime) || (Response['expirationDate'] > 0 && Response['expirationDate'] <= currentTime)) {
            this.status = -1;//Inactive Package
            return;
        }
        if (!Response.purchases || Response.purchases.length == 0) {
            this.status = 0;//never purchase
            return;
        }
        let current = new Date();
        var renew = new Date();
        renew.setDate(current.getDate() + 15);
        for (let purchase of Response.purchases) {
            if (purchase.renewalDate > current.getTime()) {
                //its purchased and live
                if (purchase.renewalDate < renew.getTime()) {
                    this.status = 2;//up for renewal
                    return;
                } else {
                    this.status = 1;//live
                    return;
                }
            }
            if (purchase.renewalDate < current.getTime()) {
                this.status = 3;//expired
                return;
            }
        }
    }

    hasData() {
        this.route.paramMap.subscribe(params => {
            if (params.get('id') && params.get('id') != "") {
                this.packageID = params.get('id');
                this.loadData();
            } else {
                swal("No data exists");
                this.router.navigate(['/mail/packages']);
            }
        });
    }

    ngOnInit() {
        this.isLoadingData = true;
        this.object = this.section.object;
        this.hasData();
    }


}
