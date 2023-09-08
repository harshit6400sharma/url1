import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from '../services/common.service';
import * as moment from 'moment';
import { constant } from '../constant';
//import Utils from '../utils';

declare var $: any;

@Component({
  selector: 'app-commercial',
  templateUrl: './commercial.component.html',
  styleUrls: ['./commercial.component.css']
})
export class CommercialComponent implements OnInit {

  motor: any = {
    status: 1,
    motor_type: "commercial"
  };
  getQuoteBtn = false;
  minDate: Date;
  isOpen = false;
  modalRef: BsModalRef;
  @ViewChild('successmodal', { static: true }) successmodal: BsModalRef
  //util = new Utils;

  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    $("html, body").animate({ scrollTop: 0 }, 600);
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
        this.modalRef = this.modalService.show(this.successmodal, { class: 'common-popup' });
        //this.util.successDialog("Thank You Showing Interest.We Will get Back To You Soon","Success");
      }, err => {
        this.getQuoteBtn = false;
        const errorMessage = err && err.message || 'Something goes wrong';
        this.toastr.error(errorMessage, 'Error');
      })
    }
  }

}
