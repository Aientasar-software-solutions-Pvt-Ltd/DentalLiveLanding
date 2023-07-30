import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viewtutorial',
  templateUrl: './viewtutorial.component.html',
  styleUrls: ['./viewtutorial.component.css']
})
export class ViewtutorialComponent implements OnInit, OnDestroy {

  URL;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) { }
  ngOnDestroy(): void {
    document.body.classList.remove("overflow-hidden")
  }

  ngOnInit(): void {
    document.body.classList.add("overflow-hidden");
    this.route.paramMap.subscribe((params) => {
      if (params.get("module") && params.get("module") != "") {
        this.URL = this.sanitizer.bypassSecurityTrustResourceUrl("https://d323l7u8hz3cpb.cloudfront.net/" + params.get("module"));
      }
    });
  }

}
