import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { constant } from '../constant';
import { CommonService } from '../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {

  private purchaseToken: string;
  private referenceId: string;
  policyNo: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['purchaseToken']) {
        this.purchaseToken = params['purchaseToken'];
      } else {
        this.router.navigate([`not-found`]);
      }
    });
  }

  checkPurchaseStatus() {
    this.policyNo = '...';
    this.ngxLoader.start();
    const url = `${constant.star_endpoint}/api/policy/proposals/${this.purchaseToken}/purchase/response`;
    const body = {
      "APIKEY": constant.APIKEY,
      "SECRETKEY": constant.SECRETKEY,
      "purchaseToken": this.purchaseToken
    }
    this.commonService.postdirect(url, body).subscribe(res => {
      console.log("Purchase Status Success : ", res)
      if (res.status === 'SUCCESS') {
        this.referenceId = res.referenceId;
        this.toastr.error("Payment Successfull!", "Success");
        this.checkPolicyStatus();
      } else {
        alert("Payment Failed!")
      }
    }, err => {
      this.ngxLoader.stop();
      console.log("Purchase Status Error : ", err)
      this.toastr.error("Something went wront while creating proposal", "Error");
    })
  }

  checkPolicyStatus() {
    const URL = `api/policy/proposals/${this.referenceId}/policystatus`;
    const body = {
      "APIKEY": constant.APIKEY,
      "SECRETKEY": constant.SECRETKEY,
      "referenceId": this.referenceId
    }
    this.commonService.postdirect(URL, body).subscribe(res => {
      this.ngxLoader.stop();
      console.log("Policy Status : ", res)
      this.toastr.success("Policy Created Successfully!", "Success");
      this.policyNo = res.Policy_Number;
    }, err => {
      console.log("Purchase Status Error : ", err)
      this.toastr.error("Payment Unsuccessfull", "Error");
    })

  }

  downloadPDF(){

  }

}
