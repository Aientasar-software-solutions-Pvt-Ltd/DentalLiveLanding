import { UtilityServiceV2 } from './../../../../utility-service-v2.service';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import swal from 'sweetalert';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { AccdetailsService } from '../../accdetails.service';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { v4 as uuidv4 } from "uuid";
import { CvfastNewComponent } from 'src/app/cvfastFiles/cvfast-new/cvfast-new.component';
import { meetingInviteHtml } from "../../../../../assets/meetingInvite.js";

@Component({
    selector: 'app-videojs-record',
    templateUrl: './videojs-record.component.html',
    styleUrls: ['./videojs-record.component.css'],
    providers: [DatePipe]
})
export class VideojsRecordComponent implements OnInit {

    @Input() message: any;
    @Output() closeComp = new EventEmitter<boolean>();
    @ViewChild(CvfastNewComponent) cvfast!: CvfastNewComponent;

    currentState = this;
    sending = false;
    patientList: any = [];
    caseList: any = [];
    contactList: any = [];
    contactFilterdList = [];
    addressList = [];
    //supply headers
    private profile: string;
    private inReplyTo: string;
    private references: string;
    private subUserId: number;
    private fromAddress: string;
    private form: any;
    isPatientDisable = false;
    isCaseDisabled = false;
    @ViewChild('case') case!: ElementRef;
    @ViewChild('patient') patient!: ElementRef;
    @ViewChild('location') location!: ElementRef;
    patientId = "";
    caseId = "";
    startDate = 0;
    endDate = 0;
    mail: any;
    validNaming = /^([a-zA-Z0-9 _]+)$/;
    private validMail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    htmlText = ""; plainText = ""; trailText = ""; trailHtml = ""
    istouched = false;
    isSchedule = false;
    hasMails = false;
    patientObject = null;
    caseObject = null;

    constructor(private router: Router, private route: ActivatedRoute, public sanitizer: DomSanitizer, private dataService: ApiDataService, private usr: AccdetailsService, private utility: UtilityService, public newUtility: UtilityServiceV2) {
    }

