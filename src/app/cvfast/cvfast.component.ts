//@ts-nocheck
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'video.js/dist/video-js.min.css';
import videojs from 'video.js';
import 'videojs-wavesurfer/dist/css/videojs.wavesurfer.css';
import * as Wavesurfer from 'videojs-wavesurfer/dist/videojs.wavesurfer.js';
import * as MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.js';
Wavesurfer.microphone = MicrophonePlugin;
import { v4 as uuidv4 } from "uuid";
import Swal from 'sweetalert';
import Webcam from 'webcam-easy';
import * as Record from 'videojs-record/dist/videojs.record.js';
import { ApiDataService } from '../views/pages/users/api-data.service';
import { Router } from '@angular/router';
import { UtilityService } from '../views/pages/users/utility.service';
import { UtilityServicedev } from '../utilitydev.service';

@Component({
  selector: 'app-cvfast',
  templateUrl: './cvfast.component.html',
  styleUrls: ['./cvfast.component.css']
})
export class Cvfast implements OnInit, OnDestroy, AfterViewInit {
  sending: boolean;
  // @Input() module: any;
  private VideoConfig: any;
  VideoPlayer: any;
  private audioConfig: any;
  audioPlayer: any;
  private screenConfig: any;
  screenPlayer: any;
  private popupVideoConfig: any;
  private popupVideoPlayer: any;
  latestVideoRecord = null;
  latestAudioRecord = null;
  latestScreenRecord = null;
  attachmentFiles = [];
  StepVideo = 1;
  StepAudio = 1;
  StepScreen = 1;
  StepCamera = 1;
  showVideo = false;
  showScreen = false;
  showCamera = false;
  showAudio = false;
  showAttachments = false;
  webcam = null;
  plugin: any;
  pic = null;
  baseText = "";
  showEmoji = false;
  cvfast = {
    text: "",
    links: []
  };
  processingcheck = false;//Converthink
  processing = false;
  module = 'patient';

  //attachmentList contains array of all the binary data related to CVFAST --> upon process this binary data is stored in S3 bucket fo AWS with a pre signed URL and the link is returned-->these links are added to cvfast object with there respective name and urls-->this cvfast object is stored in contextual data.

