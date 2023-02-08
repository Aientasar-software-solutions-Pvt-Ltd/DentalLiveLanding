//@ts-nocheck
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})

export class UtilityServiceV2 {

  constructor(private http: HttpClient) { }

  // universal object for storing pre fetched data for better performance
  metadata = {
    patients: [],
    cases: [],
    users: [],
    caseinvites: []
  }

  casetype = [
    { name: "General Dentistry", id: 1 },
    { name: "Endodontics", id: 2 },
    { name: "Dental Pediatrics", id: 3 },
    { name: "Prosthodontics", id: 4 },
    { name: "Oral Surgery", id: 5 },
    { name: "Lab", id: 6 },
    { name: "Periodontics", id: 7 },
    { name: "Oral Pathology", id: 8 },
    { name: "Denturist", id: 9 },
    { name: "Orthodontics", id: 10 },
    { name: "Oral Radiology", id: 11 },
    { name: "Hygiene", id: 12 }
  ];

  threadMetaData = {
    "DETAILS": {
      label: "Case Details",
      details: "title",
      route: 'details',
      key: 'caseId'
    },
    "MESSAGES": {
      label: "Message",
      details: "message",
      route: 'messages',
      key: 'messageId'
    },
    "CASEINVITES": {
      label: "Colleague",
      details: "invitedUserMail",
      route: 'colleagues',
      key: 'invitationId'
    },
    "WORKORDERS": {
      label: "Work order",
      details: "title",
      route: 'workorders',
      key: 'workorderId'
    },
    "REFERRALS": {
      label: "Referral",
      details: "title",
      route: 'referrals',
      key: 'referralId'
    },
    "MILESTONES": {
      label: "Milestone",
      details: "title",
      route: 'milestones',
      key: 'milestoneId'
    },
    "TASKS": {
      label: "Task",
      details: "title",
      route: 'milestones',
      key: 'milestoneId'
    },
    "FILES": {
      label: "File",
      details: null,
      route: 'files',
      key: 'fileUploadId'
    }
  }

  getMetaData(ids, key, value, module, asArray = false) {
    let names = [];
    if (!Array.isArray(ids)) ids = [ids]
    ids.forEach(id => {
      let filterData = this.metadata[module].find(x => x[key] == id);
      if (filterData) {
        value.map((item) => names.push(filterData[item]))
      }
    });
    return asArray ? names : names.join(' ')
  }

  loadPreFetchData(module) {
    return new Promise<void>((Resolve, Reject) => {
      try {
        let headers = new HttpHeaders();
        let auth = sessionStorage.getItem("usr");
        headers = headers.set('authorization', auth);

        let url = this.baseUrl + module;
        this.http.get(url, { responseType: 'text', headers: headers }).subscribe(
          (Response) => {
            if (Response) {
              Response = JSON.parse(Response.toString());
              this.metadata[module] = Response
              Resolve()
            }
          },
          (error) => {
            console.log(error)
            Reject()
          });

      } catch (error) {
        console.log(error)
        Reject()
      }
    });
  }

  loadAllCases() {
    return new Promise((Resolve, Reject) => {
      try {
        let headers = new HttpHeaders();
        let auth = sessionStorage.getItem("usr");
        headers = headers.set('authorization', auth);

        let url = this.baseUrl + 'cases?allCases=true';
        this.http.get(url, { responseType: 'text', headers: headers }).subscribe(
          (Response) => {
            if (Response) {
              Response = JSON.parse(Response.toString());
              Resolve(Response)
            }
          },
          (error) => {
            console.log(error)
            Reject()
          });

      } catch (error) {
        console.log(error)
        Reject()
      }
    });
  }

  loadAllPatients() {
    return new Promise((Resolve, Reject) => {
      try {
        let headers = new HttpHeaders();
        let auth = sessionStorage.getItem("usr");
        headers = headers.set('authorization', auth);

        let url = this.baseUrl + 'patients?allPatients=true';
        this.http.get(url, { responseType: 'text', headers: headers }).subscribe(
          (Response) => {
            if (Response) {
              Response = JSON.parse(Response.toString());
              Resolve(Response)
            }
          },
          (error) => {
            console.log(error)
            Reject()
          });

      } catch (error) {
        console.log(error)
        Reject()
      }
    });
  }

  baseUrl = "https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/"

