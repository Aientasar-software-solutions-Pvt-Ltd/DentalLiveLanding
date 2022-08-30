import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert';
import { EmailService } from '../../email.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-view-attachment',
  templateUrl: './view-attachment.component.html',
  styleUrls: ['./view-attachment.component.css']
})
export class ViewAttachmentComponent implements OnInit {
  fileUrl: any;
  isMedia = 0;
  VideoPlayer: any;
  audioPlayer: any;
  constructor(private route: ActivatedRoute, private Service: EmailService, private sanitizer: DomSanitizer, private changeDetectorRef: ChangeDetectorRef) { }
  ngOnInit() {
    this.fileUrl = null;
    this.route.paramMap.subscribe(params => {
      if (params.get('key')) {
        this.Service.getPreSignedUrl(params.get('key'), 'get', "image")
          .subscribe(Response => {
            if (Response["url"]) {
              Response["url"] = CryptoJS.AES.decrypt(Response['url'], environment.decryptKey).toString(CryptoJS.enc.Utf8);
              this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(Response["url"]);
              let video = ["mp4", "webm", "ogg"];
              let audio = ["mp3", "wav"];
              let images = ["jpg", "jpeg", "png", "webp", "avif", "gif", "svg"];
              let docs = ["pdf"];
              if (video.includes(Response["url"].split('.').pop().split('?')[0])) {
                this.isMedia = 1;
              } else if (audio.includes(Response["url"].split('.').pop().split('?')[0])) {
                this.isMedia = 2;
              } else if (images.includes(Response["url"].split('.').pop().split('?')[0])) {
                this.isMedia = 3;
              } else if (docs.includes(Response["url"].split('.').pop().split('?')[0])) {
                this.isMedia = 4;
              } else {
                this.isMedia = 5;
              }
              this.changeDetectorRef.detectChanges();
            } else {
              swal("unable to load message,please try again later");
            }
          }, error => {
            swal("unable to load message,please try again later");
          });
      } else {
        swal("unable to load message,please try again later");
      }
    });
  }
}