    async loadDep() {
        await this.newUtility.loadPreFetchData("practices");
        await this.newUtility.loadPreFetchData("users");
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            if (params.get('type') && params.get('type') != "" && params.get('type') == "1") this.isSchedule = true
            if (params.get('patientId') && params.get('patientId') != "") {
                this.isPatientDisable = true;
                this.loadDep();
                if (params.get('caseId') && params.get('caseId') != "") {
                    this.isCaseDisabled = true;
                    if (params.get('emails') && params.get('emails') != "") {
                        this.hasMails = true;
                        let mails = params.get("emails").toString().split(",");
                        for (const mail of mails) {
                            if (!this.addressList.includes(mail)) this.addressList.push(mail);
                        }
                    }
                }
            }
        });
        this.mail = {
            toAddresses: "",
            ccAddresses: "",
            bccAddresses: "",
            subject: "",
            trail: ""
        };
        this.profile = this.usr.getUserDetails().imageSrc ? this.utility.apiData.mails.bucketUrl + this.usr.getUserDetails().imageSrc : this.utility.apiData.mails.bucketUrl + "account.png";
        this.subUserId = 0;
        this.fromAddress = this.usr.getUserDetails()['emailAddress'];
        this.fetchCasePatientContactData();
        if (this.message) {
            this.inReplyTo = this.message.messageId;
            this.references = this.message.references + this.message.messageId;
            this.references = this.references.replace(/,/g, "");
            let MailToList = this.message.MailTo.split(',');
            if (this.message.mailType == 'OUT') {
                for (let mail of MailToList) {
                    if (!this.addressList.includes(mail)) this.addressList.push(mail);
                }
            } else if (!this.addressList.includes(this.message.MailFrom)) this.addressList.push(this.message.MailFrom);
            this.mail.ccAddresses = this.message.MailCc;
            this.mail.bccAddresses = this.message.MailBcc;
            this.mail.trail = this.message.htmlText;
            this.mail.subject = this.message.subject;
        } else {
            if (this.usr.getUserDetails().forwards && this.usr.getUserDetails().forwards.length > 0)
                this.addressList = [...this.usr.getUserDetails().forwards];
        }
    }

    poplEmoji(e) {
        document.getElementById('message').innerHTML = document.getElementById('message').innerHTML + e;
    }

    assign3X(input, status) {
        input.value = (status && this.usr.getUserDetails()['cxId']) ? `https://dentallive.my3cx.ca:5001/meet/${this.usr.getUserDetails()['cxId']}` : "";
    }

    getCaseObject(caseId) {
        return (caseId) ? this.caseList.find(element => element.caseId == caseId) : null;
    }

    getPatientObject(patientId) {
        return (patientId) ? this.patientList.find(element => element.patientId == patientId) : null;
    }

    updateCaseFilter(patientId) {
        this.dataService.getallData(patientId ? `https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/cases?patientId=${patientId}` : `https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/cases`, true)
            .subscribe(Response => {
                if (Response) Response = JSON.parse(Response.toString());
                this.caseList = Response;
                this.caseList = this.caseList.filter(cs => !cs.caseRunningStatus || cs.caseRunningStatus == 1);
                this.case.nativeElement.value = "";
            }, () => {
                return null;
            })
        this.case.nativeElement.value = "";
    }

    addPatient(patientId) {
        this.addressList = []
        this.patientObject = null;
        if (!patientId) { this.case.nativeElement.value = ""; return };
        let patient = this.patientObject = this.patientList.find(element => element.patientId == patientId)
        if (!this.addressList.includes(patient.email)) this.addressList.push(patient.email);
        this.updateCaseFilter(patientId);
    }

    addtoList(value, to, auto) {
        if (!auto.showPanel && value && value != '') {
            if (this.validMail.test(String(value).toLowerCase())) {
                if (!this.addressList.includes(value)) this.addressList.push(value);
                to.value = '';
            } else {
                swal("Invalid E-Mail address");
            }
        }
    }

    addMailOption(value, to) {
        if (!this.addressList.includes(value)) this.addressList.push(value);
        to.value = '';
        to.focus();
    }

    addMail(event, value, to) {
        if ((event.key === "Enter" || event.key === ",")) {
            if (!this.validMail.test(String(value).toLowerCase())) {
                swal("Invalid E-Mail address");
            } else {
                if (!this.addressList.includes(value)) this.addressList.push(value);
                to.value = '';
                return false;
            }
        }
        return null;
    }

    filterContact(val) {
        if (val == "")
            return;
        let newList = this.contactList.filter(function (contact) {
            return (contact.firstName.includes(val) || contact.lastName.includes(val) || contact.email.includes(val))
        });
        this.contactFilterdList = newList;
    }

    fetchCasePatientContactData() {
        let email = this.usr.getUserDetails().emailAddress;

        this.dataService.getallData(`https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/patients`, true)
            .subscribe(Response => {
                if (Response) Response = JSON.parse(Response.toString());
                this.patientList = Response;
                this.route.paramMap.subscribe(params => {
                    if (params.get('patientId') && params.get('patientId') != "") {
                        this.isPatientDisable = true;
                        let pid = this.patientList.find(el => el.patientId === params.get('patientId'))
                        if (!pid) {
                            swal("Invalid patient");
                            this.router.navigate(['/mail/inbox']);
                        }
                        this.patientId = pid.patientId;
                        if (!(params.get('caseId') && params.get('caseId') != ""))
                            this.addPatient(this.patientId);
                        if (!this.hasMails)
                            if (!this.addressList.includes(pid.email)) this.addressList.push(pid.email);
                    }
                });
            }, () => {
                swal("Invalid patient");
                this.router.navigate(['/mail/inbox']);
                return null;
            })

        this.dataService.getallData(`https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/cases`, true)
            .subscribe(Response => {
                if (Response) Response = JSON.parse(Response.toString());
                this.caseList = Response;
                this.route.paramMap.subscribe(params => {
                    if (params.get('caseId') && params.get('caseId') != "") {
                        this.isCaseDisabled = true;

                        let cid = this.caseList.find(el => el.caseId === params.get('caseId'))
                        if (!cid) {
                            swal("Invalid case");
                            this.router.navigate(['/mail/inbox']);
                        }
                        this.caseId = cid.caseId;
                    }
                });
            }, () => {
                swal("Invalid case");
                this.router.navigate(['/mail/inbox']);
                return null;
            })

        this.dataService.getallData(this.utility.apiData.contacts.ApiUrl + `?did=${email}`, true)
            .subscribe(Response => {
                if (Response) Response = JSON.parse(Response.toString());
                if (Response) {
                    this.contactList = Response;
                    this.contactFilterdList = this.contactList;
                }
            }, () => {
                return null;
            })
    }

    formatScheduleHtml() {
        document.getElementById('message').innerHTML
    }

    onSubmit(form: NgForm) {
        this.form = form;
        if (this.patientId) form.value.patientId = this.patientId;
        if (this.caseId) form.value.caseId = this.caseId;
        form.value.location = this.location.nativeElement.value ? this.location.nativeElement.value : "No URL Assigned"

        if (form.invalid) {
            form.form.markAllAsTouched();
            this.istouched = true;
            swal("Required Feilds are Missing")
            return;
        }
        if (this.addressList.length == 0) {
            if (form.value.toAddresses && this.validMail.test(String(form.value.toAddresses).toLowerCase()) && !this.addressList.includes(form.value.toAddresses))
                this.addressList.push(form.value.toAddresses);
            else
                swal("Required Feilds are Missing")
        }

        if (this.isSchedule && (!this.usr.getUserDetails()['cxId'] || !this.usr.getUserDetails()['cxMail'])) {
            swal('No Id assigned');
            return;
        }
        this.form = form;

        this.htmlText = document.getElementById('message').innerHTML + '<br>';
        this.plainText = document.getElementById('message').textContent + '\n\n';

        if (document.getElementById('trail')) {
            this.trailHtml = document.getElementById('trail').innerHTML;
            this.trailText = document.getElementById('trail').textContent;
        }

        let pid = uuidv4();
        let backgroundObject = {
            'module': 'mail',
            'title': "Sending Email",
            'id': pid,
            'currentState': this.currentState
        }

        this.newUtility.processingBackgroundData.push(backgroundObject)
        this.saveFiles(this.currentState, pid)

        swal("Email Sent Successfully");
        this.router.navigate(['/mail/inbox']);
    }

    //send request for a presigned URL-->put the content with the given URL-->save the name in JSON for main storage
    async saveFiles(currenState, id) {
        let formValue = currenState.form.value;
        try {
            currenState.cvfast.module = "mail";
            let filesData = await currenState.cvfast.processFiles();
            filesData['text'] = "";
            currenState.attachmentNames = filesData['links'];
            currenState.savetoDB(currenState, id, formValue);
        } catch (error) {
            console.log(error)
            currenState.newUtility.processingBackgroundData = currenState.newUtility.processingBackgroundData.map((item) => {
                if (item.id != id) return item;
                return {
                    ...item, isFailed: true, isProcessed: false, error: error
                }
            })
        }
    }

    msToHoursMin(milliseconds) {
        const totalMinutes = Math.floor(milliseconds / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours === 0) {
            return `${minutes} minutes`;
        } else {
            return `${hours} hours and ${minutes} minutes`;
        }
    }


    savetoDB(currenState, id, formValue) {
        //create html div and text using links
        let user = currenState.usr.getUserDetails();
        let attachmentNames = "";
        let text = currenState.htmlText;

        currenState.attachmentNames.forEach(element => {
            attachmentNames = attachmentNames + '<a style="margin-top:10px;display: inline-block;width: 200px;margin-right: 20px;" href="' + currenState.utility.apiData.mails.fileURL + element + '" target="_blank"><img src="' + currenState.profile + '" alt="' + element + '" width="200"><strong style="display:block;width:100%;text-align:center;margin-top:15px;">' + element + '</strong></a>'
            currenState.htmlText = currenState.htmlText + '<a style="margin-top:10px;display: inline-block;width: 200px;margin-right: 20px;" href="' + currenState.utility.apiData.mails.fileURL + element + '" target="_blank"><img src="' + currenState.profile + '" alt="' + element + '" width="200"><strong style="display:block;width:100%;text-align:center;margin-top:15px;">' + element + '</strong></a>'
            currenState.plainText = currenState.plainText + '\n' + element + '\n\n' + currenState.utility.apiData.mails.fileURL + element + '\n';
        });

        if (currenState.trailHtml || currenState.trailText) {
            currenState.htmlText = currenState.htmlText + currenState.trailHtml;
            currenState.plainText = currenState.plainText + "\n\n" + currenState.trailText;
        }

        //@ts-ignore
        let duration = ((new Date(formValue.endDate) - new Date(formValue.startDate)) / (1000 * 60)) + " Minutes";

        if (currenState.isSchedule && user.cxId && user.cxMail) {
            let link = formValue.location ? formValue.location : `https://dentallive.my3cx.ca:5001/meet/${user.cxId}`
            console.log(link)
            //popl these values as needed
            let meetingInvite = {
                'recieverName': "User",
                'joiningUrl': link,
                'senderName': user.accountfirstName + " " + user.accountlastName,
                'date': new Date(formValue.startDate).toLocaleDateString('en-US'),
                'startTime': new Date(formValue.startDate).toLocaleTimeString('en-US'),
                'duration': duration,
                'details': text,
                'attachments': attachmentNames,
            }
            currenState.htmlText = meetingInviteHtml(meetingInvite);
            currenState.plainText = currenState.plainText + `\n\nJoining info: ${link} - from Chrome or Firefox`
        }

        let json: JSON = formValue;
        json['isSchedule'] = currenState.isSchedule;
        json['startTime'] = currenState?.startDate ? new Date(currenState.startDate).toLocaleTimeString('en-US') : 0;
        json['duration'] = duration;
        json['endDate'] = currenState?.endDate ? new Date(currenState.endDate).toLocaleTimeString('en-US') : 0;
        json['fromAddress'] = currenState.fromAddress;
        json['inReplyTo'] = currenState.inReplyTo;
        json['references'] = currenState.references;
        json['subUserId'] = currenState.subUserId;
        json['htmlText'] = currenState.htmlText;
        json['plainText'] = currenState.plainText;
        json['loggedUser'] = user.emailAddress;
        json['toAddresses'] = currenState.addressList.join(',');
        json['sender'] = user.accountfirstName + ' ' + user.accountlastName;
        json['attachmentList'] = currenState.attachmentNames;
        if (this.usr.getUserDetails().Subuser)
            json['subUserId'] = user.Subuser.subUserID;
        if (this.message) {
            json['patientId'] = currenState.message.patientId;
            json['caseId'] = currenState.message.caseId;
        }

        currenState.dataService.postData(this.utility.apiData.mails.ApiUrl, JSON.stringify(json))
            .subscribe(() => {
                currenState.newUtility.processingBackgroundData = currenState.newUtility.processingBackgroundData.map((item) => {
                    if (item.id != id) return item;
                    return {
                        ...item, isProcessed: true
                    }
                })

                // swal("Email Sent Successfully");
                // currenState.sending = false;
                // currenState.router.navigate(['/mail/inbox']);
                // if (this.usr.getUserDetails().Subuser) {
                //   swal("Email sent successfully");
                //  currenState.sending = false;
                //  currenState.router.navigate(['/mail/inbox']);
                //   // let jsonSub = {};
                //   // jsonSub['emailAddress'] =currenState.usr.getUserDetails().emailAddress;
                //   // jsonSub['submailAddress'] =currenState.usr.getUserDetails().Subuser.email;
                //   // jsonSub['type'] = 4
                //   //currenState.SubuserService.updatesub(jsonSub)
                //   //   .subscribe(Response => {
                //   //     ;
                //   //     swal("Email sent successfully");
                //   //    currenState.sending = false;
                //   //    currenState.router.navigate(['/mail/inbox']);
                //   //   }, error => {
                //   //     
                //   //     swal("Email sent successfully");
                //   //    currenState.sending = false;
                //   //    currenState.router.navigate(['/mail/inbox']);
                //   //   });
                // } 
            }, error => {
                console.log(error)
                currenState.newUtility.processingBackgroundData = currenState.newUtility.processingBackgroundData.map((item) => {
                    if (item.id != id) return item;
                    return {
                        ...item, isFailed: true, isProcessed: false, error: error
                    }
                })
            })
    }
}