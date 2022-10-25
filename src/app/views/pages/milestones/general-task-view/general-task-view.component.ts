//@ts-nocheck
import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-general-task-view',
  templateUrl: './general-task-view.component.html',
  styleUrls: ['./general-task-view.component.css']
})
export class GeneralTaskViewComponent implements OnInit {

	defaultBindingsList = [
        { value: 1, label: 'Jhone Duo' },
        { value: 2, label: 'Danel Gray' },
        { value: 3, label: 'Pavilnys' }
    ];
	selectedMember: any ;
	gettaskId: any;
	 constructor(private location: Location, private dataService: ApiDataService, private router: Router, private utility: UtilityService, private utilitydev: UtilityServicedev, private usr: AccdetailsService, private route: ActivatedRoute) {
		this.gettaskId = this.route.snapshot.paramMap.get('taskId');
	}

	back(): void {
		this.location.back()
	}
	
	editdata:any;
	tabledata:any;
	public module = 'patient';
	cvfastText: boolean = false;
	cvfastLinks: boolean = false;
	public attachmentFiles: any[] = []
	public casefilesArray: any[] = []
	
	ngOnInit(): void {
		this.selectedMember = this.defaultBindingsList[0];
		this.getEditTasks();
	}
	
	getCaseDetails(caseId) {
		this.tabledata = '';
		let url = this.utility.apiData.userCases.ApiUrl;
		if(caseId != '')
		{
			url += "?caseId="+caseId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.tabledata = JSON.parse(Response.toString());
			}
		}, error => {
			if (error.status === 404)
			swal('No task found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Duplicate data entered');
			else if (error.status === 405)
			swal({
			text: 'Due to dependency data unable to complete operation'
			}).then(function() {
			window.location.reload();
			});
			else if (error.status === 500)
			swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
			else
			swal('Oops something went wrong, please try again');
		});
	}
	
	getEditTasks() {
		let url = this.utility.apiData.userTasks.ApiUrl;
		let taskId = this.gettaskId;
		if(taskId != '')
		{
			url += "?taskId="+taskId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.editdata = JSON.parse(Response.toString());
				this.getCaseDetails(this.editdata.caseId);
				this.setcvFast(this.editdata.description);
				this.cvfastText = true;
			}
		}, error => {
			if (error.status === 404)
			swal('No task found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Duplicate data entered');
			else if (error.status === 405)
			swal({
			text: 'Due to dependency data unable to complete operation'
			}).then(function() {
			window.location.reload();
			});
			else if (error.status === 500)
			swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
			else
			swal('Oops something went wrong, please try again');
		});
	}
	
	setcvFast(obj: any, page = 'task')
	{
		if(page == 'task')
		{
			this.attachmentFiles = Array();
			if(obj.links.length > 0)
			{
				this.cvfastLinks = true;
				for(var i = 0; i < obj.links.length; i++)
				{
					
					let ImageName = obj.links[i];
					let url = 'https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name='+obj.links[i]+'&module='+this.module+'&type=get';
					this.dataService.getallData(url, true)
					.subscribe(Response => {
						if (Response)
						{
							this.attachmentFiles.push({ imgName: ImageName, ImageUrl: Response });
						}
					}, error => {
						if (error.status === 404)
						swal('No task found');
						else if (error.status === 403)
						swal('You are unauthorized to access the data');
						else if (error.status === 400)
						swal('Invalid data provided, please try again');
						else if (error.status === 401)
						swal('You are unauthorized to access the page');
						else if (error.status === 409)
						swal('Duplicate data entered');
						else if (error.status === 405)
						swal({
						text: 'Due to dependency data unable to complete operation'
						}).then(function() {
						window.location.reload();
						});
						else if (error.status === 500)
						swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
						else
						swal('Oops something went wrong, please try again');
					});
				}
			}
		}
		else
		{
			if(obj.length > 0)
			{
				for(var i = 0; i < obj.length; i++)
				{
					
					let ImageName = obj[i].files[0].name;
					let url = 'https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name='+ImageName+'&module='+this.module+'&type=get';
					this.dataService.getallData(url, true)
					.subscribe(Response => {
						if (Response)
						{
							this.casefilesArray[i-1].files[0].url = Response;
						}
					}, error => {
						if (error.status === 404)
						swal('No task found');
						else if (error.status === 403)
						swal('You are unauthorized to access the data');
						else if (error.status === 400)
						swal('Invalid data provided, please try again');
						else if (error.status === 401)
						swal('You are unauthorized to access the page');
						else if (error.status === 409)
						swal('Duplicate data entered');
						else if (error.status === 405)
						swal({
						text: 'Due to dependency data unable to complete operation'
						}).then(function() {
						window.location.reload();
						});
						else if (error.status === 500)
						swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
						else
						swal('Oops something went wrong, please try again');
					});
				}
				this.editdata = this.casefilesArray;
			}
		}
	}
	@ViewChild('videoPlayer') videoplayer: ElementRef;

	video() {
		this.videoplayer?.nativeElement.play();
	}
	
	removeHTML(str){ 
		if((str != '') && (str != 'undefined') && (str != undefined))
		{
			var tmp = document.createElement("DIV");
			tmp.innerHTML = str;
			return tmp.textContent || tmp.innerText || "";
		}
		else
		{
			return "";
		}
	}
	
	getFileName(fileName) {
		if (fileName.indexOf('__-__') == -1) return fileName
		let name = fileName.split(".");
		return fileName.substring(0, fileName.indexOf('__-__')) + "." + name[name.length - 1]
	}
}