  constructor(private dataService: ApiDataService, private router: Router, private cdref: ChangeDetectorRef, private utility: UtilityService, private UtilityDev: UtilityServicedev) {
  }
  ngOnInit(): void {
    this.initPlayers();
  }
  ngAfterViewInit() {
    this.initWebcam();
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
  initWebcam() {
    const webcamElement = document.getElementById('webcam');
    const canvasElement = document.getElementById('canvas');
    const snapSoundElement = document.getElementById('snapSound');
    this.webcam = new Webcam(webcamElement, 'user', canvasElement, snapSoundElement);
  }

  resetAll(type) {
    this.latestVideoRecord = null; this.VideoPlayer.record().reset(); this.StepVideo = 1;
    this.latestAudioRecord = null; this.audioPlayer.record().reset(); this.StepAudio = 1;
    this.latestScreenRecord = null; this.screenPlayer.record().reset(); this.StepScreen = 1;
    if (this.webcam) this.webcam.stop();

    let temp = this[type];
    this.showAttachments = this.showVideo = this.showEmoji = this.showScreen = this.showAudio = this.showCamera = false;
    this[type] = !temp;
    if (this.webcam && !temp) {
      this.StepCamera == 1;
      this.webcam.start();
    }
  }

  getUniqueName(name) {
    let i = 0;
    do {
      if (i > 0) name = name.split('.')[0] + '_' + i + '.' + name.split('.')[1];
      i++;
    } while (this.attachmentFiles.some(user => user.name == name));
    return name;
  }

  loadFiles(event) {
    if (event.target.files.length > 0) {
      let allowedtypes = ['image', 'video', 'audio', 'pdf', 'msword', 'ms-excel'];
      Array.from(event.target.files).forEach(element => {
        if (!allowedtypes.some(type => element['type'].includes(type))) {
          Swal("File Extenion Not Allowed");
          return;
        } else {
          this.attachmentFiles.push({ name: this.getUniqueName(element['name']), binaryData: element });
        }
      });
    }
  }
  removeFiles(index, attachment) {
    Swal({
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
            this.attachmentFiles.splice(index, 1);
            // start for edit cvfast by conmverthink
            this.cvfast.links.splice(index, 1);
            this.cvfast = {
              text: this.baseText,
              links: this.cvfast.links
            }
            // end for edit cvfast by conmverthink
          }, 500);
        }
      });
  }

  showCam() {
    this.StepCamera == 1;
    if (!this.showCamera) {
      this.webcam.start();
    } else {
      this.webcam.stop();
    }
  }

  addVideo() {
    if (this.latestVideoRecord) {
      this.attachmentFiles.push({ name: uuidv4() + ".mp4", binaryData: this.latestVideoRecord })
      this.latestVideoRecord = null;
      this.VideoPlayer.record().reset();
    }
    this.StepVideo = 1
  }
  addAudio() {
    if (this.latestAudioRecord) {
      this.attachmentFiles.push({ name: uuidv4() + ".mp3", binaryData: this.latestAudioRecord })
      this.latestAudioRecord = null;
      this.audioPlayer.record().reset();
    }
    this.StepAudio = 1
    console.log(this.attachmentFiles);
  }
  addScreen() {
    if (this.latestScreenRecord) {
      this.attachmentFiles.push({ name: uuidv4() + ".mp4", binaryData: this.latestScreenRecord })
      this.latestScreenRecord = null;
      this.screenPlayer.record().reset();
    }
    this.StepScreen = 1
  }
  pipEnabled = false;
  togglePictureInPicture() {
    if (!('pictureInPictureEnabled' in document)) {
      Swal("Your Browser dosent support this feature,please use Goole Chrome or Safari for this Feature");
    } else {
      if (!this.pipEnabled) {
        this.popupVideoPlayer.record().getDevice();
      }
      this.pipEnabled = !this.pipEnabled;
    }
  }

  dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: 'image/png'
    });
  }

  takePicture(canvas) {
    this.pic = this.dataURItoBlob(this.webcam.snap());
  }
  addPicture() {
    this.attachmentFiles.push({ name: this.getUniqueName(uuidv4() + ".jpg"), binaryData: this.pic });
  }

  addEmoji(event) {
    this.baseText = this.baseText + event.emoji.native
    console.log(event.emoji.native)
  }

  processFiles(ApiUrl, jsonObj, responceType, message, redirectUrl, datatype, sessionName = '', field = 'notes', reload = '') {
    this.processing = true;
    let requests = this.attachmentFiles.map((object) => {
      if (object["binaryData"]) {
        this.processingcheck = true;
        return this.UtilityDev.uploadBinaryData(object["name"], object["binaryData"], this.module);
      }
    });
    if (this.processingcheck == true) {
      Promise.all(requests)
        .then((values) => {
          this.processing = false;
          this.attachmentFiles = [];
          // start for edit cvfast by conmverthink
          let newArray = Array();
          for (var k = 0; k < values.length; k++) {
            if (this.cvfast.links[k]) {
              newArray.push(this.cvfast.links[k]);
            }
            else {
              newArray.push(values[k]);
            }
          }
          this.cvfast = {
            text: this.baseText,
            links: newArray
          }
          if (field == 'comments') {
            let comment = jsonObj.comment;
            comment.push(this.cvfast);
            jsonObj[field] = comment;
          }
          else {
            jsonObj[field] = this.cvfast;
          }
          this.sending = true;
          //alert(JSON.stringify(jsonObj));
          if (datatype == 'put') {
            this.dataService.putData(ApiUrl, JSON.stringify(jsonObj), responceType)
              .subscribe(Response => {
                //Swal.close();
                this.sending = false;
                let AllDate = JSON.parse(Response.toString());
                if (message) {
                  Swal(message);
                }
                if (sessionName) {
                  sessionStorage.setItem(sessionName, AllDate.resourceId);
                }
                if (redirectUrl) {
                  setTimeout(() => {
                    this.router.navigate([redirectUrl]);
                  }, 1000);
                }
                if (reload) {
                  window.location.reload();
                }
              }, error => {
				this.sending = true;
				if (error.status === 404)
				Swal('No data found');
				else if (error.status === 403)
				Swal('You are unauthorized to access the data');
				else if (error.status === 400)
				Swal('Invalid data provided, please try again');
				else if (error.status === 401)
				Swal('You are unauthorized to access the page');
				else if (error.status === 409)
				Swal('Duplicate data entered');
				else if (error.status === 405)
				Swal({
				text: 'Due to dependency data unable to complete operation'
				}).then(function() {
				window.location.reload();
				});
				else if (error.status === 500)
				Swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
				else
				Swal('Oops something went wrong, please try again');
              });
          }
          else {
            this.dataService.postData(ApiUrl, JSON.stringify(jsonObj), responceType)
              .subscribe(Response => {
                this.sending = false;
                //Swal.close();
                let AllDate = JSON.parse(Response.toString());
                if (message) {
                  Swal(message);
                }
                if (sessionName) {
                  sessionStorage.setItem(sessionName, AllDate.resourceId);
                }
                if (redirectUrl) {
                  setTimeout(() => {
                    this.router.navigate([redirectUrl]);
                  }, 1000);
                }
                if (reload) {
                  window.location.reload();
                }
              }, error => {
				this.sending = true;
				if (error.status === 404)
				Swal('No data found');
				else if (error.status === 403)
				Swal('You are unauthorized to access the data');
				else if (error.status === 400)
				Swal('Invalid data provided, please try again');
				else if (error.status === 401)
				Swal('You are unauthorized to access the page');
				else if (error.status === 409)
				Swal('Duplicate data entered');
				else if (error.status === 405)
				Swal({
				text: 'Due to dependency data unable to complete operation'
				}).then(function() {
				window.location.reload();
				});
				else if (error.status === 500)
				Swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
				else
				Swal('Oops something went wrong, please try again');
              });
          }
          //return this.cvfast;
        })
        .catch((error) => {
          this.processing = false;
          console.log(error);
          return false;
        });
    }
    else {
      this.sending = true;
      // start for edit cvfast by conmverthink
      this.cvfast = {
        text: this.baseText,
        links: this.cvfast.links
      }
      if (field == 'comments') {
        let comment = jsonObj.comment;
        comment.push(this.cvfast);
        jsonObj[field] = comment;
      }
      else {
        jsonObj[field] = this.cvfast;
      }
      //alert(JSON.stringify(jsonObj));
      if (datatype == 'put') {
        this.dataService.putData(ApiUrl, JSON.stringify(jsonObj), responceType)
          .subscribe(Response => {
            //Swal.close();
            this.sending = false;
            let AllDate = JSON.parse(Response.toString());
            if (message) {
              Swal(message);
            }
            if (sessionName) {
              sessionStorage.setItem(sessionName, AllDate.resourceId);
            }
            if (redirectUrl) {
              setTimeout(() => {
                this.router.navigate([redirectUrl]);
              }, 1000);
            }
            if (reload) {
              window.location.reload();
            }
          }, error => {
			this.sending = true;
			if (error.status === 404)
			Swal('No data found');
			else if (error.status === 403)
			Swal('You are unauthorized to access the data');
			else if (error.status === 400)
			Swal('Invalid data provided, please try again');
			else if (error.status === 401)
			Swal('You are unauthorized to access the page');
			else if (error.status === 409)
			Swal('Duplicate data entered');
			else if (error.status === 405)
			Swal({
			text: 'Due to dependency data unable to complete operation'
			}).then(function() {
			window.location.reload();
			});
			else if (error.status === 500)
			Swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
			else
			Swal('Oops something went wrong, please try again');
          });
      }
      else {
        this.dataService.postData(ApiUrl, JSON.stringify(jsonObj), responceType)
          .subscribe(Response => {
            this.sending = false;
            //Swal.close();
            let AllDate = JSON.parse(Response.toString());
            if (message) {
              Swal(message);
            }
            if (sessionName) {
              sessionStorage.setItem(sessionName, AllDate.resourceId);
            }
            if (redirectUrl) {
              setTimeout(() => {
                this.router.navigate([redirectUrl]);
              }, 1000);
            }
            if (reload) {
              window.location.reload();
            }
          }, error => {
			this.sending = true;
			if (error.status === 404)
			Swal('No data found');
			else if (error.status === 403)
			Swal('You are unauthorized to access the data');
			else if (error.status === 400)
			Swal('Invalid data provided, please try again');
			else if (error.status === 401)
			Swal('You are unauthorized to access the page');
			else if (error.status === 409)
			Swal('Duplicate data entered');
			else if (error.status === 405)
			Swal({
			text: 'Due to dependency data unable to complete operation'
			}).then(function() {
			window.location.reload();
			});
			else if (error.status === 500)
			Swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
			else
			Swal('Oops something went wrong, please try again');
          });
      }

      //return this.cvfast;
      // end for edit cvfast by conmverthink
    }
  }
  //get data of cvfast ##converthink 
  returnCvfast() {
    return this.cvfast;
  }
  //show data in edit ##converthink
  setCvfast(obj) {
    this.baseText = obj.text;
    if (obj.links.length > 0) {
      for (var i = 0; i < obj.links.length; i++) {
        this.attachmentFiles.push({ name: obj.links[i], binaryData: '' });
      }
    }
    this.cvfast = {
      text: obj.text,
      links: obj.links
    }
    // return this.cvfast;
  }
  autoGrowTextZone(e) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 10) + "px";
  }
}