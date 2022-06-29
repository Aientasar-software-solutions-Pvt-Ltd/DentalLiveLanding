import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'https://oms5sh4336.execute-api.us-west-2.amazonaws.com/default/packages';

@Injectable({
  providedIn: GeneralModule
})
export class PackagesService {
  constructor(private httpClient: HttpClient) { }
  readAll(): Observable<any> {
    return this.httpClient.get(baseURL);
  }
}