  showError(code) {
    if (code === 404)
      swal('No case found');
    else if (code === 403)
      swal('You are unauthorized to access the data');
    else if (code === 400)
      swal('Invalid data provided, please try again');
    else if (code === 401)
      swal('You are unauthorized to access the page');
    else if (code === 409)
      swal('Duplicate data entered');
    else if (code === 405)
      swal('Due to dependency data unable to complete operation');
    else if (code === 500)
      swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
    else
      swal('Oops something went wrong, please try again');
  }

  getUserDetails() {
    try {
      let user = sessionStorage.getItem("usr");
      if (!user)
        return false;
      let decrypt = JSON.parse(CryptoJS.AES.decrypt(user, environment.decryptKey).toString(CryptoJS.enc.Utf8));
      if (decrypt.exp < Date.now())
        return false;
      return decrypt;
    } catch (e) {
      sessionStorage.removeItem("usr");
      return false;
    }
  }

  uploadBinaryData(objectName, binaryData, module) {
    var that = this;
    return new Promise(function (resolve, reject) {
      that.getPreSignedUrl(objectName, module, 'put', binaryData.type).then((response) => {
        //save Data to S3 using pre signed URL
        that.http.put(response["url"], binaryData).toPromise().then(() => {
          resolve(response["name"]);
        }, (error) => {
          console.log(error);
          reject("Failed to Upload");
        })
      }, (error) => {
        console.log(error);
        reject("Failed to Upload");
      });
    });
  }


  async getPreSignedUrl(objectName, module, type = 'get', media, responseType = 'json') {
    let headers = new HttpHeaders();
    let auth = sessionStorage.getItem("usr");
    headers = headers.set('authorization', auth);

    let Response = await this.http.get(`${this.baseUrl}/objectUrl?name=${objectName}&module=${module}&type=${type}&media=${media}`, {
      headers: headers, responseType: responseType
    }).toPromise();
    return Response;
  }

  getUserImage(id) {
    let image = this.getMetaData(
      id,
      "emailAddress",
      ["imageSrc"],
      "users"
    )
    image = image && image.toString().trim() != "undefined" ? this.apiData.users.bucketUrl + image.toString().trim() : '../../assets/images/users.png'
    return image
  }

