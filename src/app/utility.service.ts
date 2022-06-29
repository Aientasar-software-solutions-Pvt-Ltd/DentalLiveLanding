//@ts-nocheck
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private http: HttpClient) { }

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
        that.saveDataS3(binaryData, response["url"]).then(() => {
          resolve(response["name"]);
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

  async getPreSignedUrl(objectName, module, type = 'get', media) {
    let headers = new HttpHeaders();
    let auth = sessionStorage.getItem("usr");
    headers = headers.set('authorization', auth);

    let Response = await this.http.get(`https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name=${objectName}&module=${module}&type=${type}&media=${media}`, {
      headers: headers
    }).toPromise();

    return Response;
  }

  async saveDataS3(binaryData: any, url: any) {
    if (await this.http.put(url, binaryData).toPromise()) return true;
  }
}

