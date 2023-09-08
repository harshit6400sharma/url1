import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { constant } from '../constant';
import { CommonService } from '../services/common.service';
const FileSaver = require('file-saver');

@Component({
  selector: 'app-religare-payment',
  templateUrl: './religare-payment.component.html',
  styleUrls: ['./religare-payment.component.css']
})
export class ReligarePaymentComponent implements OnInit {


  proposalNum: string;
  plandetail: any = {}
  dwnloadBtn = false;
  dwnloadBtnText = 'Donwload Policy PDF';

  constructor(
    private route: ActivatedRoute,
    private ngxLoader: NgxUiLoaderService,
    private commonService: CommonService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.proposalNum = params['proposalNum'];
      this.getPlanDetails()
    })
  }

  updatePaymentStatus(status) {
    const url = `/userPlanTransactionRoute/edit/${this.proposalNum}`;
    const postBody = {
      "payment_status": status,
      "payment_status_reason": ""
    };
    this.commonService.put(url, postBody).subscribe(res => {
      console.log("Updated Payment Status : ", res)
      this.toastr.success("Payment Status Updated", "Success");
    }, err => {
      console.log("Payment Status Error : ", err)
      this.toastr.error("Something went wront while updating payment status", "Error");
    })
  }

  getPlanDetails() {
    const url = `/userPlanTransactionRoute/detailsByProposalID/${this.proposalNum}`;
    this.commonService.get(url).subscribe(res => {
      console.log("Plan Details : ", res)
      let username;
      if (res.data.dbuser.middle_name) {
        username = res.data.dbuser.first_name + ' ' + res.data.dbuser.middle_name + ' ' + res.data.dbuser.last_name;
      } else {
        username = res.data.dbuser.first_name + ' ' + res.data.dbuser.last_name;
      }
      this.plandetail = this.plandetail = {
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
    }, err => {
      this.ngxLoader.stop();
      console.log("Error : ", err)
      this.toastr.error("Something went wront while fetching Plan Details", "Error");
    })
  }

  downloadPolicyPDF() {
    //===========Policy Document API============
    this.dwnloadBtn = true;
    this.dwnloadBtnText = 'Downloading...';
    const url = `/tpRoute/care`;
    const postBody = {
      type: 'POST',
      url: `${constant.religare_endpoint}/relinterfacerestful/religare/restful/DFV2`,
      header: constant.religare_header,
      data: { "intFaveoGetPolicyPDFIO": { "policyNum": this.proposalNum, "ltype": "POLSCHD" } }
    }
    this.commonService.post(url, postBody).subscribe(res => {
      this.dwnloadBtn = false;
      this.dwnloadBtnText = 'Download Policy PDF';
      console.log("Response : ", res)
      if(res.responseData.status == 1){
        const data = res.intFaveoGetPolicyPDFIO;
        let now = Date.now();
        const blob = new Blob([data.dataPDF], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `${now}-CARE.pdf`);
        this.toastr.success("Downloaded Successfully!", data.policyNum);
      } else {
        this.toastr.error("Unable To Download", "Error");
      }
    }, err => {
      this.dwnloadBtn = false;
      this.dwnloadBtnText = 'Download Policy PDF';
      console.log("Download Error : ", err)
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


}
