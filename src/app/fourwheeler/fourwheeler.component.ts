import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { constant } from '../constant';
import { CommonService } from '../services/common.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute } from '@angular/router';
//import Utils from '../utils';
declare var $: any;

@Component({
  selector: 'app-fourwheeler',
  templateUrl: './fourwheeler.component.html',
  styleUrls: ['./fourwheeler.component.css']
})
export class FourwheelerComponent implements OnInit {

  motor: any = {
    status: 1,
    motor_type: "four_wheelar"
  };
  getQuoteBtn = false;
  minDate: Date;
  isOpen = false;
  f: string;
  base_url: string;
  modalRef: BsModalRef;
  @ViewChild('successmodal', { static: true }) successmodal: BsModalRef
  //util = new Utils;

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    $("html, body").animate({ scrollTop: 0 }, 600);
    this.base_url = environment.api_endpoint;
    this.f = this.route.snapshot.url[0].path;
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
  }

  submit() {
    var regex = constant.emailvalidateregex;
    var mobilevalidateregex = constant.mobilevalidateregex;
    if (!this.motor.motor_user_name) {
      this.toastr.error("Please enter your name", "Error");
    } else if (!this.motor.motor_user_email) {
      this.toastr.error("Please enter your valid email", "Error");
    } else if (!regex.test(this.motor.motor_user_email)) {
      this.toastr.error("Please enter a valid email address", "Error");
    } else if (!mobilevalidateregex.test(this.motor.motor_user_mobile)) {
      this.toastr.error("Please enter your valid mobile number", "Error");
    } else if (!this.motor.expiry_date) {
      this.toastr.error("Please enter policy exiry date", "Error");
    } else {
      this.getQuoteBtn = true;
      const url = `/insuranceRoute/addmotorinsurance/`;
      this.motor.policy_expiry_date = moment(this.motor.expiry_date).format("YYYY-MM-DD");
      delete this.motor.expiry_date;
      this.commonService.post(url, this.motor).subscribe(res => {
        console.log(res)
        this.getQuoteBtn = false;
        this.motor.motor_user_name = '';
        this.motor.motor_user_email = '';
        this.motor.motor_user_mobile = '';
        //this.util.successDialog("Thank You Showing Interest.We Will get Back To You Soon","Success");
        this.modalRef = this.modalService.show(this.successmodal, { class: 'common-popup' });
      }, err => {
        this.getQuoteBtn = false;
        const errorMessage = err && err.message || 'Something goes wrong';
        this.toastr.error(errorMessage, 'Error');
      })
    }
  }

}
