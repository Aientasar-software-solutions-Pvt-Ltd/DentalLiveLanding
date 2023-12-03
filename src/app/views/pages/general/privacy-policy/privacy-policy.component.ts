//@ts-nocheck
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css'],
})
export class PrivacyPolicyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $(function () {
      new WOW().init();
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

    });
    $(function () {
      $(window).on("scroll", function () {
        var scrolled = $(window).scrollTop();
        if (scrolled > 600) $(".go-top").addClass("active");
        if (scrolled < 600) $(".go-top").removeClass("active");
      });
      $(".go-top").on("click", function () {
        $("html, body").animate({ scrollTop: "0" }, 500);
      });
    });
  }
}
