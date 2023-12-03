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
                        this.utility.getArrayObservable().subscribe(array => {
                              if (array.some(el => el.module === this.module && el.isProcessed))
                                    this.loadBaseData()
                        });
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
                              //stupid library used-->fix required for no data label
                              if (this.baseData.length > 0) {
                                    Array.from(document.getElementsByClassName('dataTables_empty')).forEach(element => {
                                          element.classList.add('d-none')
                                    });
                              }
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

      async changeStatus(e) {
            try {
                  let result = await swal('Do you want to change the status of the case?', {
                        buttons: ["Cancel", "Continue"],
                  })
                  if (!result) {
                        e.target.value = this.baseData.caseRunningStatus;
                        return;
                  }
                  this.baseData.caseRunningStatus = parseInt(e.target.value)
                  swal("Processing request...please wait...", {
                        buttons: [false, false],
                        closeOnClickOutside: false,
                  });
                  let url = this.utility.baseUrl + this.module;
                  if (this.caseId) url = url + "?caseId=" + this.caseId
                  try {
                        await this.dataService.putData(url, JSON.stringify(this.baseData), true).toPromise();
                        //update status of all milsetones,referrals,labscripts if status is 1/2
                        //update status of all milsetones,labscripts if status is 3

                        //removed later
                        // try {
                        //       let inactiveUrl = this.utility.baseUrl + 'updateStatus';
                        //       let inactiveData = {
                        //             caseId: this.caseId,
                        //             presentStatus: e.target.value,
                        //             modules: e.target.value == 3 ? ['workorders', 'milestones'] : ['workorders', 'referrals', 'milestones']
                        //       }
                        //       await this.dataService.putData(inactiveUrl, JSON.stringify(inactiveData), true).toPromise();
                        //       await this.utility.loadPreFetchData("cases", true);
                        //       swal("Status Updated");
                        // } catch (error) {
                        //       (error['status']) ? this.utility.showError(error['status']) : swal("Error processing request,please try again");
                        // }
                  } catch (error) {
                        (error['status']) ? this.utility.showError(error['status']) : swal("Error processing request,please try again");
                  }
            } catch (error) {
                  swal.close();
                  (error['status']) ? this.utility.showError(error['status']) : swal("Error processing request,please try again");
                  return;
            }
      }

}