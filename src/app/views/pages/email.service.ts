//@ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient, } from "@angular/common/http";

export interface mail {
  pk: string,
  sk: string,
  MailFrom: string,
  MailTo: string,
  MailCc: string,
  inReplyTo: string,
  references: string,
  mailDateTime: string,
  subject: string,
  messageId: string,
  s3link: string,
  patientId: string,
  subUserId: string,
  htmlText: string,
  plainText: string,
}

@Injectable({
  providedIn: "root",
})

export class EmailService {

  preSignUrl: string;
  httpOptions: any;

  constructor(private http: HttpClient) {
    this.preSignUrl = "https://oihqs7mi22.execute-api.us-west-2.amazonaws.com/default/createPreSignedURLSecured";
  }

  getPreSignedUrl(name, type, ext, storage = null) {
    if (!storage)
      storage = "dentalmail-attachments";
    let data = { "name": name, 'type': type, 'ext': ext, "storage": storage }
    return this.http.post(this.preSignUrl, JSON.stringify(data));
  }
  saveDataS3(data: any, url: any) {
    return this.http.put(url, data);
  }


}
