import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { v4 as uuidv4 } from "uuid";
import swal from "sweetalert";
import { AddEditData, UtilityService } from "../../users/utility.service";
import { ApiDataService } from "../../users/api-data.service";

@Component({
  selector: 'app-addsubusers',
  templateUrl: './addsubusers.component.html',
  styleUrls: ['./addsubusers.component.css']
})
export class AddsubusersComponent implements OnInit, AddEditData {

  // step 1 : Assign section variable correctly
  // Step 2 : If EditMode validate and Bind Html input to this object using template driven forms (2-way Binding ([ngModel]))
  // Step 3 : If any Binary Data is uploaded add it to Binary Array
  // Step 4 : on Submit validate schema to be sent-->if valid upload Binary Array to S3 ,upon succes upload Form Data
  // Step 6 : Reset State of form after submit
  // CamelCase for naming anything

  // select this appropriately
  section = this.utility.apiData.subUser;
  imageSrc: any;
  object: any;
  isEditMode = false;
  isUploadingData = false;
  isLoadingData = false;
  binaryFiles = [];
  rolesList: any = [];
  packageList: any = [];

  constructor(
    private route: ActivatedRoute,
    private utility: UtilityService,
    private dataService: ApiDataService,
    private router: Router
  ) { }

  @ViewChild("mainForm", { static: false }) mainForm: NgForm;

  ngOnInit() {
    this.resetForm();
    this.hasData();
    this.rolesList = [];
    this.getDependencies();
  }

  getDependencies() {
    this.dataService.getallData(this.utility.apiData.userRoles.ApiUrl + `?did=${this.object.dentalID}`, true).subscribe(
      (Response) => {
        if (Response) Response = JSON.parse(Response.toString());
        this.rolesList = Response;
      });

    this.dataService.getallData(this.utility.apiData.usage.ApiUrl + `?type=subusers&email=${this.object.dentalID}`, true).subscribe(
      (Response) => {
        if (Response) Response = JSON.parse(Response.toString());
        this.packageList = Response;
      });

  }

  resetForm() {
    this.isUploadingData = false;
    this.isLoadingData = false;
    this.isEditMode = false;
    // change
    this.object = JSON.parse(JSON.stringify(this.section.object));
    this.object.dentalID = this.utility.getUserDetails().emailAddress;
    this.object.url = this.object.url + this.utility.getUserDetails().emailAddress;
    this.imageSrc = null;
  }

  loadData(id) {
    //Get Form Data via API
    this.dataService.getallData(this.section.ApiUrl + `?did=${this.object.dentalID}` + `&id=${id}`, true).subscribe(
      (Response) => {
        if (Response) Response = JSON.parse(Response.toString());
        if (!this.utility.dovValidateSchema.validate(Response, this.section.schema).valid) {
          swal("No data exists");
          this.router.navigate(['/accounts/details/subusers']);
        }
        this.object = Response;
        if (this.object.imageSrc) this.imageSrc = this.section.bucketUrl + this.object.imageSrc;
        this.isLoadingData = false;
      },
      (error) => {
        swal("No data exists");
        this.router.navigate(['/accounts/details/subusers']);
      });
  }

  hasData() {
    this.route.paramMap.subscribe((params) => {
      if (params.get("id") && params.get("id") != "") {
        this.isLoadingData = true;
        this.isEditMode = true;
        this.loadData(params.get("id"));
      }
    });
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
      .postData(this.section.ApiUrl, JSON.stringify(this.object))
      .subscribe((Response) => {
        this.isEditMode ? swal("User updated succesfully") : swal("User added succesfully");
        this.router.navigate(['/accounts/details/subusers']);
      }, (error) => {
        if (error.status == 406)
          swal("Failed to add User,E-Mail Address exists");
        else
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
    return null;
  }

  onDisable() {
    let object = {
      'dentalID': this.object.dentalID,
      'subUserID': this.object.subUserID,
      'status': !this.object.status
    };
    this.isUploadingData = true;
    this.dataService
      .putData(this.section.ApiUrl, JSON.stringify(object))
      .subscribe((Response) => {
        ;
        swal("User Updated Succesfully");
        this.router.navigate(['/accounts/details/subusers']);
      }, (error) => {
        swal("Failed to process request,please try again");

        this.isUploadingData = false;
      });
  }

  onDelete() {
    if (!this.object.subUserID) {
      swal("No User Exists with given ID");
      return;
    }
    this.isUploadingData = true;
    this.dataService.deleteAll(this.section.ApiUrl + `?did=${this.object.dentalID}` + `&id=${this.object.subUserID}`).subscribe(
      (Response) => {
        swal("User Deleted Succesfully");
        this.router.navigate(['/accounts/details/subusers']);
      },
      (error) => {
        swal("Failed to process request,please try again");
        this.isUploadingData = false;
      });
  }
}
