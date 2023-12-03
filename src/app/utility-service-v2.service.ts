//@ts-nocheck
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class UtilityServiceV2 {

    maxDate = new Date();

    constructor(private http: HttpClient) {
        this.maxDate.setDate(new Date().getFullYear() + 1);
    }

    processingBackgroundData = []
    arraySubject = new Subject<any[]>();

    getArrayObservable(): Observable<any[]> {
        return this.arraySubject.asObservable();
    }

    // universal object for storing pre fetched data for better performance
    metadata = {
        patients: [],
        cases: [],
        users: [],
        practices: [],
        caseinvites: [],
        patientsTime: null,
        casesTime: null,
        usersTime: null,
        practicesTime: null,
        caseinvitesTime: null
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
            label: "LabScript",
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

    diableInactiveCaseButtonsandLinks() {

    }

    getMetaData(ids, key, value, module, asArray = false, isMulti = false) {
        if (!ids) return;
        let names = [];
        if (!Array.isArray(ids)) ids = [ids]
        ids.forEach(id => {
            let filterData = this.metadata[module].find(x => x[key] == id);
            if (filterData) {
                if (names.length > 0) names.push(",")
                value.map((item) => {
                    if (filterData[item]) names.push(filterData[item])
                })
            }
        });
        return names.length > 0 ? (asArray ? names : names.join(' ')) : null
    }

    loadPreFetchData(module, isForce = false) {
        if (!isForce && (this.metadata[module].length > 0 && (this.metadata[module + "time"] && this.metadata[module + "time"] - Date.now() < 1000 * 60 * 5))) return;
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
                            this.metadata[module + "time"] = Date.now();
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

    convertToDateInMs(datePickerValue) {
        if (!datePickerValue) return Date.now();
        let selectedDate = new Date(datePickerValue);
        let timeZoneOffset = selectedDate.getTimezoneOffset();
        selectedDate.setMinutes(selectedDate.getMinutes() - timeZoneOffset);
        return selectedDate.getTime();
    }

    showError(code) {
        if (code === 404)
            swal('No case found');
        else if (code === 403)
            swal('You are unauthorized to access the data,refresh page and try again');
        else if (code === 400)
            swal('Invalid data provided, please try again');
        else if (code === 401)
            swal('You are unauthorized to access the page,refresh page and try again');
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
        console.log(module);
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

        let Response = await this.http.get(`${this.baseUrl}objectUrl?name=${objectName}&module=${module}&type=${type}&media=${media}`, {
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
                "practiceId": "",
                "firstName": "",
                "lastName": "",
                "refId": "",
                "image": "",
                "gender": 0,
                "dob": 0,
                "isActive": true,
                "email": "",
                "phone": "",
                "address": "",
                "city": "",
                "country": "",
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
                    "practiceId": {
                        "type": "any"
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
                    "country": {
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
                    "isActive"
                ]
            },
            keyName: "patientId",
            cvfast: "notes",
            pullDependecies: { "practices": [] },
            bucket: "dentallive-patients",
            bucketUrl: "https://dentallive-patients.s3.us-west-2.amazonaws.com/",
            backUrl: '/patients',
            notifyTitle: ["firstName", "lastName"],
            notifyFixed: "Patient"
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
                "caseRunningStatus": 0,
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
                    "caseRunningStatus": {
                        "type": "integer"
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
            backUrl: '/patients',
            notifyTitle: ["title"],
            notifyFixed: "Case"
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
                "duedate": 0,
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
            pullDependecies: { "patients": [], "cases": [] },
            messageType: "3",
            backUrl: '/milestones',
            notifyTitle: ["title"],
            notifyFixed: "Milestone"
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
                "duedate": 0,
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
            pullDependecies: { "users": [] },
            backUrl: '/milestones',
            notifyTitle: ["title"],
            notifyFixed: "Task"
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
                "enddate": 0,
                "toothguide": {},
                "milestoneId": "",
                "presentStatus": 1,
                "members": [],
                "isDraft": false,
                "recieverEmail": ""
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
                    },
                    "isDraft": {
                        "type": "boolean"
                    },
                    "recieverEmail": {
                        "type": "string"
                    },
                },
                "required": [
                    "caseId",
                    "patientId",
                    "title",
                    "toothguide",
                    "presentStatus",
                ]
            },
            keyName: "workorderId",
            cvfast: "notes",
            pullDependecies: { "patients": [], "cases": [], "users": [] },
            messageType: "2",
            backUrl: '/workorders',
            notifyTitle: ["title"]
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
                "enddate": 0,
                "toothguide": {},
                "milestoneId": "",
                "presentStatus": 1,
                "members": [],
                "isDraft": false,
                "recieverEmail": ""
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
                    },
                    "isDraft": {
                        "type": "boolean"
                    },
                    "recieverEmail": {
                        "type": "string"
                    },
                },
                "required": [
                    "caseId",
                    "patientId",
                    "title",
                    "toothguide",
                    "presentStatus",
                ]
            },
            keyName: "referralId",
            cvfast: "notes",
            pullDependecies: { "patients": [], "cases": [], "users": [] },
            messageType: "4",
            backUrl: '/referrals',
            notifyTitle: ["title"],
            notifyFixed: "Referral"
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
            backUrl: "/files",
            notifyTitle: [],
            notifyFixed: "Files"
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
            backUrl: '/cases/cases',
            notifyTitle: ["title"],
            notifyFixed: "Message"
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
            backUrl: '/caseinvites/invitation-lists',
            notifyTitle: ["invitedUserMail"],
            notifyFixed: "Invitation"
        },
        users: {
            bucketUrl: "https://dentallive-accounts.s3.us-west-2.amazonaws.com/"
        },
        practices: {
            module: "practices",
            object: {
                "practiceId": "",
                "practiceName": "",
                "city": "",
                "email": "",
                "country": "",
                "isActive": true,
                "isPrimary": false,
                "practicestate": "",
                "phone": "",
                "website": "",
                "address": "",
            },
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "resourceOwner": {
                        "type": "string"
                    },
                    "practiceId": {
                        "type": "string"
                    },
                    "practiceName": {
                        "type": "string"
                    },
                    "city": {
                        "type": "string"
                    },
                    "email": {
                        "type": "string"
                    },
                    "country": {
                        "type": "string"
                    },
                    "practicestate": {
                        "type": "string"
                    },
                    "phone": {
                        "type": "string"
                    },
                    "website": {
                        "type": "string"
                    },
                    "address": {
                        "type": "string"
                    },
                    "isActive": {
                        "type": "boolean"
                    },
                    "isPrimary": {
                        "type": "boolean"
                    },
                },
                "required": [
                    "practiceName",
                    "country",
                    "email",
                    "country",
                    "phone",
                    "practicestate",
                    "isActive",
                    "isPrimary"
                ]
            },
            keyName: "practiceId",

            backUrl: '/accounts/details/practices',
            notifyTitle: ["practiceName"],
            notifyFixed: "Practice"
        },
    }

    tutorialData = {
        "DashboardComponent": {
            label: "Dashboard",
            html: "dashboard-documentation.html"
        },

        "PatientsListComponent": {
            label: "Patients",
            html: "patients-documentation.html"
        },
        "PatientDetailsComponent": {
            label: "Patient Overview",
            html: "patient-overview-documentation.html"
        },
        "PatientAddComponent": {
            label: "Adding/Editing a Patient",
            html: "patient-adding-editing-documentation.html"
        },


        "CaseListComponent": {
            label: "Cases",
            html: "cases-documentation.html"
        },
        "CaseAddComponent": {
            label: "Add/Editing Cases",
            html: "cases-adding-editing-documentation.html"
        },
        "CaseDetailsComponent": {
            label: "Case Overview",
            html: "case-overview-documentation.html"
        },


        "CaseMembersComponent": {
            label: "Colleagues",
            html: "colleagues-documentation.html"
        },

        "WorkOrdersListComponent": {
            label: "Lab Scripts",
            html: "work-orders-documentation.html"
        },
        "WorkOrderDetailsComponent": {
            label: "Lab Scripts",
            html: "work-orders-documentation.html",
            ignore: true

        },
        "WorkOrderAddComponent": {
            label: "Lab Scripts",
            html: "work-orders-documentation.html",
            ignore: true
        },



        "ReferralListComponent": {
            label: "Referrals",
            html: "referrals-documentation.html"
        },
        "ReferralDetailsComponent": {
            label: "Referrals",
            html: "referrals-documentation.html",
            ignore: true

        },
        "ReferralAddComponent": {
            label: "Referrals",
            html: "referrals-documentation.html",
            ignore: true
        },

        "MilestonesListComponent": {
            label: "Milestone",
            html: "milestone-documentation.html"
        },
        "MilestoneDetailsComponent": {
            label: "Milestone ",
            html: "milestone-documentation.html",
            ignore: true
        },
        "GeneralTaskListComponent": {
            label: "Milestone",
            html: "milestone-documentation.html",
            ignore: true
        },
        "GeneralTaskAddComponent": {
            label: "Milestone",
            html: "milestone-documentation.html",
            ignore: true
        },
        "GeneralTaskViewComponent": {
            label: "Milestone",
            html: "milestone-documentation.html",
            ignore: true
        },
        "MilestoneAddComponent": {
            label: "Milestone",
            html: "milestone-documentation.html",
            ignore: true
        },


        "InvitationListsComponent": {
            label: "Invitations",
            html: "invitations-documentation.html"
        },

        "FilesListComponent": {
            label: "Files",
            html: "files-documentation.html"
        },


        "CvfastNewComponent": {
            label: "CVFAST",
            html: "cvfast-documentation.html"
        },

    }
}