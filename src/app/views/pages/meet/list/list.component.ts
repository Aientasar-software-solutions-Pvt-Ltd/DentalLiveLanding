import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import sortArray from 'sort-array';
import { AccdetailsService } from '../../accdetails.service';
import { ApiDataService } from '../../users/api-data.service';
import { ListData, UtilityService } from '../../users/utility.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, ListData {
  @ViewChild("mainForm", { static: false }) mainForm: NgForm;
  user = {};
  cxDomain = 'https://dentallive.my3cx.ca:5001/webmeeting/api/v1';
  cxAPI = "65n2D8eEVwCfcUUb3J5McsLAveZzgkqZRc1YyQo17lPnnMJL2j4TDhJM4RjwfH36";
  headers = null;
  participants = [];
  constructor(
    private router: Router,
    private http: HttpClient,
    private dataService: ApiDataService,
    private utility: UtilityService,
    private usr: AccdetailsService,
    public sanitizer: DomSanitizer,
  ) { }
  ngOnInit(): void {

    this.isLoadingData = true;
    this.objectList = [];
    this.user = this.usr.getUserDetails();
    if (!this.user['cxId'] || !this.user['cxMail']) {
      swal('No Id assigned');
      this.router.navigate(['/auth/login']);
    }
    this.headers = new HttpHeaders({
      '3CX-ApiKey': this.cxAPI,
      'Content-Type': 'application/json'
    });
    this.loadData();
    this.loadRecording();
  }
  isLoadingData = false;
  objectList: any;
  pristineData: any;
  recordObjectList: any = [];
  recordPristineData: any = [];
  itemsPerPage = 10;
  pageNumber = 0;
  recorditemsPerPage = 10; I
  recordpageNumber = 0;
  isMeeting = true;
  mailText = "";
  datenow = new Date().getUTCFullYear() + '-' + ('0' + (new Date().getUTCMonth() + 1)).slice(-2) + '-' + ('0' + (new Date().getUTCDate() + 1)).slice(-2) + 'T' + ('0' + new Date().getUTCHours()).slice(-2) + ':' + ('0' + new Date().getUTCMinutes()).slice(-2);
  // select this appropriately
  object = this.utility.apiData.contacts;
  loadData() {
    this.isLoadingData = true;
    this.objectList = [];
    this.pristineData = [];
    this.http.get(`${this.cxDomain}/meetings/list?extension=${this.user['cxId']}`, { headers: this.headers })
      .subscribe(Response => {
        if (Response['result']['scheduledMeetings']) {
          this.objectList = Response['result']['scheduledMeetings'];
          this.pristineData = Response['result']['scheduledMeetings'];
        }
        this.isLoadingData = false;
      },
        error => {
          this.isLoadingData = false;
        }
      )
  }
  loadRecording() {
    this.isLoadingData = true;
    let data = { "user": this.user['emailAddress'], "mailType": "INC", "cxMail": this.user['cxMail'].split('@')[0] }
    this.dataService.postData(this.utility.apiData.mails.ApiUrl, JSON.stringify(data), true)
      .subscribe(Response => {
        if (Response) Response = JSON.parse(Response.toString());
        this.recordObjectList = Response;
        this.recordObjectList = this.recordObjectList.filter(item => !item.htmlText);
        this.recordPristineData = this.recordObjectList;
        this.isLoadingData = false;
      },
        error => {
          this.isLoadingData = false;
          return null;
        })
  }
  getTitle(text) {
    let str = "completed meeting,";
    var title = text.toString().substring(
      parseInt(text.toString().search(str)) + str.length,
      text.toString().search(":")
    );
    return title;
  }
  getTextData(text) {
    return this.urlify(text.replace(RegExp("\n", "g"), "<br>"));
  }
  filterData(filterValue: string) {
    if (!filterValue) {
      this.objectList = this.pristineData;
      return;
    }
    this.objectList = this.pristineData.filter((meeting) => {
      if (meeting.subject || meeting.description || meeting.datetime)
        return (
          meeting.subject.toLowerCase().includes(filterValue) || meeting.description.toLowerCase().includes(filterValue) || meeting.datetime.toLowerCase().includes(filterValue)
        );
    });
  }
  sortBoolean: any = {};
  sortData(sortValue) {
    this.sortBoolean[sortValue] = this.sortBoolean[sortValue] ? false : true;
    sortArray(this.objectList, { by: sortValue, order: this.sortBoolean[sortValue] ? 'desc' : 'asc' });
  }
  counter(items: number) {
    return new Array(Math.round(items / this.itemsPerPage));
  }
  getCount() {
    return parseInt(this.itemsPerPage.toString()) + parseInt(this.pageNumber.toString());
  }
  // helper function
  changePage(number: number) {
    this.pageNumber = number * this.itemsPerPage;
  }
  filterDataRecord(filterValue: string) {
    if (!filterValue) {
      this.recordObjectList = this.recordPristineData;
      return;
    }
    let str = "completed meeting,";
    this.recordObjectList = this.recordPristineData.filter((meeting) => {
      if (meeting.plainText) {
        var title = meeting.plainText.toString().substring(
          parseInt(meeting.plainText.toString().search(str)) + str.length,
          meeting.plainText.toString().search(":")
        );
        if (title) {
          return title.toString().toLowerCase().trim().includes(filterValue)
        }
      }
    });
  }
  sortDataRecord(sortValue: string) {
    this.recordObjectList = this.recordObjectList.sort((a, b) => {
      (a[sortValue] > b[sortValue]) ? 1 : -1
    })
  }
  counterRecord(items: number) {
    return new Array(Math.round(items / this.recorditemsPerPage));
  }
  getCountRecord() {
    return parseInt(this.recorditemsPerPage.toString()) + parseInt(this.recordpageNumber.toString());
  }
  // helper function
  changePageRecord(number: number) {
    this.recordpageNumber = number * this.recorditemsPerPage;
  }
  resetForm() {
    this.mainForm.reset();
    this.participants = [];
    this.loadData();
  }
  addParticipant(email, name, type) {
    if (!email.value || !email.value.match("[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.-]{2,10}")) {
      swal("Invalid Email");
      return;
    }
    if (this.participants.some(user => user.email === email.value)) {
      swal("Email Exists");
      return;
    }
    let participant = {
      "name": name.value,
      "email": email.value,
      "role": type.checked ? "CoHost" : "Participant"
    }
    this.participants.push(participant);
    email.value = "";
    name.value = "";
  }
  removeParticipant(email) {
    this.participants = this.participants.filter(item => item.email != email)
  }
  inviteParticipants(id, url, button) {
    this.http.post(`${this.cxDomain}/participants/${id}`, JSON.stringify(this.participants), { headers: this.headers })
      .subscribe(Response => {
        if (!Response || Response['status'] != "success") {
          swal('Unable To Schedule Meeting, Please Try Again');
          return false;
        }
        swal('Meeting Created Succesfully');
        this.resetForm();
        button.close();
        return true;
      },
        error => {
          swal('Unable To Schedule Meeting, Please Try Again');
          return false;
        }
      )
  }
  patchMeeting(id, url, description, duration, dateTime, button) {
    let body = {
      "hostJoinFirst": false,
      "selfModeration": true,
      "datetime": dateTime,
      "duration": duration,
      "description": description
    }
    this.http.patch(`${this.cxDomain}/scheduled/${id}`, JSON.stringify(body), { headers: this.headers })
      .subscribe(Response => {
        if (!Response || Response['status'] != "success") {
          swal('Unable To Schedule Meeting, Please Try Again');
          return false;
        }
        if (this.participants.length > 0)
          this.inviteParticipants(id, url, button);
        else {
          swal('Meeting Created Succesfully');
          this.resetForm();
          button.close();
        }
        return true;
      },
        error => {
          swal('Unable To Schedule Meeting, Please Try Again');
          return false;
        }
      )
  }
  scheduleMeeting(button) {
    if (this.mainForm.invalid) {
      this.mainForm.form.markAllAsTouched();
      swal("Please Enter Values In The Highlighted Fields");
      return false;
    }
    let value = this.mainForm.form.value;
    value.dateTime = new Date(value.dateTime).toISOString();
    if (!this.user['cxId'] || !this.user['cxMail']) {
      swal('No Id assigned');
      return false;
    }
    swal("Creating Meeting…Please Wait", {
      buttons: [false, false],
      closeOnClickOutside: false,
    });
    this.http.post(`${this.cxDomain}/adhoc?extension=${this.user['cxId']}&subject=${value.subject}`, null, { headers: this.headers })
      .subscribe(Response => {
        if (!Response || !Response['result']['meetingid']) {
          swal('Unable To Schedule Meeting, Please Try Again');
          return false;
        }
        this.patchMeeting(Response['result']['meetingid'], Response['result']['url'], value.description, value.duration, value.dateTime, button);
        return true;
      },
        error => {
          swal('Unable To Schedule Meeting, Please Try Again');
          return false;
        }
      )
    return true;
  }
  getMeetingEndTime(start, duration) {
    return new Date((parseFloat(new Date(start).getTime().toString()) + (parseFloat(duration.toString()) * 60000)));
  }
  getMeetingStatus(start, duration) {
    if (new Date(start).getTime() < Date.now()) {
      if ((parseFloat(new Date(start).getTime().toString()) + (parseFloat(duration.toString()) * 60000)) < Date.now()) return 2;
      else return 1;
    } else
      return 0;
  }
  openMeeting(id) {
    this.http.get(`${this.cxDomain}/scheduled/${id}`, { headers: this.headers })
      .subscribe(Response => {
        if (!Response || !Response['result']['openlink']) {
          swal('Unable To Schedule Meeting, Please Try Again');
          return false;
        }
        // if (parseFloat(new Date(Response['result']['datetime']).getTime().toString()) + (parseFloat(Response['result']['duration'].toString()) * 60000) < Date.now()) {
        //   swal('Meeting past scheduled time');
        //   return false;
        // }
        window.open(Response['result']['openlink'], "_blank");
        return true;
      },
        error => {
          swal('Unable To Schedule Meeting, Please Try Again');
          return false;
        }
      )
  }
  deleteMeeting(id) {
    swal({
      title: "Are you sure?",
      text: "Do you want to Delete this Meeting!",
      icon: "warning",
      buttons: ['NO', 'YES'],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.http.delete(`${this.cxDomain}/scheduled/${id}`, { headers: this.headers })
            .subscribe(Response => {
              if (!Response || Response['status'] != "success") {
                swal('Unable to Delete Meeting,Please try again later');
                return false;
              }
              swal('Meeting Deleted Succesfully');
              this.loadData();
              return true;
            },
              error => {
                swal('Unable to Delete Meeting,Please try again later');
                return false;
              }
            )
        }
      })
  }

  urlify(text) {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;;
    return text.replace(urlRegex, function (url) {
      return '<br><a target="_blank" href="' + url + '">' + url + '</a><br>';
    })
  }

}
