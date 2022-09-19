
import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, delay, map, retry, retryWhen } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { AccdetailsService } from './accdetails.service';

@Injectable({
    providedIn: 'root'
})


export class AuthInterceptorService implements HttpInterceptor {
    constructor(private usr: AccdetailsService) { }
    msArray = ['useraccounts', 'customerroles', 'subusernew', 'subuseraccountsnew', 'patients', 'contacts', 'userpurchases', 'usage', 'sendMailDental', 'cases', 'casefiles', 'milestones', 'tasks', 'workorders', 'referrals', 'messages', 'users', 'caseinvites', 'threads', 'login', 'sendinvite'];
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        //Outgoing Request handler
        let tempRequest = request;
        if (sessionStorage.getItem("usr") && request.url.includes('execute-api.us-west-2.amazonaws.com')) {
            let authHeader = {
                aut: this.usr.getUserDetails().aut,
                userid: this.usr.getUserDetails().dentalId,
                addressid: '192.168.0.1'
            }
            request = request.clone({ headers: request.headers.set('authorization', CryptoJS.AES.encrypt(JSON.stringify(authHeader), environment.decryptKey).toString()) });
        } else if (!sessionStorage.getItem("usr") && request.url.includes('execute-api.us-west-2.amazonaws.com')) {
            request = request.clone({ headers: request.headers.set('authorization', "") });
        }
        if (request.url.includes('execute-api.us-west-2.amazonaws.com') && this.msArray.some(ms => request.url.includes(ms))) {
            let encrypt = CryptoJS.AES.encrypt(request.body, environment.decryptKey).toString();
            request = request.clone({ body: encrypt });
        }

        //Incoming Request Handler
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse && request.url.includes('execute-api.us-west-2.amazonaws.com') && this.msArray.some(ms => request.url.includes(ms))) {
                    let decrypt = CryptoJS.AES.decrypt(event.body, environment.decryptKey).toString(CryptoJS.enc.Utf8);
                    if (tempRequest.body && (JSON.parse(tempRequest.body).isSocialLogin || JSON.parse(tempRequest.body).isLogin || JSON.parse(tempRequest.body).isValidate)) {
                        sessionStorage.setItem('usr', event.body);
                    }//if its a login save the data as cookie 
                    event = event.clone({ body: decrypt });
                }
                return event;
            }),
            retry(2)
        );
    }
}