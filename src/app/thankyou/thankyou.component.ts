import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { constant } from '../constant';
import Utils from '../utils';
import { CommonService } from '../services/common.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
const FileSaver = require('file-saver');

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {

  QuoteNumber: string;
  proposalNum: string;
  util = new Utils;
  session_id: string;
  plan_id: string;
  premium_id: string;
  company_id: string;
  company_special_id: string;
  policyStatus = 'processing...'
  policyNumber = 'Processing';
  plandetail: any = {};
  proposal: any = {
    address: {},
    nominee: {}
  };
  txnStatus: boolean;
  occupation = [];
  lifestyleList = [];
  currentYr: number;
  body: any = {
    test: 'ABC'
  };
  PolCreationRespons: any = {}
  receipt: any = {}

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService
  ) { }

  ngOnInit() {
    var d = new Date();
    this.currentYr = d.getFullYear();
    this.route.queryParams.subscribe(params => {
      this.QuoteNumber = params['quote'];
      this.getPlanDetails();
    })
  }

  createABHIToken(): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      const url = `/tpRoute/care`;
      const body = {
        type: 'POST',
        url: constant.aditya_endpoint + '/ABHICL_OAuth/Service1.svc/accessToken',
        headers: {},
        data: {
          "Metadata": {
            "Sender": {
              "LogicalID": "PolicyMall",
              "TaskID": "Quote",
              "ReferenceID": "10001",
              "CreationDateTime": moment().format('DD/MM/YYYY HH:mm:ss A'),
              "TODID": this.util.randomString(25)
            }
          },
          "client_id": constant.abhi_clientid,
          "client_secret": constant.abhi_client_secret,
          "grant_type": constant.abhi_grant_type
        }
      }
      this.commonService.post(url, body).subscribe((res: any) => {
        this.toastr.success("Token Generated Successfully");
        console.log("Create Token : ", res)
        resolve(res.data)
      }, error => {
        this.toastr.error("Unable to Create Token");
        reject(error)
      })
    });
    return promise;
  }

  getPlanDetails() {
    this.ngxLoader.start();
    const url = `/userPlanTransactionRoute/detailsByProposalID/${this.QuoteNumber}`;
    this.commonService.get(url).subscribe(res => {
      console.log("Plan Details : ", res);
      if (res.data.response_data.TxStatus === 'success') {
        // xxxxxxxxxxxxxxxxxxxx PAYMENT SUCCESSFULL xxxxxxxxxxxxxxxxxxxxxxx
        this.txnStatus = true;
        this.company_id = res.data.company_id;
        this.plan_id = res.data.plan_id;
        this.premium_id = res.data.premium_id;
        this.session_id = res.data.session_id;
        this.company_special_id = res.data.company_master.company_type;
        this.plandetail = {
          quoteID: res.data.response_data.QuoteId,
          plan: res.data.plan_name,
          txnStatus: res.data.response_data.TxStatus,
          txnid: res.data.response_data.SourceTxnId,
          TxRefNo: res.data.response_data.TxRefNo,
          paymentMode: res.data.response_data.paymentMode,
          txnDateTime: res.data.response_data.txnDateTime,
          pgRespCode: res.data.response_data.pgRespCode,
          transaction_amount: res.data.response_data.amount,
          paymentby: res.data.response_data.email,
          company: res.data.company_master.company_name || '',
          si: res.data.si_amount,
          term: res.data.premium_master.premium_term,
          plan_code: res.data.product_plan_mapping.plan_code,
          product_code: res.data.product_plan_mapping.product_code,
          chronic_disease: res.data.premium_master.chronic_disease,
          si_type: res.data.premium_master.prem_type_details.premium_type_name,
          premium_type: res.data.premium_master.premium_type,
          premium_type_code: res.data.premium_master.prem_type_details.premium_type_code,
          zone: res.data.premium_master.pr_zone.name
        }

        console.log(this.plandetail)
        this.fullQuote()
        //this.getSessionDetails()
      } else {
        //xxxxxxxxxxxxxx PAYMENT UNSUCCESSFULL xxxxxxxxxxxxxx
        this.ngxLoader.stop();
        this.txnStatus = false;
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
        this.toastr.error("Payment Unsuccessfull", "Payment Failed");
        this.paymentUnsucessSMS(`${constant.hosting_endpoint}/proposal?plan_id=${plan_id}&premium_id=${premium_id}&gender=${gender}&c=${premium_type}&age=${age}&city=${city}&sess=${session_id}&step=five`)
        this.router.navigate([`proposal`], { queryParams: { plan_id: plan_id, premium_id: premium_id, gender: gender, c: premium_type, age: age, city: city, sess: session_id, step: 'five' } });
      }
    }, err => {
      this.ngxLoader.stop();
      console.log("Error : ", err)
      //this.toastr.error("Something went wront while fetching Plan Details", "Error");
    })
  }

  paymentUnsucessSMS(url:string){
    const shortenURL = this.commonService.createbitlyshortlink(JSON.stringify({ "long_url": url, "domain": "bit.ly" })).subscribe(res=>{
      let link = res.link
        const body = {
            "contactNumber": this.proposal.contactNumber,
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

  async fullQuote(){
    //this.ngxLoader.stop();
    let proposalObj = localStorage.getItem('abhiproposalObj');
    proposalObj = JSON.parse(proposalObj);
    //console.log(proposalObj)
    let postdata = proposalObj;
    postdata['PolicyCreationRequest']['IsPayment'] = 1
    postdata['ReceiptCreation'] = {
      "officeLocation": "Noida",
      "modeOfEntry": "Online",
      "cdAcNo": "",
      "expiryDate": moment().format('DD/MM/YYYY'),
      "payerType": "Customer",
      "payerCode": "",
      "paymentBy": "Proposer",
      "paymentByName": this.proposal.first_name + ' ' + this.proposal.last_name,
      "paymentByRelationship": "R001",
      "collectionAmount": this.plandetail.transaction_amount,
      "collectionRcvdDate": moment().format('DD/MM/YYYY'),
      "collectionMode": "Online Collections",
      "remarks": "",
      "instrumentNumber": this.plandetail.TxRefNo,
      "instrumentDate": moment().format('DD/MM/YYYY'),
      "bankName": "",
      "branchName": "",
      "bankLocation": "",
      "micrNo": "",
      "chequeType": "",
      "ifscCode": "",
      "PaymentGatewayName": "PayU Biz",
      "TerminalID": ""
    }

    let endpoint;
    if (this.plandetail.product_code == 6212) {
      // Activ Health
      endpoint = '/ABHICL_FullQuoteNSTP/Service1.svc/GenericFullQuote'
    } else if (this.plandetail.product_code == 4226 || this.plandetail.product_code == 4227) {
      // Activ Assure
      endpoint = '/ABHICL_NB/Service1.svc/FQ_ActiveAssure'
    } else if (this.plandetail.product_code == 5221) {
      // Activ Care
      endpoint = '/ABHICL_NB/Service1.svc/ActiveCare'
    } else {
      alert('Invalid Product Code');
      return;
    }

    let authToken = await this.createABHIToken();

    const body = {
      type: 'POST',
      url: constant.aditya_endpoint + endpoint,
      headers: {
        authorization:authToken.access_token
      },
      data: postdata
    }

    this.body = body

    console.log("Aditya Body : ", body)
    const url = `/tpRoute/care`;
    this.ngxLoader.start();
    this.commonService.post(url, body).subscribe((res: any) => {

      console.log("ABHI success : ", res);
      this.ngxLoader.stop();
      if (res.data.ReceiptCreationResponse.errorNumber == 0) {
        const resp = res.data.PolCreationRespons;
        console.log(resp)
        localStorage.removeItem('abhiproposalObj');
        this.PolCreationRespons = resp;
        this.policyStatus = resp.policyStatus;
        this.policyNumber = resp.policyNumber;
        this.receipt = res.data.ReceiptCreationResponse;
        this.toastr.success("Your Receipt Has Been Generated Successfully!", "Success");
        this.afterPaymentSMS()
        if (res.data.PolCreationRespons.stpflag == 'NSTP') {
          //this.toastr.warning("This is a NSTP case", "Warning");
          this.nstpSMS()
          this.router.navigate([`nstp`], { queryParams: { plan_id: this.plan_id, premium_id: this.premium_id } });
        }
        //this.proposalDetails(res.data.PolCreationRespons);
      } else {
        console.log(res.data.PolCreationRespons)
        this.PolCreationRespons = res.data.PolCreationRespons;
        this.policyStatus = res.data.PolCreationRespons.policyStatus;
        this.policyNumber = res.data.PolCreationRespons.policyNumber;
        this.receipt = res.data.ReceiptCreationResponse;
        //this.util.errorDialog(res.data.ReceiptCreationResponse.errorMessage)
        this.toastr.warning(res.data.ReceiptCreationResponse.errorMessage, "Information")
        //this.proposalDetails(res.data.PolCreationRespons);
      }
      this.updatePaymentStatus({
        "payment_status": status,
        "payment_status_reason": "",
        "receipt_no": this.receipt.ReceiptNumber,
        "receipt_amount": this.receipt.ReceiptAmount,
        "proposal_no": this.proposalNum,
        "policy_no": this.policyNumber,
        "quote_status": this.policyStatus,
        "customer_id": this.PolCreationRespons.customerId
      })
    }, err => {
      this.ngxLoader.stop();
      this.util.errorDialog("There is an error occured while creating your policy :(.Please try after sometime")
      console.log("Aditya Error : ", err)
    })

  }

  nstpSMS(){
    const shortenURL = this.commonService.createbitlyshortlink(JSON.stringify({ "long_url": 'https://thepolicymall.com/#/home', "domain": "bit.ly" })).subscribe(res=>{
      let link = res.link
        const body = {
            "contactNumber": this.proposal.contactNumber,
            "clickLink": link
        };
        const url = `/smsRoute/thank_you_nstp`;
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

  afterPaymentSMS() {
    const shortenURL = this.commonService.createbitlyshortlink(JSON.stringify({ "long_url": constant.playstore_link, "domain": "bit.ly" })).subscribe(res=>{
      let link = res.link
        const body = {
            "contactNumber": this.proposal.contactNumber,
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

  backtoHome() {
    this.router.navigate([`home`])
  }

  updatePaymentStatus(data) {
    const url = `/userPlanTransactionRoute/edit/${this.QuoteNumber}`;
    const postBody = {
      "payment_status": this.plandetail.txnStatus,
      "payment_status_reason": "",
      "receipt_no": data.receipt_no,
      "receipt_amount": data.receipt_amount,
      "roposal_no": data.roposal_no,
      "quote_status": data.quote_status,
      "customer_id": data.customer_id
    };
    this.commonService.put(url, postBody).subscribe(res => {
      console.log("Updated Payment Status : ", res)
      this.toastr.success("Payment Status Updated");
    }, err => {
      this.ngxLoader.stop();
      console.log("Purchase Status Error : ", err)
      //this.toastr.error("Something went wront while updating payment status", "Error");
    })
  }

  async downloadPDF() {
    let authToken = await this.createABHIToken();
    this.ngxLoader.start()
    //==============Generate Token================
    const body = {
      type: 'POST',
      url: constant.aditya_endpoint + `/ABHICL_OAuth/Service1.svc/accessToken`,
      headers: {
        authorization:authToken.access_token
      },
      data: {
        "client_id": constant.abhi_clientid,
        "client_secret": constant.abhi_client_secret,
        "grant_type": constant.abhi_grant_type
      }
    }
    const url = `/tpRoute/care`;
    this.commonService.post(url, body).subscribe(res => {
      console.log("TOKEN RESPONSE : ", res)
      const Authtoken = res.data.access_token
      //===========Policy PDF Download=====================

      const body = {
        type: 'POST',
        url: constant.aditya_endpoint + `/ABHICL_OmniDocs_FetchDetails/Service1.svc/FetchDetails`,
        headers: {
          username: constant.abhi_header.username,
          password: constant.abhi_header.password,
          Authorization: Authtoken
        },
        data: {
          "Metadata": {
            "Sender": {
              "LogicalID": "Seller Portal",
              "TaskID": "Quote",
              "ReferenceID": "10001",
              "CreationDateTime": moment().format('DD/MM/YYYY, h:mm:ss a'),
              "TODID": "jghf-kjhk-hkjh-kjhjkh"
            }
          },
          "FetchDocRequest": [{
            "CategoryID": "1001",
            "DocumentID": "2001",
            "ReferenceID": "3001",
            "FileName": "abhi",
            "Description": "adasd",
            "DataClassParam": [{
              "DocSearchParamId": "2",
              "Value": this.policyNumber
            },
            {
              "DocSearchParamId": "12",
              "Value": constant.IntermediaryCode
            }
            ]
          }],
          "SourceSystemName": "bpm",
          "SearchOperator": "OR"
        }
      }
      const url = `/tpRoute/care`;
      this.commonService.post(url, body).subscribe(res => {
        this.ngxLoader.stop()
        console.log("Policy PDF : ", res)
        let data = res.data.FetchDocResponse[0];
        this.toastr.info(data['Error'][0]['ErrorMessage'], "Info")
        if (data.ByteArray) {
          const blob = new Blob([data.ByteArray], { type: 'application/octet-stream' });
          FileSaver.saveAs(blob, 'ABHI-HEALTH.pdf');
          this.toastr.success("Downloaded Successfully", "Success");
        }
      }, err => {
        this.ngxLoader.stop();
        console.log("Error : ", err)
      })

    }, err => {
      this.ngxLoader.stop();
      console.log("TOKEN ERROR : ", err)
    })
  }

  // async fullQuote1() {
  //   let postData = {
  //     "ClientCreation": {
  //       "salutation": (this.proposal.gender == 'MALE') ? "Mr" : 'Ms',
  //       "firstName": this.proposal.first_name,
  //       "middleName": this.proposal.middle_name,
  //       "lastName": this.proposal.last_name,
  //       "dateofBirth": moment(this.proposal.dob).format('DD/MM/YYYY'),
  //       "gender": (this.proposal.gender == 'MALE') ? 'M' : 'F',
  //       "educationalQualification": "",
  //       "pinCode": this.proposal.address.pincode,
  //       "uidNo": "",
  //       "maritalStatus": this.proposal.marital_status,
  //       "nationality": "Indian",
  //       "occupation": this.proposal.occupation,
  //       "primaryEmailID": this.proposal.emailID,
  //       "contactMobileNo": this.proposal.contactNumber,
  //       "stdLandlineNo": "",
  //       "panNo": this.proposal.pan,
  //       "passportNumber": "",
  //       "contactPerson": "",
  //       "annualIncome": this.proposal.annual_income,
  //       "remarks": "",
  //       "startDate": moment().add(1, 'day').format('DD/MM/YYYY'),
  //       "endDate": moment().add(this.plandetail.term, 'year').format('DD/MM/YYYY'),
  //       "IdProof": "",
  //       "residenceProof": "",
  //       "ageProof": "",
  //       "others": "",
  //       "homeAddressLine1": this.proposal.address.house_no,
  //       "homeAddressLine2": this.proposal.address.area,
  //       "homeAddressLine3": "",
  //       "homePinCode": this.proposal.address.pincode,
  //       "homeArea": this.proposal.address.area,
  //       "homeContactMobileNo": this.proposal.contactNumber,
  //       "homeContactMobileNo2": "",
  //       "homeSTDLandlineNo": "",
  //       "homeSTDLandlineNo2": "",
  //       "homeFaxNo": "",
  //       "sameAsHomeAddress": 1,
  //       "mailingAddressLine1": this.proposal.address.house_no,
  //       "mailingAddressLine2": this.proposal.address.area,
  //       "mailingAddressLine3": "",
  //       "mailingPinCode": this.proposal.address.pincode,
  //       "mailingArea": this.proposal.address.area,
  //       "mailingContactMobileNo": this.proposal.contactNumber,
  //       "mailingContactMobileNo2": "",
  //       "mailingSTDLandlineNo": "",
  //       "mailingSTDLandlineNo2": "",
  //       "mailingFaxNo": "",
  //       "bankAccountType": "",
  //       "bankAccountNo": "",
  //       "ifscCode": "",
  //       "GSTIN": "",
  //       "GSTRegistrationStatus": "Consumers",
  //       "IsEIAavailable": "",
  //       "ApplyEIA": "",
  //       "EIAAccountNo": "",
  //       "EIAWith": "",
  //       "AccountType": "",
  //       "AddressProof": "",
  //       "DOBProof": "",
  //       "IdentityProof": "",
  //       "UIDAcknowledgementNo": "",
  //       "DCNnumber": ""
  //     },
  //     "PolicyCreationRequest": {
  //       "Quotation_Number": this.plandetail.quoteID,
  //       "Product_Code": this.plandetail.product_code,
  //       "Plan_Code": this.plandetail.plan_code,
  //       "SumInsured_Type": (this.plandetail.premium_type == '1a' || this.plandetail.premium_type == 'individual') ? 'Individual' : 'Family Floater',
  //       "Policy_Tanure": this.plandetail.term,
  //       "Member_Type_Code": this.plandetail.premium_type_code,
  //       "intermediaryCode": constant.IntermediaryCode,
  //       "AutoRenewal": "N",
  //       "intermediaryBranchCode": "",
  //       "agentSignatureDate": "",
  //       "Customer_Signature_Date": "",
  //       "businessSourceChannel": "",
  //       "leadID": "",
  //       "Source_Name": " Trinity Insurance",
  //       "BusinessType": "NEW BUSINESS",
  //       "familyDoctor": {
  //         "fullName": "",
  //         "qualification": "",
  //         "emailId": "",
  //         "RegistrationNumber": "",
  //         "addressLine1": "",
  //         "addressLine2": "",
  //         "pinCode": "",
  //         "contact_number": ""
  //       },
  //       "SPID": "",
  //       "RefCode1": "",
  //       "RefCode2": "",
  //       "TrackerRefCode": "",
  //       "EmployeeNumber": null,
  //       "EmployeeDiscount": "",
  //       "QuoteDate": moment().format('DD/MM/YYYY'),
  //       "IsPayment": 1,
  //       "goGreen": 0,
  //       "TCN": "",
  //       "BRMS_Status": "YES"
  //     },
  //     "ReceiptCreation": {
  //       "officeLocation": "Noida",
  //       "modeOfEntry": "Online",
  //       "cdAcNo": "",
  //       "expiryDate": moment().format('DD/MM/YYYY'),
  //       "payerType": "Customer",
  //       "payerCode": "",
  //       "paymentBy": "Proposer",
  //       "paymentByName": this.proposal.first_name + ' ' + this.proposal.last_name,
  //       "paymentByRelationship": "R001",
  //       "collectionAmount": this.plandetail.transaction_amount,
  //       "collectionRcvdDate": moment().format('DD/MM/YYYY'),
  //       "collectionMode": "Online Collections",
  //       "remarks": "",
  //       "instrumentNumber": this.plandetail.TxRefNo,
  //       "instrumentDate": moment().format('DD/MM/YYYY'),
  //       "bankName": "",
  //       "branchName": "",
  //       "bankLocation": "",
  //       "micrNo": "",
  //       "chequeType": "",
  //       "ifscCode": "",
  //       "PaymentGatewayName": "PayU Biz",
  //       "TerminalID": ""
  //     }
  //   }
  //   postData['MemObj'] = {
  //     'Member': this.proposal.insured_member.map((el, i) => {
  //       return {
  //         "MemberNo": i + 1,
  //         "Salutation": (el.gender === 'MALE') ? 'Mr' : 'Mrs',
  //         "First_Name": el.first_name,
  //         "Middle_Name": el.middle_name,
  //         "Last_Name": el.last_name,
  //         "Gender": (el.gender === 'MALE') ? 'M' : 'F',
  //         "DateOfBirth": moment(el.date_of_birth).format('DD/MM/YYYY'),
  //         "Relation_Code": el.relation_code || '',
  //         "Marital_Status": el.marital_status,
  //         "height": Math.round(parseFloat(el.height) * 30.48),
  //         "weight": el.weight,
  //         "occupation": el.occupation_master.occupation_code,
  //         "PrimaryMember": (el.relationship_with_user == 'self') ? 'Y' : 'N',
  //         "optionalCovers": [],
  //         "productComponents": [
  //           {
  //             "productComponentName": "SumInsured",
  //             "productComponentValue": Math.round(parseInt(this.plandetail.si))
  //           }, {
  //             "productComponentName": "Zone",
  //             "productComponentValue": this.plandetail.zone
  //           }
  //         ],
  //         "MemberPED": [{
  //           "PedCode": "",
  //           "WaitingPeriod": "",
  //           "Remarks": ""
  //         }],
  //         "MemberQuestionDetails": [{
  //           "QuestionCode": "",
  //           "Answer": "",
  //           "Remarks": ""
  //         }],
  //         "exactDiagnosis": "",
  //         "dateOfDiagnosis": "",
  //         "lastDateConsultation": "",
  //         "detailsOfTreatmentGiven": "",
  //         "doctorName": "",
  //         "hospitalName": "",
  //         "phoneNumberHosital": "",
  //         "labReport": "",
  //         "dischargeCardSummary": "",
  //         "personalHabitDetail": el.user_lifestyle_map.map(ls => {
  //           return {
  //             "numberOfYears": ls.number_of_years,
  //             "count": ls.consumption_per_day,
  //             "type": ls.lifestyle_type
  //           }
  //         }),
  //         "Nominee_First_Name": this.proposal.nominee.first_name,
  //         "Nominee_Last_Name": this.proposal.nominee.last_name,
  //         "Nominee_Contact_Number": "",
  //         "Nominee_Home_Address": "",
  //         "Nominee_Relationship_Code": this.proposal.nominee.relationship_with_proposer
  //       }
  //     })
  //   }

  //   let endpoint;
  //   if (this.plandetail.product_code == 6212) {
  //     // Activ Health
  //     endpoint = '/ABHICL_FullQuoteNSTP/Service1.svc/GenericFullQuote'
  //   } else if (this.plandetail.product_code == 4226 || this.plandetail.product_code == 4227) {
  //     // Activ Assure
  //     endpoint = '/ABHICL_NB/Service1.svc/FQ_ActiveAssure'
  //   } else if (this.plandetail.product_code == 5221) {
  //     // Activ Care
  //     endpoint = '/ABHICL_NB/Service1.svc/ActiveCare'
  //   } else {
  //     alert('Invalid Product Code');
  //     return;
  //   }

  //   let authToken = await this.createABHIToken();

  //   const body = {
  //     type: 'POST',
  //     url: constant.aditya_endpoint + endpoint,
  //     headers: {
  //       authorization:authToken.access_token
  //     },
  //     data: postData
  //   }

  //   this.body = body

  //   console.log("Aditya Body : ", body)
  //   const url = `/tpRoute/care`;
  //   this.ngxLoader.start();
  //   this.commonService.post(url, body).subscribe((res: any) => {

  //     console.log("ABHI success : ", res);
  //     this.ngxLoader.stop();
  //     if (res.data.ReceiptCreationResponse.errorNumber == 0) {
  //       const resp = res.data.PolCreationRespons;
  //       console.log(resp)
  //       this.PolCreationRespons = resp;
  //       this.policyStatus = resp.policyStatus;
  //       this.policyNumber = resp.policyNumber;
  //       this.receipt = res.data.ReceiptCreationResponse;
  //       this.toastr.success("Your Receipt Has Been Generated Successfully!", "Success");
  //       if (res.data.PolCreationRespons.stpflag == 'NSTP') {
  //         this.toastr.warning("This is a NSTP case", "Warning");
  //         this.router.navigate([`nstp`], { queryParams: { plan_id: this.plan_id, premium_id: this.premium_id } });
  //       }
  //       //this.proposalDetails(res.data.PolCreationRespons);
  //     } else {
  //       console.log(res.data.PolCreationRespons)
  //       this.PolCreationRespons = res.data.PolCreationRespons;
  //       this.policyStatus = res.data.PolCreationRespons.policyStatus;
  //       this.policyNumber = res.data.PolCreationRespons.policyNumber;
  //       this.receipt = res.data.ReceiptCreationResponse;
  //       //this.util.errorDialog(res.data.ReceiptCreationResponse.errorMessage)
  //       this.toastr.warning(res.data.ReceiptCreationResponse.errorMessage, "Information")
  //       //this.proposalDetails(res.data.PolCreationRespons);
  //     }

  //     this.updatePaymentStatus({
  //       "payment_status": status,
  //       "payment_status_reason": "",
  //       "receipt_no": this.receipt.ReceiptNumber,
  //       "receipt_amount": this.receipt.ReceiptAmount,
  //       "proposal_no": this.proposalNum,
  //       "policy_no": this.policyNumber,
  //       "quote_status": this.policyStatus,
  //       "customer_id": this.PolCreationRespons.customerId
  //     })



  //   }, err => {
  //     this.ngxLoader.stop();
  //     this.util.errorDialog("There is an error occured while creating your policy :(.Please try after sometime")
  //     console.log("Aditya Error : ", err)
  //   })
  // }

  

  proposalDetails() {
    const body = {
      type: 'GET',
      url: constant.aditya_endpoint + `/ABHICL_HealthCoreXML/Service1.svc/ProposalDetails/${this.PolCreationRespons.customerId}/${this.PolCreationRespons.proposalNumber}/${this.PolCreationRespons.quoteNumber}`,
      headers: {},
      data: null
    }
    const url = `/tpRoute/care`;
    this.commonService.post(url, body).subscribe(res => {
      console.log("Proposal Details : ", res)
      this.policyNumber = res.data.Response[0]['PolicyNumber']
      this.policyStatus = res.data.Response[0]['ProposalStatus']
    }, err => {
      this.ngxLoader.stop();
      console.log("Error : ", err)
    })
  }

  

  // getSessionDetails() {
  //   const url = `/proposalFormRoute/user_session_details/${this.session_id}?plan_id=${this.plan_id}`;
  //   this.commonService.get(url).subscribe(res => {
  //     let data = res.data;
  //     console.log("Session Detail : ", data);
  //     let occ_code = this.occupation.find(e => e.oc_id === data.occupation);
  //     console.log(occ_code);
  //     //this.userid = data.userId;
  //     this.proposal.first_name = data.first_name;
  //     this.proposal.last_name = data.last_name;
  //     this.proposal.middle_name = data.middle_name;
  //     this.proposal.emailId = data.emailId;
  //     this.proposal.occupation = (occ_code) ? occ_code.occupation_code : '';
  //     this.proposal.contactNumber = data.contactNumber;
  //     this.proposal.dob = data.date_of_birth
  //     this.proposal.annual_income = data.annual_income;
  //     this.proposal.gender = (data.gender == '1') ? "MALE" : "FEMALE";
  //     if (data.ul.length > 0) {
  //       this.proposal.address.state_id = data.ul[0]['state_id'];
  //       this.proposal.address.area = data.ul[0]['area'];
  //       this.proposal.address.pincode = data.ul[0]['pincode'];
  //       this.proposal.address.house_no = data.ul[0]['house_no'];
  //       this.proposal.address.landmark = data.ul[0]['landmark'];
  //     }
  //     this.proposal.marital_status = data.marital_status;
  //     this.proposal.marital_status = data.marital_status;
  //     this.proposal.insured_member = data.relationships
  //     if (data.nominee.length > 0) {
  //       this.proposal.nominee.first_name = data.nominee[0]['first_name'];
  //       this.proposal.nominee.last_name = data.nominee[0]['last_name'];
  //       this.proposal.nominee.age = data.nominee[0]['age'];
  //       this.proposal.nominee.relationship_with_proposer = data.nominee[0]['relationship_with_proposer'];
  //       if (data.appointee.length > 0) {
  //         this.proposal.appointee.appointeeName = data.appointee[0]['first_name'];
  //         this.proposal.appointee.appointeeAge = data.appointee[0]['age'];
  //         this.proposal.appointee.appointeeRelationship = data.appointee[0]['relationship_with_proposer'];
  //       }
  //     }

  //     this.fullQuote()

  //   }, err => {
  //     const errorMessage = err && err.message || 'Something goes wrong';
  //     this.toastr.error(errorMessage, 'Error');
  //   })
  // }

  

}
