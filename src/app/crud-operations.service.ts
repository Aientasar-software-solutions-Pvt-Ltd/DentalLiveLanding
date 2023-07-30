import { ActivatedRoute, Router } from '@angular/router';
import { ApiDataService } from './api.service';
import { Injectable, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import swal from "sweetalert";
import Swal from "sweetalert2"
import * as jsonschema from 'jsonschema';
import { UtilityServiceV2 } from './utility-service-v2.service';
import { CvfastNewComponent } from './cvfastFiles/cvfast-new/cvfast-new.component';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from "uuid";

@Injectable()

export class CrudOperationsService {

  constructor(private route: ActivatedRoute,
    private utility: UtilityServiceV2,
    private dataService: ApiDataService,
    private http: HttpClient,
    private router: Router,
  ) { }
  // step 1 : Assign section variable correctly
  // Step 2 : If EditMode validate and Bind Html input to this object using template driven forms (2-way Binding ([ngModel]))
  // Step 3 : If any Binary Data is uploaded add it to Binary Array
  // Step 4 : on Submit validate schema to be sent-->if valid upload Binary Array to S3 ,upon succes upload Form Data
  // Step 6 : Reset State of form after submit
  // CamelCase for naming anything
  // select this appropriately

  section = null;
  mainForm: NgForm;
  object: any;

  isEditMode = false;
  isUploadingData = false;
  isLoadingData = false;
  isLoadingDependencies = false;
  tempAvatarImage: any;
  tempAvatarName: any;
  sending = false;
  today = new Date();
  avatarData = {};
  dependentData = {};

  allowedtypes = ['image', 'video', 'audio', 'pdf', 'msword', 'ms-excel'];
  @ViewChild(CvfastNewComponent) cvfast!: CvfastNewComponent;

  Validator = jsonschema.Validator;
  dovValidateSchema = new this.Validator();

  resetForm() {
    this.isUploadingData = false;
    this.isLoadingData = false;
    this.isEditMode = false;
    // change
    this.object = JSON.parse(JSON.stringify(this.section.object));
    this.tempAvatarImage = null;
    this.tempAvatarName = null;
  }

  async loadDependencies() {
    try {
      if (!this.section.pullDependecies) return
      this.isLoadingDependencies = true;
      await Promise.all([...Object.keys(this.section.pullDependecies).map(async (key) => {
        let url = this.utility.baseUrl + key
        let Response = await this.dataService.getallData(url, true).toPromise()
        if (Response) {
          Response = JSON.parse(Response.toString())
          this.dependentData[key] = Response;
        } else {
          this.dependentData[key] = [];
        }
      })]);
      this.isLoadingDependencies = false;
    } catch (e) {
      console.log(e);
      return;
    }
  }

  async loadData(id, noCv = false) {
    try {
      let Response = await this.dataService.getallData(this.utility.baseUrl + this.section.module + "?" + this.section.keyName + "=" + id, true).toPromise();
      if (!Response) return;
      Response = JSON.parse(Response.toString())
      if (!this.dovValidateSchema.validate(Response, this.section.schema).valid) {
        swal("Invalid Data");
        this.router.navigate([this.section.backUrl])
      }
      this.object = Response;
      console.log(this.object);
      if (!noCv && this.section.cvfast)
        this.cvfast.cvfast = this.object[this.section.cvfast]
      if (this.object.image) {
        this.loadImage(this.object.image);
        this.tempAvatarName = this.object.image;
      }
      this.isLoadingData = false;
    } catch (error) {
      (error['status']) ? this.utility.showError(error['status']) : swal("Error loading Data");
      console.log(error);
      this.router.navigate([this.section.backUrl])
    }
  }

  async hasData(id, noCv = false) {
    this.isLoadingData = true;
    this.isEditMode = true;
    await this.loadData(id, noCv);
  }

  loadBinaryFile(event) {
    if (event.target.files.length > 0) {
      if (!this.allowedtypes.some(type => event.target.files[0].type.includes(type))) {
        swal("File format not allowed")
        return
      }

      this.avatarData = { name: event.target.files[0].name, binaryData: event.target.files[0] }
      //display selected file in image tag
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); //initiates converting file to blob
      reader.onload = (e) => (this.tempAvatarImage = reader.result); // call back after file is converted to Blob
      this.tempAvatarName = event.target.files[0].name;
    }
  }

  //validates data + uploads any binary files and gets the names of S3 resource --> calls formupload
  async onSubmit(hasForm = true) {
    if (hasForm && this.mainForm.invalid) {
      this.mainForm.form.markAllAsTouched();
      swal("Please Enter Values In The Highlighted Fields");
      return false;
    }
    if (!this.dovValidateSchema.validate(this.object, this.section.schema).valid || this.isEmptyString()) {
      swal("Invalid Data,please check data provided and try again");
      return false;
    }
    try {
      // update avatar Data (if any) to S3 bukcet -- this.avatarData
      if (Object.keys(this.avatarData).length > 0) {
        if (this.section.module == "patients") {
          this.object.image = await this.uploadBinaryData(uuidv4() + ".jpg", this.avatarData["binaryData"], this.section.bucket);
        } else {
          this.object.image = await this.utility.uploadBinaryData(this.avatarData["name"], this.avatarData["binaryData"], this.section.bucket);
        }
      }

      //background object creation
      let pid = uuidv4();
      let title = ""
      this.section.notifyTitle.map((item) => {
        title = title + " " + this.object[item]
      })

      let backgroundObject = {
        'module': this.section.module,
        'title': title,
        'id': pid,
        'cvfast': this.cvfast,
        'object': this.object,
        'section': this.section,
        'isEditMode': this.isEditMode
      }

      this.utility.processingBackgroundData.push(backgroundObject)
      this.utility.arraySubject.next(this.utility.processingBackgroundData);
      this.backgroundProcessData(this.cvfast, this.object, this.section, this.isEditMode, pid)
      let msg = this.section.module.toString().slice(0, -1) + " Data Added for Processing, Check Uploads Tab for Status";
      swal(msg)
      if (hasForm)
        this.section.module == "tasks" ? this.router.navigate([this.section.backUrl, { hasTask: true }]) : this.router.navigate([this.section.backUrl])
      else
        return this.object;

      return true
    } catch (error) {
      (error['status']) ? this.utility.showError(error['status']) : swal("Failed to Process files,please try again");
      this.handleError(error, null)
      return false;
    }
  }

  async backgroundProcessData(cvfast, object, section, isEditMode, id) {
    try {
      if (section.module == "casefiles") {
        //iterate and save all files in array - without CVFAST
        let values = await Promise.all(
          object.newUploadedFiles.map(async (object) => {
            return this.utility.uploadBinaryData(object["name"], object["binaryData"], "");
          }))
        //get array of names of the files stored in S3 bucket
        values.map((item) => {
          object.files.push(item)
        })
        delete object.newUploadedFiles;
      } else {
        // process cvfast binary files to S3 bucket -- this.cvfast
        if (section.cvfast)
          object[section.cvfast] = await cvfast.processFiles();
      }
      //process form data to dynamoDB -- this.object
      this.uploadFormData(object, section, isEditMode, id);
      return true
    } catch (error) {
      return this.handleError(error, id)
    }
  }

  async uploadFormData(object, section, isEditMode, id) {
    //post request here,both add & update are sent as post
    try {
      isEditMode ? await this.dataService.putData(this.utility.baseUrl + section.module, JSON.stringify(object), true).toPromise() :
        await this.dataService.postData(this.utility.baseUrl + section.module, JSON.stringify(object), true).toPromise();
      this.utility.processingBackgroundData = this.utility.processingBackgroundData.map((item) => {
        if (item.id != id) return item;
        return {
          ...item, isProcessed: true
        }
      })
      this.utility.arraySubject.next(this.utility.processingBackgroundData);
      return true;
    } catch (error) {
      return this.handleError(error, id)
    }
  }

  handleError(error, id) {
    console.log(error);
    if (id) {
      this.utility.processingBackgroundData = this.utility.processingBackgroundData.map((item) => {
        if (item.id != id) return item;
        return {
          ...item, isFailed: true, isProcessed: false, error: error
        }
      })
      this.utility.arraySubject.next(this.utility.processingBackgroundData);
    }
    return false;
  }

  uploadBinaryData(objectName, binaryData, s3BucketName) {
    var that = this;
    return new Promise(function (resolve, reject) {
      that.getPreSignedUrl(objectName, s3BucketName, binaryData.type).then((url) => {
        that.saveDataS3(binaryData, url).then(() => {
          resolve(objectName);
        }).catch((e) => {
          console.log(e);
          reject("Failed to Upload");
        });
      }).catch((e) => {
        console.log(e);
        reject("Failed to Upload");
      });
    });
  }

  async getPreSignedUrl(objectName, s3BucketName, ext) {
    let data = { "name": objectName, 'type': 'put', 'ext': ext, "storage": s3BucketName }
    let Response = await this.http.post("https://oihqs7mi22.execute-api.us-west-2.amazonaws.com/default/createPreSignedURLSecured", JSON.stringify(data)).toPromise();
    let decrypt = CryptoJS.AES.decrypt(Response['url'], environment.decryptKey).toString(CryptoJS.enc.Utf8);
    return decrypt;
  }

  async saveDataS3(binaryData: any, url: any) {
    if (await this.http.put(url, binaryData).toPromise()) return true;
    return false;
  }

  //**only for files section,validates data + uploads any binary files and gets the names of S3 resource --> calls formupload
  async submitFiles() {
    this.section.backUrl = '/cases/cases/case-view/' + this.object.caseId + '/files'
    if (!this.object.caseId || (this.object.files.length == 0 && this.object.newUploadedFiles.length == 0)) {
      this.mainForm.form.markAllAsTouched();
      swal("Please select Files to upload");
      return false;
    }

    let pid = uuidv4();
    let title = ""
    this.section.notifyTitle.map((item) => {
      title = title + " " + this.object[item]
    })

    let backgroundObject = {
      'module': this.section.module,
      'title': title,
      'id': pid,
      'cvfast': this.cvfast,
      'object': this.object,
      'section': this.section,
      'isEditMode': this.isEditMode
    }

    this.utility.processingBackgroundData.push(backgroundObject)
    this.utility.arraySubject.next(this.utility.processingBackgroundData);
    this.backgroundProcessData(this.cvfast, this.object, this.section, this.isEditMode, pid)
    let msg = this.section.module.toString().slice(0, -1) + " " + (this.isEditMode ? "Updated Successfully" : "Added Successfully")
    swal(msg)
    this.router.navigate([this.section.backUrl])
    return true;
  }

  // add on helper functions 
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  isEmptyString() {
    for (let feild of this.section.schema.required) {
      if (this.object[feild].toString().trim() == "") return true;
    }
    return false;
  }

  assignDate(date, event) {
    let thisDate = new Date(event).getTime();
    this.object[date] = thisDate;
  }

  loadImage(name) {
    if (this.section.module == "patients") {
      this.tempAvatarImage = this.section.bucketUrl + name;
    } else {
      this.utility.getPreSignedUrl(name, this.section.module, "get", null, 'text').then((response) => {
        this.tempAvatarImage = response
      }, (error) => {
        console.log(error)
      })
    }
  }

  deleteData(id) {
    Swal.fire({
      title: 'Do You Want To Delete This Record?',
      showCancelButton: true,
      confirmButtonText: 'Yes,Delete it',
      denyButtonText: `Don't delete`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.isUploadingData = true;
        this.dataService.deleteallData(this.utility.baseUrl + this.section.module + "?" + this.section.keyName + "=" + id, true).subscribe(pResponse => {
          this.isUploadingData = false;
          swal("Record Deleted succesfully");
          this.router.navigate([this.section.backUrl])
        }, (error) => {
          this.utility.showError(error.status)
          this.isUploadingData = false;
        });
      }
    })
  }

  loadCaseData(caseid) {
    if (this.dependentData['cases'] && this.dependentData['cases'].length > 0) {
      let caseDetails = this.dependentData['cases'].find(x => x['caseId'] == caseid);
      this.object.caseId = caseid
      this.object.patientId = caseDetails.patientId
      this.object.patientName = caseDetails.patientName
    }
  }

  toInt(val, event) {
    this.object[val] = Number(event);
  }

}
