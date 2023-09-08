import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { constant } from '../constant';
import { CommonService } from '../services/common.service';
import Utils from '../utils';

declare var $:any;

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css']
})
export class TermComponent implements OnInit {

  term: any = {
    status: 1,
    term_type: "life_insurance",
  };
  getQuoteBtn = false;
  f: string;
  base_url: string;
  util = new Utils;

  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private ngxLoader: NgxUiLoaderService,
  ) { }


  ngOnInit() {
    $("html, body").animate({ scrollTop: 0 }, 600);
    this.base_url = environment.api_endpoint;
    this.f = this.route.snapshot.url[0].path;
  }

  submit() {
    var regex = constant.emailvalidateregex;
    var mobilevalidateregex = constant.mobilevalidateregex;
    if (!this.term.term_user_name) {
      this.toastr.error("Please enter your name", "Error");
    } else if (!this.term.term_user_email) {
      this.toastr.error("Please enter your valid email", "Error");
    } else if (!regex.test(this.term.term_user_email)) {
      this.toastr.error("Please enter a valid email address", "Error");
    } else if (!mobilevalidateregex.test(this.term.term_user_mobile)) {
      this.toastr.error("Please enter your valid mobile number", "Error");
    } else if (!this.term.term_user_annual_income) {
      this.toastr.error("Please enter your annual income", "Error");
    } else if (!this.term.pin_code) {
      this.toastr.error("Please enter your pincode", "Error");
    } else {
      this.getQuoteBtn = true;
      console.log(this.term);
      const url = `/insuranceRoute/addterminsurance/`;
      this.commonService.post(url, this.term).subscribe(res => {
        console.log(res)
        this.getQuoteBtn = false;
        this.term.term_user_name = '';
        this.term.term_user_email = '';
        this.term.term_user_mobile = '';
        this.term.term_user_annual_income = '';
        this.term.pin_code = '';
        this.util.successDialog("Thank You Showing Interest.We Will get Back To You Soon","Success");
        //this.toastr.success("Added successfully", "Success");
      }, err => {
        this.getQuoteBtn = false;
        const errorMessage = err && err.message || 'Something goes wrong';
        this.toastr.error(errorMessage, 'Error');
      })
    }
  }

}
