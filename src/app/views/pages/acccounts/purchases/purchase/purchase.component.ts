//@ts-nocheck
import { PermissionGuardService } from '../../../permission-guard.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert';
import { get } from 'scriptjs';
import { UtilityService } from '../../../users/utility.service';
import { ApiDataService } from '../../../users/api-data.service';
import { AccdetailsService } from '../../../accdetails.service';
@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit, AfterViewInit {
  section = this.utility.apiData.userPurchases;
  isLoadingData = false;
  isApplyingCoupon = false;
  object: any;
  packagePrice = 0.00;
  viewplan: string;
  taxRate = 13;
  discount = 0;
  user = this.usr.getUserDetails();
  packageID = null;
  isFreeTrail = false;
  constructor(private router: Router, private route: ActivatedRoute, private utility: UtilityService, private dataService: ApiDataService, private permGuard: PermissionGuardService, private usr: AccdetailsService) { }
  ngOnInit() {
    if (!this.user || !this.user.emailAddress || !this.user.dentalId) {
      swal("Please Login to Purchase");
      this.router.navigate(['/auth/login']);
    }
    this.isLoadingData = true;
    this.object = this.section.object;
    delete this.object.dependencies;
    this.object.email = this.user.emailAddress;
    this.object.accountID = this.user.dentalId;
    this.object.modeOfPayment = 'PayPal';
    this.route.paramMap.subscribe(params => {
      if (!params.get('id') || params.get('id') == "") {
        swal("invalid PackageID and type");
        this.router.navigate(['/accounts/packages']);
        return;
      }
      this.packageID = params.get('id');
      if (params.get('addonID')) {
        this.object.isAddOn = true;
        this.object.addOnId = params.get('addonID');
      }
    });
  }
  ngAfterViewInit(): void {
    this.dataService.getallData(this.section.ApiUrl + `?email=${this.user.emailAddress}&package=${this.packageID}`, true).subscribe(
      (Response) => {
        if (Response) Response = JSON.parse(Response.toString());
        if (!Response) {
          swal("invalid PackageID,PackageID dosent Exist");
          this.router.navigate(['/accounts/packages'])
          return;
        }
        let current = new Date().getTime();
        if (Response['activationDate'] > current || (Response['deactivationDate'] && Response['deactivationDate'] <= current) || (Response['expirationDate'] && Response['expirationDate'] <= current)) {
          swal("Package has Expired");
          this.router.navigate(['/accounts/packages'])
          return;
        }
        if (Response['isRecurring'] && Response['purchases'] && Response['purchases'].length > 1) {
          swal("Package cannot be repurchased");
          this.router.navigate(['/accounts/packages'])
          return;
        }
        if (Response['isFreeTrail']) {
          this.isFreeTrail = true;
          this.object.modeOfPayment = 'Free Trail';
        }

        let packageDetail = Response;
        this.object.packageID = packageDetail['packageID'];
        if (this.object.isAddOn) {
          if (!this.object.addOnId) {
            swal('Invalid Add-On');
            this.router.navigate(['/accounts/packages']);
            return;
          }
          let isExist = false;
          for (let addon of packageDetail['addOnList']) {
            if (addon['addOnId'] == this.object.addOnId) {
              isExist = true;
              this.viewplan = packageDetail['packageName'] + '(' + addon['addonName'] + ')';
              this.packagePrice = addon['price'];
              break;
            }
          }
          if (!isExist) {
            swal('Invalid Add-On');
            this.router.navigate(['/accounts/packages']);
            return;
          }
        } else {
          this.viewplan = packageDetail['packageName'];
          this.packagePrice = packageDetail['packagePrice'];
        }
        if (this.getStatus(Response)) {
          this.isLoadingData = false;
          this.renderButton(this.packagePrice, this.viewplan, this.discount);
        }
      }, (error) => {
        swal("invalid PackageID,PackageID dosent Exist");
        this.router.navigate(['/accounts/packages']);
      });
  }
  renderButton(packagePrice, viewplan, discount) {
    if (this.isFreeTrail) return;
    let savedetails = this.saveDetails
    let currency = "USD"
    let purchaseObject = this.object;
    let purchaseURL = this.section.ApiUrl;
    let service = this.dataService;
    let permGurd = this.permGuard;
    get('https://www.paypal.com/sdk/js?client-id=ASvcwG18xAFBQKf_SV__FlKal7v6NNOXu2tsh54PldSAM93Aldct5DGA4JvEn7Vx3Y088ElIDF4YC95L&currency=' + currency, () => {
      //@ts-ignore
      paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'blue',
          layout: 'vertical',
          label: 'pay',
        },
        createOrder: function (data, actions) {
          let couponDiscount = Math.floor(((discount / 100) * packagePrice) * 100) / 100;
          let itemTotal = Math.floor((packagePrice - couponDiscount) * 100) / 100;
          let tax = Math.floor(((13 / 100) * (itemTotal)) * 100) / 100;
          let total = itemTotal + tax;
          //refetch package details and couopn code and then send that -- (future)
          return actions.order.create({
            purchase_units: [{
              "description": viewplan,
              "amount": {
                "currency_code": currency,
                "value": total.toFixed(2),
                "breakdown": {
                  "item_total": {
                    "currency_code": currency,
                    "value": itemTotal.toFixed(2)
                  },
                  "shipping": {
                    "currency_code": currency,
                    "value": 0
                  },
                  "tax_total": {
                    "currency_code": currency,
                    "value": tax.toFixed(2)
                  }
                }
              }
            }]
          });
        },
        onApprove: function (data, actions) {
          swal("Processing Payment!", "please wait...", "info", {
            buttons: [false, false],
            closeOnClickOutside: false,
          });
          return actions.order.capture().then(function (details) {
            savedetails(details, purchaseObject, purchaseURL, service, permGurd);
          });
        },
        onError: function (err) {
          swal("unable to process payment,please try again");
        }
      }).render('#paypal-button-container');
    });
  }

  subscribePackage() {
    this.saveDetails({}, this.object, this.section.ApiUrl, this.dataService, this.permGuard);
  }

  getStatus(Response): boolean {
    if (this.object.isAddOn) return true;
    let current = new Date();
    var renew = new Date();
    renew.setDate(current.getDate() + 15);
    for (let purchase of Response.purchases) {
      if (purchase.renewalDate > current.getTime()) {
        if (purchase.renewalDate > renew.getTime()) {
          swal("Package Purchased");
          this.router.navigate(['/accounts/packages']);
          return false;
        }
      }
    }
    return true;
  }
  applyCoupon(coupon) {
    this.discount = 0;
    this.object.couponCode = "";
    this.object.couponID = "";
    if (!coupon) {
      this.renderButton(this.packagePrice, this.viewplan, this.discount);
      return;
    };
    this.isApplyingCoupon = true
    this.dataService.getallData(this.utility.apiData.usage.ApiUrl + `?type=coupon&couponcode=${coupon}`, true)
      .subscribe(Response => {
        if (Response) Response = JSON.parse(Response.toString());
        if (Response && Response['discount']) {
          this.object.couponCode = Response['couponName'];
          this.object.couponID = Response['couponID'];
          this.discount = Response['discount'];
          this.renderButton(this.packagePrice, this.viewplan, this.discount);
          swal(`Coupon Applied ${this.discount} % Discount`);
        }
        else swal("Invalid Coupon Code");
      }, () => {
        swal("Invalid Coupon Code");
        this.isApplyingCoupon = false;
        // @ts-ignore
      }, () => {
        this.isApplyingCoupon = false;
      })
  }
  saveDetails(details, purchaseObject, purchaseURL, service, permGurd) {
    purchaseObject.payPal = details;
    service.postData(purchaseURL, JSON.stringify(purchaseObject))
      .subscribe(() => {
        swal("Payment Made successfully");
        permGurd.forceReload = true;
        document.location.href = `/accounts/packages`;
      }, () => {
        swal("Saving Data Failed,Please contact Dental-Live");
      })
  }
}




