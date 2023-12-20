import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { Component, OnInit } from '@angular/core';
import { ApiDataService } from '../../users/api-data.service';
import { AccdetailsService } from '../../accdetails.service';
import { ActivatedRoute, Router } from '@angular/router';
import "@lottiefiles/lottie-player";
import { Tooltip } from 'node_modules/bootstrap/dist/js/bootstrap.esm.min.js'
@Component({
    selector: 'app-case-view-master',
    templateUrl: './case-view-master.component.html',
    styleUrls: ['./case-view-master.component.css']
})
export class CaseViewMasterComponent implements OnInit {

    module = 'cases';
    isLoadingData = true;
    baseDataPirstine: any;
    baseData: any;
    caseId = "";
    user = this.utility.getUserDetails()
    caseOwnerDetails = null;


    constructor(private route: ActivatedRoute, private dataService: ApiDataService, private router: Router, public utility: UtilityServiceV2, private usr: AccdetailsService) { }

    ngOnInit(): void {

        Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            .forEach(tooltipNode => new Tooltip(tooltipNode))

        this.route.paramMap.subscribe((params) => {

            if (params.get("caseId") && params.get("caseId") != "") {
                this.caseId = params.get("caseId");
                this.loadBaseData();
            }
        });
    }

    async loadBaseData() {
        try {
            let url = this.utility.baseUrl + this.module;
            if (this.caseId) url = url + "?caseId=" + this.caseId
            await this.utility.loadPreFetchData("patients");
            await this.utility.loadPreFetchData("users");
            await this.utility.loadPreFetchData("practices");
            this.dataService.getallData(url, true).subscribe(Response => {
                if (Response) {
                    this.baseDataPirstine = this.baseData = JSON.parse(Response.toString());
                    console.log(this.baseData)
                    this.caseOwnerDetails = this.utility.metadata["users"].find(x => x["emailAddress"] == this.baseData.resourceOwner);
                    this.isLoadingData = false;
                }
            }, (error) => {
                this.utility.showError(error.status)
                this.isLoadingData = false;
            });
        } catch (error) {
            console.log(error)
        }
    }

}