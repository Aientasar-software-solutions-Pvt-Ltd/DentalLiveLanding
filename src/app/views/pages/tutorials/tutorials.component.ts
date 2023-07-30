import { DomSanitizer } from '@angular/platform-browser';
import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tutorials',
  templateUrl: './tutorials.component.html',
  styleUrls: ['./tutorials.component.css']
})
export class TutorialsComponent implements OnInit, OnDestroy {

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
