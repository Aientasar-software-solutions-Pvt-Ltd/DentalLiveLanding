import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { Component, Input, AfterViewInit } from '@angular/core';
import swal from 'sweetalert';

@Component({
  selector: 'app-cvfast-viewer',
  templateUrl: './cvfast-viewer.component.html',
  styleUrls: ['./cvfast-viewer.component.css'],
  exportAs: 'CvfastViewerComponent'
})
export class CvfastViewerComponent implements AfterViewInit {

  //recieves an array of names --> geneerates pre signed url for those array of names --> loads resources

  @Input() module = ""
  @Input() cvfast: any;
  @Input() showText = true;

  isLoading = false;
  urls = [];
  isMedia = 0;
  VideoPlayer: any;
  audioPlayer: any;
  constructor(private utility: UtilityServiceV2) { }

  ngAfterViewInit() {
    this.process(this.cvfast)
  }

  process(cvfast) {
    this.reset()
    this.cvfast = cvfast
    if (!this.cvfast || !this.cvfast.links || this.cvfast.links.length == 0) return;
    this.isLoading = true
    this.cvfast?.links.forEach(file => {
      this.utility.getPreSignedUrl(file, this.module, 'get', null, 'text').then((response) => {
        if (response) {
          let video = ["mp4", "webm", "ogg"];
          let audio = ["mp3", "wav"];
          let images = ["jpg", "jpeg", "png", "webp", "avif", "gif", "svg"];
          let media = 0;
          if (video.includes(response.toString().split('.').pop().split('?')[0])) {
            media = 1;
          } else if (audio.includes(response.toString().split('.').pop().split('?')[0])) {
            media = 2;
          } else if (images.includes(response.toString().split('.').pop().split('?')[0])) {
            media = 3;
          }
          this.urls.push({
            name: file,
            url: response,
            media: media
          })
          if (this.cvfast.links[this.cvfast.links.length - 1] == file)
            this.isLoading = false
        } else {
          swal("unable to load message,please try again later");
        }
      }, error => {
        console.log(error);
        swal("unable to load message,please try again later");
      });
    })

  }

  reset() {
    this.urls = []
    this.cvfast = null;
  }

  getFileName(fileName) {
    if (fileName.indexOf('__-__') == -1) return fileName
    let name = fileName.split("__-__");
    let ext = fileName.split(".");
    return name[0] + "." + ext[ext.length - 1]
  }
}
