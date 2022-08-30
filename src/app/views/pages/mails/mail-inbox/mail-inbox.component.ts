import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { mail } from '../../email.service';
import { Router } from '@angular/router';
import { AccdetailsService } from '../../accdetails.service';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';


@Component({
  selector: 'app-mail-inbox',
  templateUrl: './mail-inbox.component.html',
  styleUrls: ['./mail-inbox.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MailInboxComponent implements OnInit {

  private user = this.usr.getUserDetails()['emailAddress']
  isetr = this.usr.getUserDetails().etrID ? true : false;
  type = "INC";
  typename = "Inbox";
  typecol = "MailFrom"
  private patientId = 0;
  private caseId = 0;
  private subUserId = 0;
  data = {};
  shimmer = Array;
  loading = true;
  patientList: any = [];
  caseList: any = [];
  subuserList: any = [];
  username = "";
  pathType = "inbox"

  mails: mail[] = [];
  displayedColumns: string[] = ['MailFrom', 'subject', 'mailDateTime'];
  dataSource: MatTableDataSource<mail>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('case') case!: ElementRef;


  constructor(private router: Router, private dataService: ApiDataService, private usr: AccdetailsService, private utility: UtilityService) { }

  ngOnInit() {
    this.username = this.usr.getUserDetails().accountfirstName + " " + this.usr.getUserDetails().accountlastName;
    if (this.router.url == "/mail/sent") {
      this.displayedColumns = ['MailTo', 'subject', 'mailDateTime'];
      this.type = "OUT"
      this.typename = "Sent";
      this.typecol = "MailTo";
      this.pathType = "sent"
    }
    this.data = { "user": this.user, "mailType": this.type, "pid": this.patientId, "cid": this.caseId, "sid": this.subUserId }
    this.fetchData();
  }

  fetchData() {
    let email = this.usr.getUserDetails().emailAddress;
    this.dataService.getallData(`https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/patients`, true)
      .subscribe(Response => {
        if (Response) Response = JSON.parse(Response.toString());
        this.patientList = Response;
      }, error => {
        this.loading = false;
      })

    this.dataService.getallData(`https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/cases`, true)
      .subscribe(Response => {
        if (Response) Response = JSON.parse(Response.toString());
        this.caseList = Response;
      }, error => {
        this.loading = false;
      })

    if (!this.isetr) {
      this.dataService.getallData(this.utility.apiData.subUser.ApiUrl + `?did=${this.user}`, true)
        .subscribe(Response => {
          if (Response) Response = JSON.parse(Response.toString());
          this.subuserList = Response
        }, error => {
          this.loading = false;
        })
    }
    this.fetchMails();
  }

  fetchMails() {
    this.loading = true;
    this.dataService.postData(this.utility.apiData.mails.ApiUrl, JSON.stringify(this.data), true)
      .subscribe(Response => {
        if (Response) Response = JSON.parse(Response.toString());
        ;
        if (Response) {
          //@ts-ignore
          this.dataSource = new MatTableDataSource(Response);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.loading = false;
        }
      }, error => {
        this.loading = false;
        return null;
      })
  }

  getThreadCount(ref) {
    if (!ref)
      return "";
    if (typeof (ref) === 'string') {
      ref = ref.split('>');
      return ref.length;
    } else {
      return ref.length + 1;
    }
  }

  updateCaseFilter() {
    this.dataService.getallData(this.patientId ? `https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/cases?patientId=${this.patientId}` : `https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/cases`, true)
      .subscribe(Response => {
        if (Response) Response = JSON.parse(Response.toString());
        this.caseList = Response;
        this.case.nativeElement.value = "";
      }, error => {
        this.loading = false;
      })
    this.case.nativeElement.value = "";
  }

  filterPatient(event) {
    this.patientId = event ? event : 0;
    this.data = { "user": this.user, "mailType": this.type, "pid": this.patientId, "cid": this.caseId, "sid": this.subUserId };
    this.fetchMails();
    this.updateCaseFilter();
  }

  filterCase(caseId) {
    this.caseId = caseId ? caseId : 0;
    this.data = { "user": this.user, "mailType": this.type, "pid": this.patientId, "cid": this.caseId, "sid": this.subUserId };
    this.fetchMails();
  }

  filterSubuser(event) {
    this.subUserId = event ? event : 0;
    this.data = { "user": this.user, "mailType": this.type, "pid": this.patientId, "cid": this.caseId, "sid": this.subUserId };
    this.fetchMails();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
