//@ts-nocheck
import { Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { v4 as uuidv4 } from "uuid";
import swal from "sweetalert";
import { AccdetailsService } from "../../accdetails.service";
import { ApiDataService } from "../../users/api-data.service";
import { AddEditData, UtilityService } from "../../users/utility.service";

@Component({
  selector: 'app-editsubaccount',
  templateUrl: './editsubaccount.component.html',
  styleUrls: ['./editsubaccount.component.css']
})
export class EditsubaccountComponent implements OnInit, AddEditData {
  // step 1 : Assign section variable correctly
  // Step 2 : If EditMode validate and Bind Html input to this object using template driven forms (2-way Binding ([ngModel]))
  // Step 3 : If any Binary Data is uploaded add it to Binary Array
  // Step 4 : on Submit validate schema to be sent-->if valid upload Binary Array to S3 ,upon succes upload Form Data
  // Step 6 : Reset State of form after submit
  // CamelCase for naming anything

  // select this appropriately
  section = this.utility.apiData.subUserAccounts;
  imageSrc: any;
  object: any;
  isEditMode = false;
  isUploadingData = false;
  isLoadingData = false;
  binaryFiles = [];

  constructor(
    private usr: AccdetailsService,
    private utility: UtilityService,
    private dataService: ApiDataService,
    private router: Router
  ) { }

  subUserID = this.usr.getUserDetails().Subuser ? this.usr.getUserDetails().Subuser.subUserID : null;

  @ViewChild("mainForm", { static: false }) mainForm: NgForm;
  @ViewChild("subForm", { static: false }) subForm: NgForm;

  ngOnInit() {
    this.resetForm();
    this.hasData();
  }

  resetForm() {
    this.isUploadingData = false;
    this.isLoadingData = false;
    this.isEditMode = false;
    // change
    this.object = JSON.parse(JSON.stringify(this.section.object));
    this.object.dentalID = this.utility.getUserDetails().emailAddress;
    this.imageSrc = null;
  }

  loadData(id) {
    //Get Form Data via API
    this.dataService.getallData(this.section.ApiUrl + `?did=${this.object.dentalID}&id=${id}`, true).subscribe(
      (Response) => {
        if (Response) Response = JSON.parse(Response.toString());
        if (!this.utility.dovValidateSchema.validate(Response, this.section.schema).valid) {
          swal("No data exists");
          this.router.navigate(['/auth/login']);
        }
        this.object = Response;
        if (this.object.imageSrc) this.imageSrc = this.section.bucketUrl + this.object.imageSrc;
        this.isLoadingData = false;
      },
      (error) => {
        swal("No data exists");
        this.router.navigate(['/auth/login']);
      });
  }

  hasData() {
    if (this.subUserID) {
      this.isLoadingData = true;
      this.isEditMode = true;
      this.loadData(this.subUserID);
    } else {
      swal("Invalid user selected");
      this.router.navigate(['/auth/login']);
    }
  }

  uploadBinaryData() {
    this.object.imageSrc = ""; //only in cases where there is singular binding
    let requests = this.binaryFiles.map((object) => {
      return this.utility.uploadBinaryData(object["name"], object["binaryData"], this.section.bucket);
    });
    Promise.all(requests)
      .then((responses) => {
        this.object.imageSrc = responses[0]["name"];
        this.uploadFormData();
      })
      .catch((error) => {

        this.isUploadingData = false;
      });
  }

  uploadFormData() {
    //post request here,both add & update are sent as post
    this.dataService
      .putData(this.section.ApiUrl, JSON.stringify(this.object))
      .subscribe((Response) => {
        ;
        this.isEditMode ? swal("Updated succesfully") : swal("Added succesfully");
        this.isUploadingData = false;
      }, (error) => {
        swal("Failed to process request,please try again");

        this.isUploadingData = false;
      });
  }

  loadBinaryFile(event) {
    if (event.target.files.length > 0) {
      //reset binaryFiles array to this image --> S3 allows to directly upload file object or Blob data,for simplicity here file object is used
      this.binaryFiles = [
        { name: uuidv4(), binaryData: event.target.files[0] },
      ];

      //display selected file in image tag
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); //initiates converting file to blob
      reader.onload = (e) => (this.imageSrc = reader.result); // call back after file is converted to Blob
    }
  }

  onSubmit() {
    if (this.mainForm.invalid) {
      this.mainForm.form.markAllAsTouched();
      swal("Please enter values in the highlighted fields");
      return false;
    }
    this.isUploadingData = true;

    if (this.binaryFiles.length > 0) {
      this.uploadBinaryData();
    } else {
      this.uploadFormData();
    }
  }

  updatePassword(opass, npass, cpass) {
    if (this.subForm.invalid || (npass != cpass)) {
      this.mainForm.form.markAllAsTouched();
      swal("Please enter values in the highlighted fields");
      return false;
    }
    this.isUploadingData = true;
    let obj = {
      'dentalID': this.object.dentalID,
      "subUserID": this.subUserID,
      "password": npass,
      "oldPassword": opass
    }
    this.dataService
      .putData(this.section.ApiUrl, JSON.stringify(obj))
      .subscribe((Response) => {
        ;
        swal("Password updated succesfully");
        this.subForm.reset();
        this.isUploadingData = false;
      }, (error) => {
        if (error.status === 428)
          swal('Wrong Password');
        else
          swal("Failed to process request,please try again");

        this.isUploadingData = false;
      });
  }
}
