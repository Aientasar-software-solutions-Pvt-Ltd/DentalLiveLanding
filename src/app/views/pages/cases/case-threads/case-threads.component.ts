import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { Component, OnInit } from '@angular/core';
import { ApiDataService } from '../../users/api-data.service';
import { AccdetailsService } from '../../accdetails.service';
import { ActivatedRoute, Router } from '@angular/router';
import "@lottiefiles/lottie-player";

@Component({
  selector: 'app-case-threads',
  templateUrl: './case-threads.component.html',
  styleUrls: ['./case-threads.component.css'],
  exportAs: 'CaseThreadsComponent'
})
export class CaseThreadsComponent implements OnInit {

  module = 'threads';
  isLoadingData = true;
  baseDataPirstine: any;
  baseData: any;
  shimmer = Array;
  caseId = "";

  constructor(private route: ActivatedRoute, private dataService: ApiDataService, private router: Router, public utility: UtilityServiceV2, private usr: AccdetailsService) { }

  ngOnInit(): void {

    this.route.parent.paramMap.subscribe((params) => {
      if (params.get("caseId") && params.get("caseId") != "")
        this.caseId = params.get("caseId");
      this.loadBaseData();
    });
  }

  async loadBaseData() {
    try {
      await this.utility.loadPreFetchData("users");
      let url = this.utility.baseUrl + this.module;
      if (this.caseId) url = url + "?caseId=" + this.caseId
      this.dataService.getallData(url, true).subscribe(Response => {
        if (Response) {
          let data = JSON.parse(Response.toString());
          this.baseDataPirstine = this.baseData = data.sort((first, second) => 0 - (first.dateCreated > second.dateCreated ? -1 : 1));
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


  getText(thread) {
    // switch (this.utility.threadMetaData[thread.sk.split("#")[0]][
    // "label"
    // ]) {
    //   case value:

    //     break;

    //   default:
    //     break;
    // }
    //  == "File"
    //   ? " Show Files"
    //   : utility.threadMetaData[thread.sk.split("#")[0]][
    //     "label"
    //   ] == "Message"
    //     ? thread[
    //     utility.threadMetaData[thread.sk.split("#")[0]][
    //     "details"
    //     ]
    //     ]["text"]
    //     : thread[
    //     utility.threadMetaData[thread.sk.split("#")[0]][
    //     "details"
    //     ]
    //     ]
  }
}