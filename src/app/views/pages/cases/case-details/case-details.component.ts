import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { Component, OnInit } from '@angular/core';
import { ApiDataService } from '../../users/api-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import "@lottiefiles/lottie-player";
import swal from 'sweetalert';
@Component({
  selector: 'app-case-details',
  templateUrl: './case-details.component.html',
  styleUrls: ['./case-details.component.css']
})
export class CaseDetailsComponent implements OnInit {

  module = 'cases';
  isLoadingData = true;
  baseData: any;
  caseId = "";
  user = this.utility.getUserDetails()
  showDescription = false;
  backTo = "/cases"


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: ApiDataService,
    public utility: UtilityServiceV2
  ) { }

  ngOnInit(): void {
    this.route.parent.paramMap.subscribe((params) => {
      if (params.get("caseId") && params.get("caseId") != "") {
        this.caseId = params.get("caseId");
        this.loadBaseData();
      } else {
        swal("No Data Found");
        this.router.navigate([this.backTo])
      }
    });
  }

  async loadBaseData() {
    try {
      let url = this.utility.baseUrl + this.module;
      if (this.caseId) url = url + "?caseId=" + this.caseId
      this.dataService.getallData(url, true).subscribe(Response => {
        if (Response) {
          this.baseData = JSON.parse(Response.toString());
          this.isLoadingData = false;
        }
      }, (error) => {
        this.utility.showError(error.status)
        this.isLoadingData = false;
        this.router.navigate([this.backTo])
      });
    } catch (error) {
      swal("No Data Found");
      console.log(error)
      this.router.navigate([this.backTo])
    }
  }

  //special function
  getCaseType(id) {
    return this.utility.casetype.find(element => element.id === id).name;
  }

}