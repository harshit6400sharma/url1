import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../services/common.service';
import * as moment from 'moment';
import { constant } from '../constant';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
//import Utils from '../utils';

declare var $: any;

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.css']
})
export class TravelComponent implements OnInit {

  travelData: any = {
    status: 1,
    travel_type: "travel_insurance",
  };
  modalRef: BsModalRef;
  @ViewChild('successmodal', { static: true }) successmodal: BsModalRef
  getQuoteBtn = false;
  minDate: Date;
  isOpen = false;
  f: string;
  base_url: string;
  //util = new Utils;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private ngxLoader: NgxUiLoaderService
  ) { }

  ngOnInit() {
    $("html, body").animate({ scrollTop: 0 }, 600);
    this.base_url = environment.api_endpoint;
    this.f = this.route.snapshot.url[0].path;
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
  }

  travelSubmit() {
    var regex = constant.emailvalidateregex;
    var mobilevalidateregex = constant.mobilevalidateregex;
    if (!this.travelData.travel_user_name) {
      this.toastr.error("Please enter your name", "Error");
    } else if (!this.travelData.travel_user_email) {
      this.toastr.error("Please enter your valid email", "Error");
    } else if (!regex.test(this.travelData.travel_user_email)) {
      this.toastr.error("Please enter a valid email address", "Error");
    } else if (!mobilevalidateregex.test(this.travelData.travel_user_mobile)) {
      this.toastr.error("Please enter your valid mobile number", "Error");
    } else if (!this.travelData.start_date) {
      this.toastr.error("Please enter your journey date", "Error");
    } else {
      this.getQuoteBtn = true;
      this.travelData.journy_start_date = moment(this.travelData.start_date).format("YYYY-MM-DD");
      delete this.travelData.start_date;
      const url = `/insuranceRoute/addtravelinsurance/`;
      this.commonService.post(url, this.travelData).subscribe(res => {
        console.log(res)
        this.modalRef = this.modalService.show(this.successmodal, { class: 'common-popup' });
        //this.util.successDialog("Thank You Showing Interest.We Will get Back To You Soon","Success");
        this.getQuoteBtn = false;
        this.travelData.travel_user_name = '';
        this.travelData.travel_user_email = '';
        this.travelData.travel_user_mobile = '';
        this.travelData.journy_start_date = '';
      }, err => {
        this.getQuoteBtn = false;
        const errorMessage = err && err.message || 'Something goes wrong';
        this.toastr.error(errorMessage, 'Error');
      })
    }
  }

}
