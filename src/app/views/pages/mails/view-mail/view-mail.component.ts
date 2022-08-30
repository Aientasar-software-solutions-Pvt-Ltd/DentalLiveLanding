import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert';
import { AccdetailsService } from '../../accdetails.service';
import { PermissionGuardService } from '../../permission-guard.service';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
@Component({
  selector: 'app-view-mail',
  templateUrl: './view-mail.component.html',
  styleUrls: ['./view-mail.component.css']
})
export class ViewMailComponent implements OnInit {
  messageList: any;
  fromHtml = "";
  backLink = '/mail/inbox';
  private user = this.usr.getUserDetails()['emailAddress'];
  subuser = this.usr.getUserDetails();
  showReply = false;
  sending = true;
  patient: any;
  constructor(private router: Router, private route: ActivatedRoute, public permAuth: PermissionGuardService, public sanitizer: DomSanitizer, private dataService: ApiDataService, private usr: AccdetailsService, private utility: UtilityService) { }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.get('type') == "sent") {
        this.backLink = '/mail/sent';
      }
      this.messageList = [];
      if (params.get('id')) {
        let id = decodeURIComponent(params.get('id'));
        this.dataService.getallData(this.utility.apiData.mails.ApiUrl + `?did=${this.user}&mailid=${params.get('id')}`, true)
          .subscribe(Response => {
            if (Response) Response = JSON.parse(Response.toString());
            this.sending = false;
            if (Response) {
              this.messageList = Response;

              this.messageList.sort(function (a, b) {
                if (a.mailDateTime > b.mailDateTime) return -1
                return a.mailDateTime < b.mailDateTime ? 1 : 0
              });
              if (this.messageList[0].patientId) {
                this.dataService.getallData(this.utility.apiData.patients.ApiUrl + `?did=${this.user}` + `&id=${this.messageList[0].patientId}`, true).subscribe(
                  (Response) => {
                    if (Response) Response = JSON.parse(Response.toString());
                    this.patient = Response;
                  }, error => {
                    return null;
                  });
              }
              // for (let message of this.messageList) {
              //   if (message.s3link) {
              //     this.Service.getPreSignedUrl(message.s3link, 'get', 'dentalmail-incoming')
              //       .subscribe(Response => {
              //         if (Response["url"]) {
              //           fetch(Response["url"])
              //             .then(response => response.text())
              //             .then(data => {
              //               // let split = data
              //               //   .split(new RegExp('(\w*): ([^\t\r\n]*)[\t\r\n]*')) // removes trailing line feed
              //               //   .filter(x => x) // remove empty matches
              //               // let res = {}
              //               // for (let i = 0; i < split.length; i += 2)
              //               //   res[split[i]] = split[i + 1] // even indexes are key, odd ones are values
              //               // console.log(res);
              //             });
              //         }
              //       });
              //   }
              // }
            }
          }, error => {
            this.sending = false;
            return null;
          });
      } else {
        swal("unable to load message,please try again later");
        this.sending = false;
        this.router.navigate(['/mail/inbox']);
      }
    });
  }
  printScreen() {
    window.print();
  }
}
