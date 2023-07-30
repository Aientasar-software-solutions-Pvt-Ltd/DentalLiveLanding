import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccdetailsService } from '../../pages/accdetails.service';
import { fromEvent } from 'rxjs';
import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { CrudOperationsService } from 'src/app/crud-operations.service';
import Swal from 'sweetalert';
import { ApiDataService } from '../../pages/users/api-data.service';
import { UtilityService } from '../../pages/users/utility.service';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-base',
	templateUrl: './base.component.html',
	styleUrls: ['./base.component.css'],
	providers: [CrudOperationsService]
})
export class BaseComponent implements OnInit, AfterViewInit {

	isOpen = true;
	infoModal = null;

	constructor(private utilityOld: UtilityService, private dataService: ApiDataService, private router: Router, private usr: AccdetailsService, public utility: UtilityServiceV2, public CrudOperationsService: CrudOperationsService) {
		document.body.style.backgroundColor = "#F7F9FB";
		window.addEventListener('focus', event => {
			if (!this.usr.getUserDetails())
				this.router.navigate(['/auth/login']);
		});
	}
	ngAfterViewInit(): void {
		//@ts-ignore
		this.infoModal = new bootstrap.Modal(document.getElementById('infoModal'));
		let usr = this.usr.getUserDetails();

		if (!usr?.infoModalsArray || !usr?.infoModalsArray?.includes("1"))
			this.infoModal.show()
	}

	updateUserState() {
		//post request here,both add & update are sent as post
		let usr = this.usr.getUserDetails();
		usr.isModal = true;
		usr.infoModalsArray = ["1"]
		//as more info modals are added,we give a number to every info modal,if the info modal no exists then dont show or else show
		this.dataService.putData(this.utilityOld.apiData.userAccounts.ApiUrl, JSON.stringify(usr)).subscribe((Response) => {
			delete usr.isModal;
			let encrypt = CryptoJS.AES.encrypt(JSON.stringify(usr), environment.decryptKey).toString();
			sessionStorage.setItem('usr', encrypt);
		})
	}

	ngOnInit() {
		this.subscribeToNativeNavigation();
		this.utility.processingBackgroundData = [];
	}

	private subscribeToNativeNavigation() {
		fromEvent(window, 'beforeunload')
			.subscribe((e) => {
				if (this.utility.processingBackgroundData.length != 0) {
					if (this.utility.processingBackgroundData.some(el => (!el.isProcessed || el.isProcessed == false))) {
						const message = 'You may lose your data if you refresh now';
						(e || window.event).returnValue = !!message;
						return message;
					}
				}
				return true
			})
	}

	processBackgroundAgain(task) {
		if (task.id) {
			this.utility.processingBackgroundData = this.utility.processingBackgroundData.map((item) => {
				if (item.id != task.id) return item;
				return {
					...item, isFailed: false, isProcessed: false
				}
			})
		}
		if (task.module == 'mail') {
			task.currentState.saveFiles(task.currentState, task.id)
		} else
			this.CrudOperationsService.backgroundProcessData(task.cvfast, task.object, task.section, task.isEditMode, task.id)
	}

	clearTask(task) {
		if (task.id)
			this.utility.processingBackgroundData.splice(this.utility.processingBackgroundData.findIndex(item => item.id == task.id), 1)
		console.log(this.utility.processingBackgroundData);
	}

	showError(error) {
		(error['status']) ? this.utility.showError(error['status']) : Swal("Failed to Process files,please try again");
	}

}
