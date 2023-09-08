import { Component, OnInit,TemplateRef  } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { constant } from '../constant';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

declare var $:any;

@Component({
  selector: 'app-satisfied-client',
  templateUrl: './satisfied-client.component.html',
  styleUrls: ['./satisfied-client.component.css']
})
export class SatisfiedClientComponent implements OnInit {

  modalRef: BsModalRef;
  testimonals = [];
  base_url: string;
  review_length = 63;
  reviewdetail:any = {}

  constructor(
    private modalService: BsModalService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService
  ) { }


  ngOnInit() {
    this.base_url = constant.api_endpoint;
    this.getTestimonials()
  }

  getTestimonials() {
    this.ngxLoader.start();
    const url = `/testimonialRoute/list/1/0/1/?search_key=`;
    this.commonService.get(url).subscribe(res => {
      console.log(res)
      this.ngxLoader.stop()
      this.testimonals = res.data.map(el => {
        let fileno = el.files.length - 1;
        let filepath = (el.files[fileno])?el.files[fileno]['file_path']:'';
        return {
          customer_name: el.customer_name,
          review: el.review,
          reviewlength:el.review.length,
          file_path: this.base_url + '/' + filepath
        }
      });
      setTimeout(() => {
        //----- Owl Carousel for satisfied client---------
        $('.owl-carousel').owlCarousel({
          loop: true,
          margin: 10,
          nav: false,
          dots: true,
          autoplay: true,
          responsive: {
            0: {
              items: 1
            },
            600: {
              items: 2
            },
            1000: {
              items: 3
            }
          }
        })
        // ------Owl carousel-----------
      }, 100);

    }, err => {
      this.ngxLoader.stop()
      const errorMessage = err && err.message || 'Something goes wrong';
      this.toastr.error(errorMessage, 'Error');
    })
  }

  openModal(template: TemplateRef<any>,review) {
    this.reviewdetail = review;
    this.modalRef = this.modalService.show(template,{ class: 'modal-md common-popup' });
  }

}