  apiData = {
    patients: {
      module: "patients",
      object: {
        "patientId": "",
        "firstName": "",
        "lastName": "",
        "refId": "",
        "image": "",
        "gender": 0,
        "dob": new Date().getTime(),
        "isActive": true,
        "email": "",
        "phone": "",
        "address": "",
        "city": "",
        "residingState": "",
        "notes": {},
        "insurance": {},
        "medication": []
      },
      schema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
          "resourceOwner": {
            "type": "string"
          },
          "patientId": {
            "type": "string"
          },
          "firstName": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "refId": {
            "type": "string"
          },
          "image": {
            "type": "string"
          },
          "gender": {
            "type": "integer"
          },
          "dob": {
            "type": "integer"
          },
          "isActive": {
            "type": "boolean"
          },
          "email": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "address": {
            "type": "any"
          },
          "city": {
            "type": "string"
          },
          "residingState": {
            "type": "string"
          },
          "notes": {
            "type": "object"
          },
          "insurance": {
            "type": "object"
          },
          "medication": {
            "type": "array"
          }
        },
        "required": [
          "firstName",
          "lastName",
          "dob",
          "email",
          "residingState",
          "isActive"
        ]
      },
      keyName: "patientId",
      cvfast: "notes",
      bucket: "dentallive-patients",
      bucketUrl: "https://dentallive-patients.s3.us-west-2.amazonaws.com/",
      backUrl: '/patients'
    },
    cases: {
      module: "cases",
      object: {
        "caseId": "",
        "patientId": "",
        "patientName": "",
        "image": "",
        "title": "",
        "description": {},
        "caseStatus": true,
        "caseType": []
      },
      schema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
          "resourceOwner": {
            "type": "string"
          },
          "caseId": {
            "type": "string"
          },
          "patientId": {
            "type": "string"
          },
          "patientName": {
            "type": "string"
          },
          "image": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "description": {
            "type": "object"
          },
          "caseStatus": {
            "type": "boolean"
          },
          "caseType": {
            "type": "array",
            "items": {}
          }
        },
        "required": [
          "patientId",
          "patientName",
          "title",
          "description",
          "caseType",
          "caseStatus"
        ]
      },
      keyName: "caseId",
      cvfast: "description",
      pullDependecies: { "patients": [] },
      backUrl: '/cases/cases'
    },
    milestones: {
      module: "milestones",
      object: {
        "milestoneId": "",
        "caseId": "",
        "patientId": "",
        "patientName": "",
        "title": "",
        "description": {},
        "startdate": new Date().getTime(),
        "duedate": new Date().getTime(),
        "presentStatus": 1,
        "reminder": 0
      },
      schema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
          "resourceOwner": {
            "type": "string"
          },
          "milestoneId": {
            "type": "string"
          },
          "caseId": {
            "type": "string"
          },
          "patientId": {
            "type": "string"
          },
          "patientName": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "description": {
            "type": "object"
          },
          "startdate": {
            "type": "integer"
          },
          "duedate": {
            "type": "integer"
          },
          "presentStatus": {
            "type": "integer"
          },
          "reminder": {
            "type": "integer"
          }
        },
        "required": [
          "caseId",
          "patientId",
          "patientName",
          "title",
          "description",
          "startdate",
          "duedate",
          "presentStatus",
          "reminder"
        ]
      },
      keyName: "milestoneId",
      cvfast: "description",
      pullDependecies: { "cases": [] },
      messageType: "3",
      backUrl: '/milestones'
    },
    tasks: {
      module: "tasks",
      object: {
        "taskId": "",
        "milestoneId": "",
        "caseId": "",
        "patientId": "",
        "patientName": "",
        "title": "",
        "description": {},
        "startdate": new Date().getTime(),
        "duedate": new Date().getTime(),
        "presentStatus": 1,
        "reminder": 0,
        "memberMail": ""
      },
      schema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
          "resourceOwner": {
            "type": "string"
          },
          "taskId": {
            "type": "string"
          },
          "caseId": {
            "type": "string"
          },
          "patientId": {
            "type": "string"
          },
          "patientName": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "description": {
            "type": "object"
          },
          "startdate": {
            "type": "integer"
          },
          "duedate": {
            "type": "integer"
          },
          "presentStatus": {
            "type": "integer"
          },
          "reminder": {
            "type": "integer"
          },
          "milestoneId": {
            "type": "string"
          },
          "memberMail": {
            "type": "string"
          }
        },
        "required": [
          "caseId",
          "patientId",
          "patientName",
          "title",
          "description",
          "startdate",
          "duedate",
          "presentStatus",
          "reminder",
          "milestoneId",
          "memberMail"
        ]
      },
      keyName: "taskId",
      cvfast: "description",
      pullDependecies: null,
      backUrl: '/milestones'
    },
    workorders: {
      module: "workorders",
      object: {
        "workorderId": "",
        "caseId": "",
        "patientId": "",
        "patientName": "",
        "title": "",
        "notes": {},
        "startdate": new Date().getTime(),
        "enddate": new Date().getTime(),
        "toothguide": {},
        "milestoneId": "",
        "presentStatus": 1,
        "members": []
      },
      schema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
          "resourceOwner": {
            "type": "string"
          },
          "workorderId": {
            "type": "string"
          },
          "caseId": {
            "type": "string"
          },
          "patientId": {
            "type": "string"
          },
          "patientName": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "notes": {
            "type": "object"
          },
          "startdate": {
            "type": "integer"
          },
          "enddate": {
            "type": "integer"
          },
          "toothguide": {
            "type": "object"
          },
          "milestoneId": {
            "type": "string"
          },
          "presentStatus": {
            "type": "integer"
          },
          "members": {
            "type": "array"
          }
        },
        "required": [
          "caseId",
          "patientId",
          "patientName",
          "title",
          "toothguide",
          "presentStatus",
          "members"
        ]
      },
      keyName: "workorderId",
      cvfast: "notes",
      pullDependecies: { "cases": [] },
      messageType: "2",
      backUrl: '/workorders'
    },
    referrals: {
      module: "referrals",
      object: {
        "referralId": "",
        "caseId": "",
        "patientId": "",
        "patientName": "",
        "title": "",
        "notes": {},
        "startdate": new Date().getTime(),
        "enddate": new Date().getTime(),
        "toothguide": {},
        "milestoneId": "",
        "presentStatus": 1,
        "members": []
      },
      schema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
          "resourceOwner": {
            "type": "string"
          },
          "referralId": {
            "type": "string"
          },
          "caseId": {
            "type": "string"
          },
          "patientId": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "notes": {
            "type": "object"
          },
          "startdate": {
            "type": "integer"
          },
          "enddate": {
            "type": "integer"
          },
          "toothguide": {
            "type": "object"
          },
          "milestoneId": {
            "type": "string"
          },
          "presentStatus": {
            "type": "integer"
          },
          "members": {
            "type": "array"
          }
        },
        "required": [
          "caseId",
          "patientId",
          "title",
          "toothguide",
          "presentStatus",
          "members"
        ]
      },
      keyName: "referralId",
      cvfast: "notes",
      pullDependecies: { "cases": [] },
      messageType: "4",
      backUrl: '/referrals'
    },
    casefiles: {
      module: "casefiles",
      object: {
        "fileUploadId": "",
        "caseId": "",
        "patientId": "",
        "patientName": "",
        "files": []
      },
      schema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
          "resourceOwner": {
            "type": "string"
          },
          "patientId": {
            "type": "string"
          },
          "patientName": {
            "type": "string"
          },
          "fileUploadId": {
            "type": "string"
          },
          "caseId": {
            "type": "string"
          },
          "files": {
            "type": "array",
          },
          "ownerName": {
            "type": "string"
          },
        },
        "required": [
          "caseId",
          "files",
          "patientId",
          "patientName",
        ]
      },
      keyName: "fileUploadId",
      cvfast: null,
      pullDependecies: { "cases": [] },
      backUrl: "/files"
    },
    threads: {
      module: "threads",
      object: {
        "caseId": "",
        "patientId": "",
        "patientName": ""
      },
      schema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
          "resourceOwner": {
            "type": "string"
          },
          "patientId": {
            "type": "string"
          },
          "patientName": {
            "type": "string"
          },
          "caseId": {
            "type": "string"
          }
        },
        "required": [
          "caseId",
          "patientId",
          "patientName"
        ]
      },
      keyName: null,
      cvfast: null,
      pullDependecies: null,
      backUrl: '/cases/cases'
    },
    messages: {
      module: "messages",
      object: {
        "messageId": "",
        "caseId": "",
        "patientId": "",
        "patientName": "",
        "image": "",
        "title": "",
        "message": {},
        "comments": [],
        "messageType": "",
        "messageReferenceId": "",
      },
      schema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
          "resourceOwner": {
            "type": "string"
          },
          "messageId": {
            "type": "string"
          },
          "caseId": {
            "type": "string"
          },
          "patientId": {
            "type": "string"
          },
          "patientName": {
            "type": "string"
          },
          "message": {
            "type": "object"
          },
          "comments": {
            "type": "array"
          },
          "messageType": {
            "type": "string"
          },
          "messageReferenceId": {
            "type": "string"
          }
        },
        "required": [
          "caseId",
          "patientId",
          "patientName",
          "message",
          "messageType",
          "messageReferenceId"
        ]
      },
      keyName: "messageId",
      cvfast: "message",
      pullDependecies: null,
      messageType: "1",
      backUrl: '/cases/cases'
    },
    caseinvites: {
      module: "caseinvites",
      object: {
        "invitationId": "",
        "caseId": "",
        "patientId": "",
        "patientName": "",
        "invitedUserMail": "",
        "invitedUserId": "",
        "presentStatus": 0,
        "invitationText": {},
        "responseText": {}
      },
      schema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
          "resourceOwner": {
            "type": "string"
          },
          "invitationId": {
            "type": "string"
          },
          "caseId": {
            "type": "string"
          },
          "patientId": {
            "type": "string"
          },
          "patientName": {
            "type": "string"
          },
          "invitedUserMail": {
            "type": "string"
          },
          "invitedUserId": {
            "type": "string"
          },
          "presentStatus": {
            "type": "integer"
          },
          "invitationText": {
            "type": "object"
          },
          "responseText": {
            "type": "object"
          }
        },
        "required": [
          "caseId",
          "patientId",
          "patientName",
          "invitedUserMail",
          "invitedUserId",
          "presentStatus"
        ]
      },
      keyName: "invitationId",
      cvfast: null,
      pullDependecies: null,
      backUrl: '/caseinvites/invitation-lists'
    },
    users: {
      bucketUrl: "https://dentallive-accounts.s3.us-west-2.amazonaws.com/"
    }
  }
}