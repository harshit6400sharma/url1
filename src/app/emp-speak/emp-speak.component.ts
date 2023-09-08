import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-emp-speak',
  templateUrl: './emp-speak.component.html',
  styleUrls: ['./emp-speak.component.css']
})
export class EmpSpeakComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('.carousel-speak').owlCarousel({
      loop: true,
      margin: 20,
      autoplay: true,
      nav: true,
      dots: false,
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 1
        },
        1000: {
          items: 2
        }
      }
    })
  }

}
