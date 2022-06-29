import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert';

@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.css']
})
export class ValidateComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }
  user: string;
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.get('mail') && params.get('mail') != "") {
        this.user = params.get('mail');
      }
    });
  }

  resend() {
    //resend email api call with succes
    if (true) {
      swal("E-mail has been resent successfully");
    }
  }

}
