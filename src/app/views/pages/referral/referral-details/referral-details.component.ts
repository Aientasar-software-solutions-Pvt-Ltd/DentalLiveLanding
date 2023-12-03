import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { ReferralGuideComponent } from '../referral-guide/referral-guide.component';
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';


@Component({
    selector: 'app-referral-details',
    templateUrl: './referral-details.component.html',
    styleUrls: ['./referral-details.component.css']
})
export class ReferralDetailsComponent implements OnInit {
    @ViewChild(ReferralGuideComponent) orders: ReferralGuideComponent;
    module = 'referrals';
    isLoadingData = true;
    baseData: any;
    id = "";
    isDetail = true;
    hasCase = false;
    section = this.utility.apiData[this.module]
    backUrl = this.section.backUrl
    user = this.utility.getUserDetails()

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public utility: UtilityServiceV2,
        private dataService: ApiDataService,
    ) { }

    ngAfterViewInit(): void {
        if (this.baseData.toothguide)
            this.orders.setToothGuide(this.baseData.toothguide)
    }

    async ngOnInit(): Promise<void> {
        this.baseData = this.section.object
        if (this.utility.metadata.patients.length == 0)
            await this.utility.loadPreFetchData("patients");
        if (this.utility.metadata.cases.length == 0)
            await this.utility.loadPreFetchData("cases");
        if (this.utility.metadata.users.length == 0)
            await this.utility.loadPreFetchData("users");


        this.route.parent.parent.paramMap.subscribe((parentParams) => {

            if (parentParams.get("caseId") && parentParams.get("caseId") != "") {
                this.hasCase = true
                this.backUrl = '/cases/cases/case-view/' + parentParams.get("caseId") + '/referrals'
            }

            this.route.paramMap.subscribe((params) => {
                if (params.get("id") && params.get("id") != "") {
                    this.id = params.get("id");
                    this.loadBaseData();
                } else {
                    swal("No Data Found");
                    if (this.hasCase)
                        this.router.navigate([this.backUrl])
                    else
                        this.router.navigate([this.backUrl])
                }
            });
        });
    }

    async loadBaseData() {
        try {
            let url = this.utility.baseUrl + this.module;
            if (this.id) url = url + "?" + this.section.keyName + "=" + this.id
            this.dataService.getallData(url, true).subscribe(Response => {
                if (Response) {
                    this.baseData = JSON.parse(Response.toString());
                    console.log(this.baseData)
                    console.log(this.user)
                    this.orders.setToothGuide(this.baseData.toothguide);
                    this.isLoadingData = false;
                }
            }, (error) => {
                this.utility.showError(error.status)
                this.isLoadingData = false;
                this.router.navigate([this.backUrl])
            });
        } catch (error) {
            swal("No Data Found");
            console.log(error)
            this.router.navigate([this.backUrl])
        }
    }

    async changeStatus(e) {
        try {
            let result = await swal('Do you want to change the staus of the Referral?', {
                buttons: ["No", "Yes,Update Status"],
            })
            if (!result) {
                e.target.value = this.baseData.presentStatus;
                return;
            }
            this.baseData.presentStatus = parseInt(e.target.value)
            swal("Processing request...please wait...", {
                buttons: [false, false],
                closeOnClickOutside: false,
            });
            let url = this.utility.baseUrl + this.module;
            if (this.id) url = url + "?" + this.section.keyName + "=" + this.id
            console.log(this.baseData)
            try {
                await this.dataService
                    .putData(url, JSON.stringify(this.baseData), true).toPromise();
                swal("Status Updated");
            } catch (error) {
                console.log(error)
                swal("Unable To Update, Please Try Again");
            }
        } catch (error) {
            swal.close();
            (error['status']) ? this.utility.showError(error['status']) : swal("Error processing request,please try again");
            return;
        }
    }
}
