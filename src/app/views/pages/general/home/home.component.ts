
//@ts-nocheck
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
	constructor() { }


	ngOnInit(): void {

		new WOW().init();

		$(window).on("scroll", function () {
			var scrolled = $(window).scrollTop();
			if (scrolled > 600) $(".go-top").addClass("active");
			if (scrolled < 600) $(".go-top").removeClass("active");
		});
		$(".go-top").on("click", function () {
			$("html, body").animate({ scrollTop: "0" }, 500);
		});

		$(document).ready(function () {
			$("#content-slider").owlCarousel({
				items: 1,
				loop: true,
				margin: 10,
				autoplay: true,
				autoplayHoverPause: true,
				dots: true,
				animateIn: 'fadeIn',
				animateOut: 'fadeOut',
				smartSpeed: 550,
				nav: false
			});
			$('.toggle-view-planner').click(function () {
				$(this).closest('.dentallive-pmt-img').find('.dtplanner').css('display', 'block');
			});
			$('[href="#DentalPlanner"]').click(function () {
				$(this).parent().closest('.dtplanner').css('display', 'none');
			});
			$('.toggle-view-talk').click(function () {
				$(this).closest('.dentallive-pmt-img').find('.dttalk').css('display', 'block');
			});
			$('[href="#DentalTalk"]').click(function () {
				$(this).parent().closest('.dttalk').css('display', 'none');
			});
			$('.toggle-view-mail').click(function () {
				$(this).closest('.dentallive-pmt-img').find('.dtmail').css('display', 'block');
			});
			$('[href="#DentalMail"]').click(function () {
				$(this).parent().closest('.dtmail').css('display', 'none');
			});
			$('[href="#Products"]').click(function () {
				$(this).parent().closest('.dtmail').css('display', 'none');
			});
			$('.x-close').click(function () {
				$(this).parent().closest('.dtplanner').css('display', 'none');
				$(this).parent().closest('.dttalk').css('display', 'none');
				$(this).parent().closest('.dtmail').css('display', 'none');
			});
		});

	}
}
