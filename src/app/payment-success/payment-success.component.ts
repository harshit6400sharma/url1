import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { constant } from '../constant';
import { CommonService } from '../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Utils from '../utils';

declare var require: any
const FileSaver = require('file-saver');

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {

  purchaseToken: string;
  referenceId: string;
  policyRes: any = {}
  util = new Utils;
  dwnloadBtn = false;
  dwnloadBtnText = 'Donwload Policy PDF';
  plandetail: any = {}

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
        this.checkPurchaseStatus()
      } else {
        this.router.navigate([`not-found`]);
      }
    });
  }

  checkPurchaseStatus() {
    this.ngxLoader.start();
    const url = `/tpRoute/care`;
    const postBody = {
      type: 'POST',
      url: constant.star_endpoint + `/api/policy/proposals/${this.purchaseToken}/purchase/response`,
      header: {},
      data: {
        "APIKEY": constant.APIKEY,
        "SECRETKEY": constant.SECRETKEY,
        "purchaseToken": this.purchaseToken
      }
    }
    this.commonService.postSTAR(url, postBody).subscribe(async res => {
      console.log("Purchase Status Success : ", res)
      this.ngxLoader.stop();
      if (res.data.status === 'SUCCESS') {
        this.referenceId = res.data.referenceId;
        this.toastr.success("Transaction Successfull", "Success");
        //this.util.successDialog("Transaction is Successfull!");
        this.getPlanDetails();
        this.updatePaymentStatus('success');
        this.checkPolicyStatus();
      } else {
        let tab = localStorage.getItem('tab');
        let user;
        if (tab === 'I') {
          user = JSON.parse(localStorage.getItem('userData1'));
        } else if (tab === 'F') {
          user = JSON.parse(localStorage.getItem('userData2'));
        } else {
          user = JSON.parse(localStorage.getItem('userData3'));
        }
        let gender = user.gender;
        let premium_type = user.construct;
        let age = user.age;
        let city = user.city_name;
        let plan_id = localStorage.getItem('plan_id');
        let premium_id = localStorage.getItem('premium_id');
        let session_id = localStorage.getItem('session_id');
        this.paymentUnsucessSMS(`${constant.hosting_endpoint}/proposal?plan_id=${plan_id}&premium_id=${premium_id}&gender=${gender}&c=${premium_type}&age=${age}&city=${city}&sess=${session_id}&step=five`)
        this.toastr.error("Payment Unsuccessfull", "Payment Failed");
        await this.updatePaymentStatus('failed');
        this.router.navigate([`proposal`], { queryParams: { plan_id: plan_id, premium_id: premium_id, gender: gender, c: premium_type, age: age, city: city, sess: session_id, step: 'five' } });
        //this.router.navigate['failed'];
      }
    }, err => {
      this.ngxLoader.stop();
      console.log("Purchase Status Error : ", err)
      this.toastr.error("Something went wront while creating proposal", "Error");
    })
  }

  afterPaymentSMS() {
    const shortenURL = this.commonService.createbitlyshortlink(JSON.stringify({ "long_url": constant.playstore_link, "domain": "bit.ly" })).subscribe(res=>{
      let link = res.link
        const body = {
            "contactNumber": this.plandetail.contactNumber,
            "clickLink": link
        };
        const url = `/smsRoute/welcome_after_payment`;
        this.commonService.post(url, body).subscribe((response) => {
            if (response.error.errorCode === 200) {
                console.log("Welcome SMS : ", response);
            }
        }, (error) => {
            console.log("SMS error ts: ", error);
            this.toastr.error(error.error.error.errorMessage || 'Please try after sometime', "Error");
        });
    })
  }

  paymentUnsucessSMS(url:string){
    const shortenURL = this.commonService.createbitlyshortlink(JSON.stringify({ "long_url": url, "domain": "bit.ly" })).subscribe(res=>{
      let link = res.link
        const body = {
            "contactNumber": this.plandetail.contactNumber,
            "clickLink": link
        };
        const url = `/smsRoute/transaction_failure`;
        this.commonService.post(url, body).subscribe((response) => {
            if (response.error.errorCode === 200) {
                console.log("Welcome SMS : ", response);
            }
        }, (error) => {
            console.log("SMS error ts: ", error);
            this.toastr.error(error.error.error.errorMessage || 'Please try after sometime', "Error");
        });
    })
  }


  updatePaymentStatus(status): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      const url = `/userPlanTransactionRoute/edit/${this.referenceId}`;
      const postBody = {
        "payment_status": status,
        "payment_status_reason": ""
      };
      this.commonService.put(url, postBody).subscribe(res => {
        console.log("Updated Payment Status : ", res)
        resolve(1)
      }, err => {
        console.log("Purchase Status Error : ", err)
        this.toastr.error("Something went wront while updating payment status", "Error");
        reject(err)
      })
    });
    return promise;
  }

  checkPolicyStatus() {
    this.policyRes.Note = 'Please Wait...'
    const url = `/tpRoute/care`;
    const postBody = {
      type: 'POST',
      url: `${constant.star_endpoint}/api/policy/proposals/${this.referenceId}/policystatus`,
      header: {},
      data: {
        "APIKEY": constant.APIKEY,
        "SECRETKEY": constant.SECRETKEY,
        "referenceId": this.referenceId
      }
    }
    this.commonService.postSTAR(url, postBody).subscribe(res => {
      this.ngxLoader.stop();
      console.log("Policy Status : ", res)
      this.policyRes = res.data;
      if (res.data.Note) {
        this.toastr.warning(res.data.Note, "Info")
      }
    }, err => {
      console.log("Purchase Status Error : ", err)
      this.toastr.error("Payment Unsuccessfull", "Error");
      this.router.navigate['failed'];
    })

  }

  downloadPDF() {
    //===========Policy Document API============
    this.dwnloadBtn = true;
    this.dwnloadBtnText = 'Downloading...';
    this.policyRes.Note = 'Please Wait...'
    const url = `/tpRoute/care`;
    const postBody = {
      type: 'POST',
      url: `${constant.star_endpoint}/api/policy/proposals/${this.referenceId}/schedule`,
      header: {},
      data: {
        "APIKEY": constant.APIKEY,
        "SECRETKEY": constant.SECRETKEY,
        "referenceId": this.referenceId
      }
    }
    this.commonService.postSTAR(url, postBody).subscribe(res => {
      this.dwnloadBtn = false;
      this.dwnloadBtnText = 'Download Policy PDF';
      console.log("Response : ", res)
      if (res.data.Note) {
        this.toastr.warning(this.policyRes.Note, "Info")
      } else {
        this.downloadPolicy(res.data)
      }

      // this.toastr.success("Downloaded Successfully!", "Success");
    }, err => {
      this.dwnloadBtn = false;
      this.dwnloadBtnText = 'Download Policy PDF';
      console.log("Download Error : ", err)
    })
  }

  downloadPolicy(data) {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'STAR-HEALTH.pdf');
  }

  getPlanDetails() {
    const url = `/userPlanTransactionRoute/detailsByProposalID/${this.referenceId}`;
    this.commonService.get(url).subscribe(res => {
      console.log("Plan Details : ", res)
      let username;
      if (res.data.dbuser.middle_name) {
        username = res.data.dbuser.first_name + ' ' + res.data.dbuser.middle_name + ' ' + res.data.dbuser.last_name;
      } else {
        username = res.data.dbuser.first_name + ' ' + res.data.dbuser.last_name;
      }
      this.plandetail = {
        plan: res.data.plan_name,
        plan_id: res.data.plan_id,
        premium_id: res.data.premium_id,
        premium_type: res.data.construct,
        username: username,
        contactNumber:res.data.dbuser.contactNumber,
        gender: (res.data.dbuser.gender == 'MALE') ? '1' : '2',
        age: res.data.dbuser.age,
        city: 'Kolkata',
        session_id: res.data.session_id,
        company: res.data.company_master.company_name,
        si: res.data.si_amount,
        premium: Math.round(res.data.premium_master.premium_with_gst),
        term: res.data.premium_term
      }
      console.log(this.plandetail)
      this.afterPaymentSMS()
    }, err => {
      this.ngxLoader.stop();
      console.log("Error : ", err)
      this.toastr.error("Something went wront while fetching Plan Details", "Error");
    })
  }



}
