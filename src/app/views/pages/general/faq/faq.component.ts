import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
	currentYear: number = new Date().getFullYear();
  constructor() { }

  ngOnInit(): void {
  }

}
