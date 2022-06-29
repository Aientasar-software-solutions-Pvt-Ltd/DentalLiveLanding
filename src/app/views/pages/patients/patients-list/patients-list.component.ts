import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit {

  masterSelected:boolean;
  tabledata:any;
  checkedList:any;
  
	id:any = "myPatients";
	tabContent(ids:any){
		this.id = ids;
	}
	
	dtOptions: DataTables.Settings = {};
  constructor() { 
	this.masterSelected = false;
	this.tabledata = [
        {id:1,name: 'Ajay', email: 'therichpost@gmail.com', website:'therichpost.com', date:'2021-07-20',isSelected:false},
        {id:2,name: 'Jas', email: 'therichpost@gmail.com', website:'therichpost.com', date:'2021-07-17',isSelected:false},
        {id:3,name: 'therichpost', email: 'therichpost@gmail.com', website:'therichpost.com', date:'2021-07-17',isSelected:false},
        {id:4,name: 'therichpost', email: 'therichpost@gmail.com', website:'therichpost.com', date:'2021-07-17',isSelected:false},
        {id:5,name: 'Jas', email: 'therichpost@gmail.com', website:'therichpost.com', date:'2021-07-14',isSelected:false},
        {id:6,name: 'therichpost', email: 'therichpost@gmail.com', website:'therichpost.com', date:'2021-07-13',isSelected:false},
        {id:7,name: 'therichpost', email: 'therichpost@gmail.com', website:'therichpost.com', date:'2021-07-13',isSelected:false},
        {id:8,name: 'Jas', email: 'therichpost@gmail.com', website:'therichpost.com', date:'2021-07-11',isSelected:false},
        {id:9,name: 'therichpost', email: 'therichpost@gmail.com', website:'therichpost.com', date:'2021-07-09',isSelected:false},
        {id:10,name: 'therichpost', email: 'therichpost@gmail.com', website:'therichpost.com', date:'2021-07-01',isSelected:false},
    ];
      /*this.checklist = [
        {id:1,value:'Elenor Anderson',isSelected:false},
        {id:2,value:'Caden Kunze',isSelected:true},
        {id:3,value:'Ms. Hortense Zulauf',isSelected:true},
        {id:4,value:'Grady Reichert',isSelected:false},
        {id:5,value:'Dejon Olson',isSelected:false},
        {id:6,value:'Jamir Pfannerstill',isSelected:false},
        {id:7,value:'Aracely Renner DVM',isSelected:false},
        {id:8,value:'Genoveva Luettgen',isSelected:false}
      ];*/
     // this.getCheckedItemList();
  }

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
      },
	  /*columnDefs: [
            { orderable: false, targets: 0 },
            { orderable: false, targets: 5 },
        ]*/
    };
	/*$('.searchdata').on( 'keyup', function (ret :any) {
        var v = ret.target.value;  // getting search input value
        $('#dataTables').DataTable().search(v).draw();
    });*/
  }
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}
	
	
  // The master checkbox will check/ uncheck all items
  checkUncheckAll() {
    for (var i = 0; i < this.tabledata.length; i++) {
      this.tabledata[i].isSelected = this.masterSelected;
    }
    //this.getCheckedItemList();
  }

  // Check All Checkbox Checked
  isAllSelected() {
    this.masterSelected = this.tabledata.every(function(item:any) {
        return item.isSelected == true;
      })
    //this.getCheckedItemList();
  }

  // Get List of Checked Items
  /*getCheckedItemList(){
    this.checkedList = [];
    for (var i = 0; i < this.checklist.length; i++) {
      if(this.checklist[i].isSelected)
      this.checkedList.push(this.checklist[i]);
    }
    this.checkedList = JSON.stringify(this.checkedList);
  }*/

}
