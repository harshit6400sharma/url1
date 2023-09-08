import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

declare var $:any;

@Component({
  selector: 'app-legal-and-admin-policies',
  templateUrl: './legal-and-admin-policies.component.html',
  styleUrls: ['./legal-and-admin-policies.component.css']
})
export class LegalAndAdminPoliciesComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit() {

    $('.carousel-leaders').owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      autoplay: true,
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
    $('.carousel-directors').owlCarousel({
      loop: true,
      autoplay: true,
      margin: 10,
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
    $('.carousel-awards').owlCarousel({
      loop: true,
      margin: 20,
      autoplay: true,
      nav: true,
      dots: false,
      responsive: {
        0: {
          items: 2
        },
        600: {
          items: 2
        },
        1000: {
          items: 4
        }
      }
    })
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

    $("html, body").animate({ scrollTop: 0 }, 600);
  }

}
