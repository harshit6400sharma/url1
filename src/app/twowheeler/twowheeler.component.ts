import { Component, OnInit,TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { constant } from '../constant';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../services/common.service';

//import Utils from '../utils';

declare var $: any;

@Component({
  selector: 'app-twowheeler',
  templateUrl: './twowheeler.component.html',
  styleUrls: ['./twowheeler.component.css']
  
})
export class TwowheelerComponent implements OnInit {

  motor: any = {
    status: 1,
    pincode:700099,
    motor_type: "two_wheelar"
  };
  public first:boolean = true;
  public second:boolean = false;

  getQuoteBtn = false;
  isOpen = false;
  f: string;
  testimonals = [];
  base_url: string;
  modalRef: BsModalRef;
  @ViewChild('successmodal', { static: true }) successmodal: BsModalRef

  //util = new Utils;

  constructor(
    private route: ActivatedRoute,
    private ngxLoader: NgxUiLoaderService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private router: Router,
    
  ) { }

  ngOnInit() {
    $("html, body").animate({ scrollTop: 0 }, 600);
    this.base_url = environment.api_endpoint;
    this.f = this.route.snapshot.url[0].path;
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


      this.first=false;
      this.second=true;


      // this.getQuoteBtn = true;
      // const url = `/insuranceRoute/addmotorinsurance/`;
      // this.motor.policy_expiry_date = moment(this.motor.expiry_date).format("YYYY-MM-DD");
      // delete this.motor.expiry_date;
      // this.commonService.post(url, this.motor).subscribe(res => {
      //   console.log(res)
      //   this.getQuoteBtn = false;
      //   this.motor.motor_user_name = '';
      //   this.motor.motor_user_email = '';
      //   this.motor.motor_user_mobile = '';
      //   this.modalRef = this.modalService.show(this.successmodal, { class: 'common-popup' });
      //   //this.util.successDialog("Thank You Showing Interest.We Will get Back To You Soon","Success");
      // }, err => {
      //   this.getQuoteBtn = false;
      //   const errorMessage = err && err.message || 'Something goes wrong';
      //   this.toastr.error(errorMessage, 'Error');
      // })
    }
  }



  submit1() {

  var apiUrl = 'https://ilesb01.insurancearticlez.com/ilservices/motor/v1/proposal/twowheelercalculatepremium/'; // Replace with your API URL

    console.log("pppp");
    console.log(JSON.stringify(this.motor));

  var dataToSend = {
    "BusinessType": "New Business",
    "Dealid": "DL-3005/1485414",
    "DeliveryOrRegistrationDate": "2018-09-24",
    "FirstRegistrationDate": "2018-09-24",
    "PolicyStartDate": "2018-09-25",
    "PolicyEndDate": "2019-09-24",
    "Manufacturingyear": "2018",
    "VehicleModelCode": "380",
    "RTOLocationCode": "192",
    "Tenure": "1",
    "TPTenure": "5",
    "ExShowRoomPrice": "73689",
    "VehiclemakeCode": "31",
    "GSTToState": "MAHARASHTRA",
    "CustomerType": "INeIVIeUAL",
    "Correlationid": "d2a873bd-ca6b-423b-859f-ae5597468176"
    // Add more properties as needed
  };

console.log("00099999");
  this.commonService.post(apiUrl, dataToSend).subscribe(res => {
    console.log(res)
    this.router.navigate(['/two-wheeler-proposal']); // Replace 'new-page' with the actual route path
    //this.util.successDialog("Thank You Showing Interest.We Will get Back To You Soon","Success");
  }, err => {
    console.log("00000");
    this.router.navigate(['/two-wheeler-proposal']); // Replace 'new-page' with the actual route path
  });
   // this.router.navigate(['/two-wheeler-proposal']); // Replace 'new-page' with the actual route path

  }







}
