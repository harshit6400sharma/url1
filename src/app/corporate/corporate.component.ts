import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';
//import Utils from '../utils';
declare var $: any;
@Component({
  selector: 'app-corporate',
  templateUrl: './corporate.component.html',
  styleUrls: ['./corporate.component.css']
})
export class CorporateComponent implements OnInit {

  corpData: any = {
    status: 1,
    corporate_ins_type: ''
  };
  modalRef: BsModalRef;
  @ViewChild('successmodal', { static: true }) successmodal: BsModalRef
  getQuoteBtn = false;
  minDate: Date;
  isOpen = false;
  f: string;
  testimonals = [];
  base_url: string;
  //util = new Utils;

  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private ngxLoader: NgxUiLoaderService,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    $("html, body").animate({ scrollTop: 0 }, 600);
    this.base_url = environment.api_endpoint;
    this.f = this.route.snapshot.url[0].path;
  }

  submit() {
    var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var mobilevalidateregex = /^\d{10}$/;
    if (!this.corpData.corporate_user_name) {
      this.toastr.error("Please enter your name", "Error");
    } else if (!this.corpData.corporate_user_email) {
      this.toastr.error("Please enter your valid email", "Error");
    } else if (!regex.test(this.corpData.corporate_user_email)) {
      this.toastr.error("Please enter a valid email address", "Error");
    } else if (!mobilevalidateregex.test(this.corpData.corporate_user_mobile)) {
      this.toastr.error("Please enter your valid mobile number", "Error");
    } else if (!this.corpData.corporate_ins_type) {
      this.toastr.error("Please select corporate insurance type", "Error");
    } else {
      this.getQuoteBtn = true;
      const url = `/insuranceRoute/addcorporateinsurance/`;
      this.commonService.post(url, this.corpData).subscribe(res => {
        console.log(res)
        this.getQuoteBtn = false;
        this.corpData.corporate_user_name = '';
        this.corpData.corporate_user_email = '';
        this.corpData.corporate_user_mobile = '';
        this.corpData.corporate_ins_type = '';
        this.modalRef = this.modalService.show(this.successmodal, { class: 'common-popup' });
        //this.util.successDialog("Thank You Showing Interest.We Will get Back To You Soon", "Success");
      }, err => {
        this.getQuoteBtn = false;
        const errorMessage = err && err.message || 'Something goes wrong';
        this.toastr.error(errorMessage, 'Error');
      })
    }
  }

}
