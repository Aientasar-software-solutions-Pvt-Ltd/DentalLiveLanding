import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import videojs from 'video.js';
import * as Wavesurfer from 'videojs-wavesurfer/dist/videojs.wavesurfer.js';
import * as MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.js';
Wavesurfer.microphone = MicrophonePlugin;
import * as Record from 'videojs-record/dist/videojs.record.js';
import { EmailService } from '../../email.service';
import swal from 'sweetalert';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { AccdetailsService } from '../../accdetails.service';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
@Component({
  selector: 'app-videojs-record',
  templateUrl: './videojs-record.component.html',
  styleUrls: ['./videojs-record.component.css'],
  providers: [DatePipe]
})
export class VideojsRecordComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() message: any;
  @Output() closeComp = new EventEmitter<boolean>();
  private VideoConfig: any;
  VideoPlayer: any;
  private audioConfig: any;
  audioPlayer: any;
  private screenConfig: any;
  screenPlayer: any;
  private popupVideoConfig: any;
  private popupVideoPlayer: any;
  plugin: any;
  latestVideoRecord = null;
  latestAudioRecord = null;
  latestScreenRecord = null;
  recordings = [];
  private attachmentNames = [];
  StepVideo = 1;
  StepAudio = 1;
  StepScreen = 1;
  sending = true;
  invalidForm = false;
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
  mail: any;
  validNaming = /^([a-zA-Z0-9 _]+)$/;
  private validMail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // constructor initializes our declared vars
  constructor(private router: Router, private route: ActivatedRoute, private Service: EmailService, public sanitizer: DomSanitizer, private datePipe: DatePipe, private dataService: ApiDataService, private usr: AccdetailsService, private utility: UtilityService, private cdref: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get('patientId') && params.get('patientId') != "") {
        this.isPatientDisable = true;
        if (params.get('caseId') && params.get('caseId') != "") {
          this.isCaseDisabled = true;
        }
      }
    });
    this.mail = {
      toAddresses: "",
      ccAddresses: "",
      subject: "",
      trail: ""
    };
    this.initPlayers();
    this.profile = this.usr.getUserDetails().imageSrc ? this.utility.apiData.mails.bucketUrl + this.usr.getUserDetails().imageSrc : this.utility.apiData.mails.bucketUrl + "account.png";
    this.subUserId = 0;
    this.fromAddress = this.usr.getUserDetails()['emailAddress'];
    this.fetchData();
    if (this.message) {
      this.inReplyTo = this.message.messageId;
      this.references = this.message.references + this.message.messageId;
      this.references = this.references.replace(/,/g, "");
      let MailToList = this.message.MailTo.split(',');
      if (this.message.mailType == 'OUT') {
        for (let mail of MailToList) {
          this.addressList.push(mail)
        }
      } else this.addressList.push(this.message.MailFrom);
      this.mail.ccAddresses = this.message.MailCc;
      this.mail.trail = this.message.htmlText;
      this.mail.subject = this.message.subject;
    } else {
      if (this.usr.getUserDetails().forwards && this.usr.getUserDetails().forwards.length > 0)
        this.addressList = [...this.usr.getUserDetails().forwards];
    }
  }
  ngAfterViewInit() {
    this.VideoPlayer = videojs(document.getElementById('videoPlayer'), this.VideoConfig);
    this.VideoPlayer.on('finishRecord', () => {
      this.latestVideoRecord = this.VideoPlayer.recordedData;
      this.VideoPlayer.record().stopDevice();
      this.cdref.detectChanges();
    });
    this.VideoPlayer.on('deviceError', (e) => console.log(e));
    this.VideoPlayer.on('error', (e) => console.log(e));
    this.VideoPlayer.on('deviceReady', () => this.StepVideo = 2);
    this.VideoPlayer.on('startRecord', () => this.StepVideo = 3);
    this.VideoPlayer.on('stopRecord', () => {
      if (this.StepVideo != 5)
        this.StepVideo = 5;
    });
    this.audioPlayer = videojs(document.getElementById('audioPlayer'), this.audioConfig);
    this.audioPlayer.on('finishRecord', () => {
      this.latestAudioRecord = this.audioPlayer.recordedData;
      this.audioPlayer.record().stopDevice();
      this.cdref.detectChanges();
    });
    this.audioPlayer.on('deviceReady', () => this.StepAudio = 2);
    this.audioPlayer.on('error', (e) => console.log(e));
    this.audioPlayer.on('startRecord', () => this.StepAudio = 3);
    this.audioPlayer.on('stopRecord', () => {
      if (this.StepAudio != 5)
        this.StepAudio = 5
    });
    this.screenPlayer = videojs(document.getElementById('screenPlayer'), this.screenConfig);
    this.screenPlayer.on('finishRecord', () => {
      this.latestScreenRecord = this.screenPlayer.recordedData;
      this.screenPlayer.record().stopDevice();
      this.cdref.detectChanges();
    });
    this.screenPlayer.on('deviceReady', () => this.StepScreen = 2);
    this.screenPlayer.on('error', (e) => console.log(e));
    this.screenPlayer.on('startRecord', () => this.StepScreen = 3);
    this.screenPlayer.on('stopRecord', () => {
      if (this.StepScreen != 5)
        this.StepScreen = 5
    });
    this.popupVideoPlayer = videojs(document.getElementById('popupVideoPlayer'), this.popupVideoConfig);
    this.popupVideoPlayer.on('deviceReady', () => {
      this.popupVideoPlayer.requestPictureInPicture();
    });
    this.popupVideoPlayer.on('leavePIP', () => {
      this.popupVideoPlayer.record().stopDevice();
      this.pipEnabled = false;
    });
  }
  // use ngOnDestroy to detach event handlers and remove the VideoPlayer
  ngOnDestroy() {
    if (this.VideoPlayer) {
      this.VideoPlayer.dispose();
      this.VideoPlayer = false;
    }
    if (this.audioPlayer) {
      this.audioPlayer.dispose();
      this.audioPlayer = false;
    }
    if (this.screenPlayer) {
      this.screenPlayer.dispose();
      this.screenPlayer = false;
    }
    if (this.popupVideoPlayer) {
      this.popupVideoPlayer.dispose();
      this.popupVideoPlayer = false;
    }
  }
  initPlayers() {
    this.VideoPlayer = false;
    this.audioPlayer = false;
    this.screenPlayer = false;
    this.popupVideoPlayer = false;
    this.plugin = Record;
    this.VideoConfig = {
      controls: true,
      width: 320,
      height: 240,
      plugins: {
        record: {
          audio: true,
          maxLength: 1800,
          video: {
            width: { min: 1024, ideal: 1280, max: 1920 },
            height: { min: 576, ideal: 720, max: 1080 }
          },
          // dimensions of captured video frames
          frameWidth: 1920,
          frameHeight: 1080
        }
      }
    };
    this.audioConfig = {
      controls: true,
      width: 320,
      height: 240,
      plugins: {
        wavesurfer: {
          backend: 'WebAudio',
          waveColor: '#D32F2F',
          progressColor: 'black',
          hideScrollbar: true,
          plugins: [
            // enable microphone plugin
            Wavesurfer.microphone.create({
              bufferSize: 4096,
              numberOfInputChannels: 1,
              numberOfOutputChannels: 1,
              constraints: {
                video: false,
                audio: true
              }
            })
          ]
        },
        record: {
          audio: true,
          video: false,
          maxLength: 1800,
        }
      }
    }
    this.screenConfig = {
      controls: true,
      bigPlayButton: false,
      width: 320,
      height: 240,
      plugins: {
        record: {
          audio: true,
          screen: true,
          maxLength: 1800,
          pip: true
        }
      }
    };
    this.popupVideoConfig = {
      controls: false,
      width: 320,
      height: 240,
      plugins: {
        record: {
          audio: false,
          video: true,
          pip: true,
        }
      }
    };
  }


  updateCaseFilter(patientId) {
    this.dataService.getallData(patientId ? `https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/cases?patientId=${patientId}` : `https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/cases`, true)
      .subscribe(Response => {
        if (Response) Response = JSON.parse(Response.toString());
        this.caseList = Response;
        this.case.nativeElement.value = "";
      }, error => {
        return null;
      })
    this.case.nativeElement.value = "";
  }

  addPatient(patientId) {
    let patient = this.patientList.find(element => element.patientId == patientId)
    if (!this.addressList.includes(patient.email)) {
      this.addressList.push(patient.email);
    }
    this.updateCaseFilter(patientId);
  }
  istouched = false;
  addtoList(value, to, auto) {
    if (!auto.showPanel && value && value != '') {
      if (this.validMail.test(String(value).toLowerCase())) {
        if (!this.addressList.includes(value)) {
          this.addressList.push(value);
        }
        to.value = '';
      } else {
        swal("Invalid E-Mail address");
      }
    }
  }


  addMailOption(value, to) {
    console.log(value, to);
    if (!this.addressList.includes(value)) {
      this.addressList.push(value);
    }
    to.value = '';
    to.focus();
  }
  addMail(event, value, to) {
    if ((event.key === "Enter" || event.key === ",")) {
      if (!this.validMail.test(String(value).toLowerCase())) {
        swal("Invalid E-Mail address");
      } else {
        if (!this.addressList.includes(value)) {
          this.addressList.push(value);
        }
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
  fetchData() {
    let email = this.usr.getUserDetails().emailAddress;

    this.dataService.getallData(`https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/patients`, true)
      .subscribe(Response => {
        if (Response) Response = JSON.parse(Response.toString());
        this.patientList = Response;
        this.route.paramMap.subscribe(params => {
          if (params.get('patientId') && params.get('patientId') != "") {
            this.isPatientDisable = true;
            if (!this.patientList.some(el => el.patientId === params.get('patientId'))) {
              swal("Invalid patient");
              this.router.navigate(['/mail/inbox']);
            }
          }
        });
      }, error => {
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
            if (!this.caseList.some(el => el.caseId === params.get('caseId'))) {
              swal("Invalid case");
              this.router.navigate(['/mail/inbox']);
            }
          }
        });
      }, error => {
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
      }, error => {
        return null;
      })
  }


  getRecordingUniqueName(name) {
    let i = 0;
    do {
      if (i > 0) name = name.split('.')[0] + '_' + i + '.' + name.split('.')[1];
      i++;
    } while (this.recordings.some(user => user.name == name));
    return name;
  }
  addVideo(name) {
    if (name && !this.validNaming.test(name)) {
      swal("Update File Name,only numbers,alphabets and underscore is allowed");
      return;
    }
    if (!name)
      name = this.usr.getUserDetails().accountfirstName + "_" + this.usr.getUserDetails().accountlastName + "_" + new Date().getTime();
    let orgName = name.replace(/\s+/g, '') + ".mp4";
    if (this.latestVideoRecord) {
      this.recordings.push({ 'name': this.getRecordingUniqueName(orgName), 'data': this.latestVideoRecord });
      this.latestVideoRecord = null;
      this.VideoPlayer.record().reset();
    }
    this.StepVideo = 1
  }
  addAudio(name) {
    if (name && !this.validNaming.test(name)) {
      swal("Update File Name,only numbers,alphabets and underscore is allowed");
      return false;
    }
    if (!name)
      name = this.usr.getUserDetails().accountfirstName + "_" + this.usr.getUserDetails().accountlastName + "_" + new Date().getTime();
    let orgName = name.replace(/\s+/g, '') + ".mp3";
    if (this.latestAudioRecord) {
      this.recordings.push({ 'name': this.getRecordingUniqueName(orgName), 'data': this.latestAudioRecord });
      console.log(this.recordings);
      this.latestAudioRecord = null;
      this.audioPlayer.record().reset();
    }
    this.StepAudio = 1
    return null;
  }
  addScreen(name) {
    if (name && !this.validNaming.test(name)) {
      swal("Update File Name,only numbers,alphabets and underscore is allowed");
      return;
    }
    if (!name)
      name = this.usr.getUserDetails().accountfirstName + "_" + this.usr.getUserDetails().accountlastName + "_" + new Date().getTime();
    let orgName = name.replace(/\s+/g, '') + ".mp4";
    if (this.latestScreenRecord) {
      this.recordings.push({ 'name': this.getRecordingUniqueName(orgName), 'data': this.latestScreenRecord });
      this.latestScreenRecord = null;
      this.screenPlayer.record().reset();
    }
    this.StepScreen = 1
  }
  pipEnabled = false;
  togglePictureInPicture() {
    if (!('pictureInPictureEnabled' in document)) {
      swal("Your Browser dosent support this feature,please use Goole Chrome or Safari for this Feature");
    } else {
      if (!this.pipEnabled) {
        this.popupVideoPlayer.record().getDevice();
      }
      this.pipEnabled = !this.pipEnabled;
    }
  }
  //send request for a presigned URL-->put the content with the given URL-->save the name in JSON for main storage
  saveFiles() {
    let requests = this.recordings.map(elem => {
      return this.utility.uploadBinaryData(elem.name, elem.data, "dentalmail-attachments")
    });
    Promise.all(requests)
      .then((responses) => {
        this.attachmentNames = responses;
        this.savetoDB();
      })
      .catch((error) => {
        swal("Error sending email,please try again");
        this.sending = false;
      });
  }
  savetoDB() {
    //create html div and text using links
    let htmlText = document.getElementById('message').innerHTML + '<br>';
    let plainText = document.getElementById('message').textContent + '\n\n';
    this.attachmentNames.forEach(element => {
      htmlText = htmlText + '<a style="margin-top:10px;display: inline-block;width: 200px;margin-right: 20px;" href="' + this.utility.apiData.mails.fileURL + element.name + '" target="_blank"><img src="' + this.profile + '" alt="' + element.name + '" width="200"><strong style="display:block;width:100%;text-align:center;margin-top:15px;">' + element.name + '</strong></a>'
      plainText = plainText + '\n' + element.name + '\n\n' + this.utility.apiData.mails.fileURL + element.name + '\n';
    });
    if (document.getElementById('trail')) {
      htmlText = htmlText + document.getElementById('trail').innerHTML;
      plainText = plainText + "\n\n" + document.getElementById('trail').textContent;
    }
    let json: JSON = this.form.value;
    json['fromAddress'] = this.fromAddress;
    json['inReplyTo'] = this.inReplyTo;
    json['references'] = this.references;
    json['subUserId'] = this.subUserId;
    json['htmlText'] = htmlText;
    json['plainText'] = plainText;
    json['loggedUser'] = this.usr.getUserDetails()['emailAddress'];
    json['toAddresses'] = this.addressList.join(',');
    json['sender'] = this.usr.getUserDetails().accountfirstName + ' ' + this.usr.getUserDetails().accountlastName;
    json['attachmentList'] = this.attachmentNames;
    if (this.usr.getUserDetails().Subuser)
      json['subUserId'] = this.usr.getUserDetails().Subuser.subUserID;
    if (this.message) {
      json['patientId'] = this.message.patientId;
      json['caseId'] = this.message.caseId;
    }

    this.dataService.postData(this.utility.apiData.mails.ApiUrl, JSON.stringify(json))
      .subscribe(Response => {
        swal("Email sent successfully");
        this.sending = false;
        this.router.navigate(['/mail/inbox']);
        // if (this.usr.getUserDetails().Subuser) {
        //   swal("Email sent successfully");
        //   this.sending = false;
        //   this.router.navigate(['/mail/inbox']);
        //   // let jsonSub = {};
        //   // jsonSub['emailAddress'] = this.usr.getUserDetails().emailAddress;
        //   // jsonSub['submailAddress'] = this.usr.getUserDetails().Subuser.email;
        //   // jsonSub['type'] = 4
        //   // this.SubuserService.updatesub(jsonSub)
        //   //   .subscribe(Response => {
        //   //     ;
        //   //     swal("Email sent successfully");
        //   //     this.sending = false;
        //   //     this.router.navigate(['/mail/inbox']);
        //   //   }, error => {
        //   //     
        //   //     swal("Email sent successfully");
        //   //     this.sending = false;
        //   //     this.router.navigate(['/mail/inbox']);
        //   //   });
        // } 
      }, error => {
        if (error.status == 402)
          swal("Storage Full,Please add additional storage to send this email");
        else
          swal("Error sending email,please try again");
        this.sending = false;
      })
  }
  loadFiles(event) {
    if (event.target.files.length > 0) {
      let allowedtypes = ['image', 'video', 'audio', 'pdf', 'msword', 'ms-excel'];
      Array.from(event.target.files).forEach(element => {
        if (!allowedtypes.some(type => element['type'].includes(type))) {
          swal("File Extenion Not Allowed");
          return;
        } else {
          this.recordings.push({ 'name': this.getRecordingUniqueName(element["name"]), 'data': element });
        }
      });
    }
  }
  removeFiles(index, attachment) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this file!",
      icon: "warning",
      buttons: ['Cancel', 'Ok'],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          attachment.classList.add('animate__lightSpeedOutRight');
          setTimeout(() => {
            this.recordings.splice(index, 1);
          }, 500);
        }
      });
  }
  onSubmit(form: NgForm) {
    if (form.invalid || this.addressList.length == 0) {
      form.form.markAllAsTouched();
      this.istouched = true;
      this.invalidForm = true;
      return;
    }
    this.sending = true;
    this.form = form;
    this.saveFiles();
  }
}