import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
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
import { AccdetailsService } from '../../views/pages/accdetails.service';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { resolve } from 'dns';


@Component({
  selector: 'app-cvfast-new',
  templateUrl: './cvfast-new.component.html',
  styleUrls: ['./cvfast-new.component.css'],
  exportAs: 'CvfastNewComponent'
})
export class CvfastNewComponent implements AfterViewInit {

  // @Input() module: any;
  @Input() isMin = false;
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
  showEmoji = false;
  cvfast = {
    text: "",
    links: []
  };
  processing = false;
  module = "";
  validNaming = /^([a-zA-Z0-9 _]+)$/;

  //attachmentList contains array of all the binary data related to CVFAST --> upon process this binary data is stored in S3 bucket fo AWS with a pre signed URL and the link is returned-->these links are added to cvfast object with there respective name and urls-->this cvfast object is stored in contextual data.

  constructor(
    private usr: AccdetailsService,
    private utility: UtilityServiceV2,
    private cdref: ChangeDetectorRef) { }

  setCvfast(cvfast) {
    this.cvfast = cvfast;
  }
  ngAfterViewInit() {
    this.initWebcam();
    this.initPlayers();
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
          video: true,
          maxLength: 1800,
          debug: true
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

  //needed wherever cvfast apperas as pop-up --> if in form then no need to call
  resetForm() {
    this.cvfast = {
      text: "",
      links: []
    };
    this.attachmentFiles = []
    this.latestVideoRecord = null; this.VideoPlayer.record().reset(); this.StepVideo = 1;
    this.latestAudioRecord = null; this.audioPlayer.record().reset(); this.StepAudio = 1;
    this.latestScreenRecord = null; this.screenPlayer.record().reset(); this.StepScreen = 1;
    if (this.webcam) this.webcam.stop();
    this.showAttachments = this.showVideo = this.showEmoji = this.showScreen = this.showAudio = this.showCamera = false;
  }

  resetAll(type) {
    this.latestVideoRecord = null; this.VideoPlayer.record().reset(); this.StepVideo = 1;
    this.latestAudioRecord = null; this.audioPlayer.record().reset(); this.StepAudio = 1;
    this.latestScreenRecord = null; this.screenPlayer.record().reset(); this.StepScreen = 1;
    if (this.webcam) this.webcam.stop();

    let temp = this[type];
    this.showAttachments = this.showVideo = this.showEmoji = this.showScreen = this.showAudio = this.showCamera = false;
    this[type] = !temp;
    if (type == "showCamera" && this.webcam && !temp) {
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
          Swal("File format not allowed");
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
          }, 500);
        }
      });
  }

  removeLink(index, link) {
    Swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this file!",
      icon: "warning",
      buttons: ['Cancel', 'Ok'],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          link.classList.add('animate__lightSpeedOutRight');
          setTimeout(() => {
            this.cvfast.links.splice(index, 1);
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

  addVideo(name) {
    if (name && !this.validNaming.test(name)) {
      sweetAlert("Update File Name,only numbers,alphabets and underscore is allowed");
      return;
    }
    if (!name)
      name = this.usr.getUserDetails().accountfirstName + "_" + this.usr.getUserDetails().accountlastName + "_" + new Date().getTime();
    let orgName = name.replace(/\s+/g, '') + ".mp4";
    if (this.latestVideoRecord) {
      this.attachmentFiles.push({ name: this.getUniqueName(orgName), binaryData: this.latestVideoRecord });
      this.latestVideoRecord = null;
      this.VideoPlayer.record().reset();
    }
    this.StepVideo = 1
    this.resetAll('showVideo')
  }
  addAudio(name) {
    if (name && !this.validNaming.test(name)) {
      sweetAlert("Update File Name,only numbers,alphabets and underscore is allowed");
      return;
    }
    if (!name)
      name = this.usr.getUserDetails().accountfirstName + "_" + this.usr.getUserDetails().accountlastName + "_" + new Date().getTime();
    let orgName = name.replace(/\s+/g, '') + ".mp3";
    if (this.latestAudioRecord) {
      this.attachmentFiles.push({ name: this.getUniqueName(orgName), binaryData: this.latestAudioRecord });
      this.latestAudioRecord = null;
      this.audioPlayer.record().reset();
    }
    this.StepAudio = 1
    this.resetAll('showAudio')
  }
  addScreen(name) {
    if (name && !this.validNaming.test(name)) {
      sweetAlert("Update File Name,only numbers,alphabets and underscore is allowed");
      return;
    }
    if (!name)
      name = this.usr.getUserDetails().accountfirstName + "_" + this.usr.getUserDetails().accountlastName + "_" + new Date().getTime();
    let orgName = name.replace(/\s+/g, '') + ".mp4";
    if (this.latestScreenRecord) {
      this.attachmentFiles.push({ name: this.getUniqueName(orgName), binaryData: this.latestScreenRecord });
      this.latestScreenRecord = null;
      this.screenPlayer.record().reset();
    }
    this.StepScreen = 1
    this.resetAll('showScreen')
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

  takePicture() {
    this.pic = this.dataURItoBlob(this.webcam.snap());
  }
  addPicture() {
    this.attachmentFiles.push({ name: this.getUniqueName(uuidv4() + ".jpg"), binaryData: this.pic });
    this.resetAll('showCamera')
  }

  addEmoji(event) {
    this.cvfast.text = this.cvfast.text + event.emoji.native
  }

  processFiles() {
    if (!this.cvfast.hasOwnProperty('text')) this.cvfast.text = "";
    if (!this.cvfast.hasOwnProperty('links')) this.cvfast.links = [];

    return new Promise((Resolve, Reject) => {
      this.processing = true;
      Promise.all(
        this.attachmentFiles.map(async (object) => {
          return this.utility.uploadBinaryData(object["name"], object["binaryData"], this.module);
        }))
        .then((values) => {
          this.processing = false;
          this.attachmentFiles = [];
          this.cvfast.links.push(...values);
          Resolve(this.cvfast);
          this.resetForm()
        })
        .catch((error) => {
          this.processing = false;
          console.log(error);
          Reject(error);
        });
    });
  }
  autoGrowTextZone(e) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 10) + "px";
  }

  getFileName(fileName) {
    if (fileName.indexOf('__-__') == -1) return fileName
    let name = fileName.split(".");
    return fileName.substring(0, fileName.indexOf('__-__')) + "." + name[name.length - 1]
  }
}