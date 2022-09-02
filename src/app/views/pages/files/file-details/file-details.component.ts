//@ts-nocheck
import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CalendarOptions } from '@fullcalendar/angular'; 
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.css']
})
export class FileDetailsComponent implements OnInit {
	public filedetails: any;
	public allfilesdata: any;
	public tabledata: any;
	public module = 'patient';
	base64Image: any;
    urlSafe: SafeResourceUrl;
	
  filesId: string;
  getcaseId: string;
  constructor(private dataService: ApiDataService, private utility: UtilityService, private usr: AccdetailsService, private router: Router,private utilitydev: UtilityServicedev, public sanitizer: DomSanitizer, private route: ActivatedRoute) { 
	this.filesId = this.route.snapshot.paramMap.get('filesId');
	this.getcaseId = this.route.snapshot.paramMap.get('caseId');
  }

  ngOnInit(): void {
  this.filedetails = '';
  this.getFileDetails();
  this.getCaseDetails();
  }
  
	getFileDetails() {
		swal("Processing...please wait...", {
		  buttons: [false, false],
		  closeOnClickOutside: false,
		});
		let url = this.utility.apiData.userCaseFiles.ApiUrl;
		let fileUploadId = this.filesId;
		if(fileUploadId != '')
		{
			url += "?fileUploadId="+fileUploadId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				swal.close();
				this.allfilesdata = JSON.parse(Response.toString());
				this.setcvFast(this.allfilesdata);
				//alert(JSON.stringify(this.allfilesdata));
			}
		}, error => {
		  if (error.status === 404)
			swal.fire('E-Mail ID does not exists,please signup to continue');
		  else if (error.status === 403)
			swal.fire('Account Disabled,contact Dental-Live');
		  else if (error.status === 400)
			swal.fire('Wrong Password,please try again');
		  else if (error.status === 401)
			swal.fire('Account Not Verified,Please activate the account from the Email sent to the Email address.');
		  else if (error.status === 428)
			swal.fire(error.error);
		  else
			swal.fire('Unable to fetch the data, please try again');
		});
	}
	
	setcvFast(obj: any)
	{
		if(obj.files.length > 0)
		{
			for(var i = 0; i < obj.files.length; i++)
			{
				
				let ImageName = obj.files[0].name;
				let url = 'https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name='+ImageName+'&module='+this.module+'&type=get';
				this.dataService.getallData(url, true)
				.subscribe(Response => {
					if (Response)
					{
						this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(Response);
						this.allfilesdata.files[0].url = Response;
						//alert(this.urlSafe);
					}
				}, error => {
				  if (error.status === 404)
					swal.fire('E-Mail ID does not exists,please signup to continue');
				  else if (error.status === 403)
					swal.fire('Account Disabled,contact Dental-Live');
				  else if (error.status === 400)
					swal.fire('Wrong Password,please try again');
				  else if (error.status === 401)
					swal.fire('Account Not Verified,Please activate the account from the Email sent to the Email address.');
				  else if (error.status === 428)
					swal.fire(error.error);
				  else
					swal.fire('Unable to fetch the data, please try again');
				});
			}
			this.filedetails = this.allfilesdata;
		}
	}
	getCaseDetails() {
		this.tabledata = '';
		let url = this.utility.apiData.userCases.ApiUrl;
		let caseId = this.getcaseId;
		if(caseId != '')
		{
			url += "?caseId="+caseId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.tabledata = JSON.parse(Response.toString());
				//alert(JSON.stringify(this.tabledata));
			}
		}, error => {
		  if (error.status === 404)
			swal.fire('E-Mail ID does not exists,please signup to continue');
		  else if (error.status === 403)
			swal.fire('Account Disabled,contact Dental-Live');
		  else if (error.status === 400)
			swal.fire('Wrong Password,please try again');
		  else if (error.status === 401)
			swal.fire('Account Not Verified,Please activate the account from the Email sent to the Email address.');
		  else if (error.status === 428)
			swal.fire(error.error);
		  else
			swal.fire('Unable to fetch the data, please try again');
		});
	}
	
	deleteFile(fileUploadId: any) {
		let url = this.utility.apiData.userCaseFiles.ApiUrl;
		this.dataService.deleteFilesData(url, fileUploadId).subscribe(Response => {
			swal.fire("Case Files deleted successfully");
		}, (error) => {
		  swal.fire("Unable to fetch data, please try again");
		  return false;
		});
		this.router.navigate(['files/files']);
	}
	
	downloadImg(url: any, name: any) {
    let imageUrl = url;
    this.getBase64ImageFromURL(imageUrl).subscribe((base64data: any) => {
      //console.log(base64data);
      this.base64Image = 'data:image/jpg;base64,' + base64data;
      // save image to disk
      var link = document.createElement('a');

      document.body.appendChild(link); // for Firefox

      link.setAttribute('href', this.base64Image);
      link.setAttribute('download', name);
      link.click();
    });
  }

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      const img: HTMLImageElement = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const dataURL: string = canvas.toDataURL('image/png');

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }
}
