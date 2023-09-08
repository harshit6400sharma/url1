import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { constant } from '../constant';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-hdfcthankyou',
  templateUrl: './hdfcthankyou.component.html',
  styleUrls: ['./hdfcthankyou.component.css']
})
export class HdfcthankyouComponent implements OnInit {

  paymentId: string;
  txnid: string;
  plandetail:any = {};

  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private ngxXml2jsonService: NgxXml2jsonService,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params)
      this.paymentId = params['paymentId'];
      this.txnid = params['txnid'];
      this.txnverify()
    })
  }

  txnverify() {
    this.ngxLoader.start()
    const body = {
      type: 'POST',
      url: constant.hdfc.txn_verify,
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': constant.hdfc.txn_verify_soap_action
      },
      data: `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
            <soap:Body>
              <VerifyTransaction xmlns="http://www.apollomunichinsurance.com/B2BService">
                  <TransactionVerificationRequest>
                    <Partner xmlns="http://schemas.datacontract.org/2004/07/TransactionVerificationLibrary">
                      <PartnerCode xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">${constant.hdfc.PartnerCode}</PartnerCode>
                      <Password xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">${constant.hdfc.Password}</Password>
                      <UserName xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">${constant.hdfc.UserName}</UserName>
                    </Partner>
                    <PaymentId xmlns="http://schemas.datacontract.org/2004/07/TransactionVerificationLibrary">${this.paymentId}</PaymentId>
                    <TransactionId xmlns="http://schemas.datacontract.org/2004/07/TransactionVerificationLibrary">${this.txnid}</TransactionId>
                  </TransactionVerificationRequest>
              </VerifyTransaction>
            </soap:Body>
        </soap:Envelope>`
    }
    const url = `/tpRoute/care`;
    this.commonService.post(url, body).subscribe((res: any) => {
      //this.ngxLoader.stop()
      console.log("Success : ", res);
      this.afterPaymentSMS()
      this.toastr.success("Transaction Successfull","Success");
      this.getPlanDetails()
      // const parser = new DOMParser();
      // const xml = parser.parseFromString(res.data, 'text/xml');
      // const obj = this.ngxXml2jsonService.xmlToJson(xml);
      // console.log(obj)
    }, err => {
      this.ngxLoader.stop()
      console.log("Error : ", err)
      this.paymentUnsucessSMS(constant.playstore_link);
      this.toastr.error("Transaction Failed","Failed");
    })
  }

  getPlanDetails() {
    const url = `/userPlanTransactionRoute/detailsByProposalID/${this.paymentId}`;
    this.commonService.get(url).subscribe(res => {
      console.log("Plan Details : ", res)
      this.ngxLoader.stop()
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
    }, err => {
      this.ngxLoader.stop();
      console.log("Error : ", err)
      this.toastr.error("Something went wront while fetching Plan Details", "Error");
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
