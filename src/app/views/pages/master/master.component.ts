import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular'; 

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit {
	calendarOptions: CalendarOptions = {
		initialView: 'dayGridMonth',
		themeSystem: 'bootstrap5',
		headerToolbar:{
		  left: "prev,next today",
		  center: "title",
		  right: "dayGridMonth,timeGridWeek,listMonth"
		},
		dayMaxEvents: true,
		displayEventEnd:true,
		events: [
		  {
			title: 'All Day Event',
			start: '2022-04-01',
		  },
		  {
			title: 'Long Event',
			start: '2022-04-07',
			end: '2022-04-10'
		  },
		  {
			title: 'Conference',
			start: '2022-04-11',
			end: '2022-04-13'
		  },
		  {
			title: 'Meeting',
			start: '2022-04-12T10:30:00',
			end: '2022-04-12T12:30:00'
		  },
		  {
			title: 'Lunch',
			start: '2022-04-12T12:00:00'
		  },
		  {
			title: 'Meeting',
			start: '2022-04-12T14:30:00'
		  },
		  {
			title: 'Happy Hour',
			start: '2022-04-12T17:30:00'
		  },
		  {
			title: 'Dinner',
			start: '2022-04-12T20:00:00'
		  },
		  {
			title: 'Birthday Party',
			start: '2022-04-13T07:00:00'
		  },
		  {
			title: 'Click for Google',
			url: 'http://google.com/',
			start: '2022-04-28'
		  }
		]
	};
	
	show = false;
	show1 = false;
	show2 = false;
	show3 = false;
	show4 = false;
	show5 = false;
	show6 = false;
	show7 = false;
	show8 = false;
 
	id:any = "listView";
	tabContent(ids:any){
		this.id = ids;
	}
	tab:any = "tab1";
	tabClick(tabs:any){
		this.tab = tabs;
	}
	
	saveCompletedArchive: boolean = false;

	onCompletedArchiveChanged(value:boolean){
		this.saveCompletedArchive = value;
	}
	
 dtOptions: DataTables.Settings = {};
  constructor() { }

  ngOnInit(): void {
    this.dtOptions = {
	  dom: '<"datatable-top"f>rt<"datatable-bottom"lip><"clear">',
      pagingType: 'full_numbers',
	  pageLength: 10,
      processing: true,
	  responsive: true,
	  language: {
          search: " <div class='search'><i class='bx bx-search'></i> _INPUT_</div>",
		  lengthMenu: "Items per page _MENU_",
          info: "_START_ - _END_ of _TOTAL_",
		  paginate: {
			first : "<i class='bx bx-first-page'></i>",
			previous: "<i class='bx bx-chevron-left'></i>",
			next: "<i class='bx bx-chevron-right'></i>",
			last : "<i class='bx bx-last-page'></i>"
			},
      }
    };
	
  }
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}

}
