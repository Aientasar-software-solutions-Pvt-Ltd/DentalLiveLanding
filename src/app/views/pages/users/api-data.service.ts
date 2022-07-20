//@ts-nocheck
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {

  constructor(private http: HttpClient) { }

  getallData(url, isText = false) {
    if (isText)
      return this.http.get(url, { responseType: 'text' });
    else
      return this.http.get(url);
  }
  getData(url, id, isText = false) {
    if (isText)
      return this.http.get(url + `?id=${id}`, { responseType: 'text' });
    else
      return this.http.get(url + `?id=${id}`);
  }

  postData(url, data, isText = false) {
    if (isText)
      return this.http.post(url, data, { responseType: 'text' });
    else
      return this.http.post(url, data);
  }

  putData(url, data, isText = false) {
	if (isText)
	return this.http.put(url, data, { responseType: 'text' });
	else
	return this.http.put(url, data);
  }

  deleteData(url, id) {
    return this.http.delete(url + `?id=${id}`);
  }
  deletePatientData(url, patientId) {
    return this.http.delete(url + `?patientId=${patientId}`);
  }
  deleteFilesData(url, fileUploadId) {
    return this.http.delete(url + `?fileUploadId=${fileUploadId}`);
  }

  deleteAll(url) {
    return this.http.delete(url);
  }

  getDatawithMail(url, mail, id) {
    return this.http.get(url + `?accountmail=${mail}&id=${id}`);
  }

}
