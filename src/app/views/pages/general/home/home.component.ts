import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgwWowService } from 'ngx-wow';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	contentSlider: OwlOptions = {
		items:1,
		loop:true,
		margin:10,
		autoplay:true,
		autoplayHoverPause:true,
		dots: true,
		animateIn: 'fadeIn',
		animateOut: 'fadeOut',
		smartSpeed:550,
		nav: false
	}
	
	reviewsSlider: OwlOptions = {
		items:1,
		loop:true,
		margin:10,
		autoplay:true,
		autoplayTimeout:2000,
		autoplayHoverPause:true,
		dots: false,
		navText: ['<i class="bx bx-chevron-left"></i>', '<i class="bx bx-chevron-right"></i>'],
		responsive:{
		  0:{
			  items:2
		  },
		  600:{
			  items:3
		  },
		  1000:{
			  items:4
		  }
		},
		nav: true
	}
	  
  constructor(private wowService: NgwWowService) { 
	this.wowService.init();
  }

  ngOnInit(): void {
  }

}
