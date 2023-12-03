import { CvfastNewComponent } from 'src/app/cvfastFiles/cvfast-new/cvfast-new.component';
import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { ApiDataService } from '../../users/api-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import "@lottiefiles/lottie-player";
import { CrudOperationsService } from 'src/app/crud-operations.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-case-message',
  templateUrl: './case-message.component.html',
  styleUrls: ['./case-message.component.css'],
  exportAs: 'CaseMessageComponent',
  providers: [CrudOperationsService]
})
export class CaseMessageComponent implements OnInit, AfterViewInit {

  @ViewChild(CvfastNewComponent) cvfast!: CvfastNewComponent;
  @Input() messageType = "0";
  @Input() messageReferenceId = "0";
  @Input() caseId = "";
  @Input() noEdit = false;
  module = 'messages';
  isLoadingData = true;
  baseDataPirstine: any;
  baseData: any;
  shimmer = Array;
  caseDetails = null;
  user = this.utility.getUserDetails();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: ApiDataService,
    public utility: UtilityServiceV2,
    public formInterface: CrudOperationsService,
  ) { }

  ngAfterViewInit(): void {
    this.formInterface.cvfast = this.cvfast;
  }

  ngOnInit(): void {
    this.formInterface.section = this.utility.apiData[this.module]
    this.formInterface.resetForm();

    this.route.parent.paramMap.subscribe((params) => {
      if (!this.caseId) {
        if (!params.get("caseId") || params.get("caseId") == "") {
          this.router.navigate(['/cases/cases'])
        } else
          this.caseId = params.get("caseId");
      }
      this.loadCaseData().then((Response) => {
        this.caseDetails = Response
        this.loadBaseData();
        this.utility.getArrayObservable().subscribe(array => {
          if (array.some(el => el.module === this.module && el.isProcessed))
            this.loadBaseData()
        });
      }, (error) => {
        console.log(error)
        swal("Unable to load case");
        if (this.messageType == "0")
          this.router.navigate(['/cases/cases'])
      })
    });

  }

  async loadBaseData() {
    try {
      if (this.utility.metadata.users.length == 0)
        await this.utility.loadPreFetchData("users");
      let url = this.utility.baseUrl + this.module;
      let hasParam = false;
      if (this.caseId) {
        url = url + (hasParam ? "&" : "?") + "caseId=" + this.caseId
        hasParam = true;
      }
      if (this.messageType) {
        url = url + (hasParam ? "&" : "?") + "messageType=" + this.messageType
        hasParam = true;
      }
      if (this.messageReferenceId != "0") {
        url = url + (hasParam ? "&" : "?") + "messageReferenceId=" + this.messageReferenceId
        hasParam = true;
      }
      this.dataService.getallData(url, true).subscribe(Response => {
        if (Response) {
          let data = JSON.parse(Response.toString());
          this.baseDataPirstine = this.baseData = data.sort((first, second) => 0 - (first.dateUpdated < second.dateUpdated ? -1 : 1));
          this.isLoadingData = false;
          //stupid library used-->fix required for no data label
          if (this.baseData.length > 0) {
            Array.from(document.getElementsByClassName('dataTables_empty')).forEach(element => {
              element.classList.add('d-none')
            });
          }
        }
      }, (error) => {
        console.log(error)
        if (this.messageType == "0")
          this.utility.showError(error.status)
        this.isLoadingData = false;
      });
    } catch (error) {
      console.log(error)
    }
  }

  //special fucntions for this component
  async customSubmit() {
    if (this.cvfast.cvfast.text == "" && this.cvfast.attachmentFiles.length == 0 && this.cvfast.cvfast.links.length == 0) {
      swal("Please Add Message or Attach File To Continue")
      return
    }
    try {
      this.formInterface.resetForm();
      this.formInterface.object.caseId = this.caseId
      this.formInterface.object.patientId = this.caseDetails.patientId
      this.formInterface.object.patientName = this.caseDetails.patientName
      this.formInterface.object.messageType = this.messageType
      this.formInterface.object.messageReferenceId = this.messageReferenceId
      let obj = await this.formInterface.onSubmit(false);
      if (obj) {
        //this.loadBaseData();
        this.cvfast.resetForm()
      }
    } catch (error) {
      console.log(error);
    }
  }

  async submitComment(messageObj, text) {
    if (!text) {
      swal("Please Add Comment To Continue")
      return
    }
    try {
      this.formInterface.resetForm();
      this.formInterface.object = messageObj;
      this.formInterface.isEditMode = true;
      this.formInterface.object.comments.push({
        resourceOwner: this.user.emailAddress,
        dateCreated: Date.now(),
        text: text
      })
      let obj = await this.formInterface.onSubmit(false);
      // if (obj)
      //   this.loadBaseData();

    } catch (error) {
      console.log(error);
    }
  }

  async loadCaseData() {
    try {
      let url = this.utility.baseUrl + "cases" + "?caseId=" + this.caseId;
      let Response = await this.dataService.getallData(url, true).toPromise()
      if (!Response) throw new Error("");
      return JSON.parse(Response.toString());
    } catch (error) {
      console.log(error)
      throw new Error("");
    }
  }

}