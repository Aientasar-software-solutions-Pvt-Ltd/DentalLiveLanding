import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UtilityService } from "../../users/utility.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Country, State } from 'country-state-city';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {
  module = 'users';
  isLoadingData = true;

  section = this.utility.apiData.userAccounts;
  imageSrc: any;
  data: any;

  constructor(
    private route: ActivatedRoute,
    public utility: UtilityService,
    private router: Router,
    public utility2: UtilityServiceV2) { }
  @ViewChild("mainForm", { static: false }) mainForm: NgForm;
  @ViewChild("subForm", { static: false }) subForm: NgForm;
  ngOnInit() {
    this.loadData();
  }

  getState(stateCode, countryCode) {
    return stateCode && countryCode ? State.getStateByCodeAndCountry(stateCode, countryCode).name : ""
  }

  getCountry(id) {
    return id ? Country.getCountryByCode(id).name : "";
  }
  async loadData() {
    await this.utility2.loadPreFetchData("practices");
    this.route.paramMap.subscribe(async (params) => {
      if (params.get("id") && params.get("id") != "") {
        if (this.utility2.metadata.users.length == 0)
          await this.utility2.loadPreFetchData("users");
        this.data = this.utility2.metadata.users.find(member => member.emailAddress == params.get("id"));
        this.isLoadingData = false;
      }
      else
        this.router.navigate(['/colleague-lists'])
    });
  }
}
