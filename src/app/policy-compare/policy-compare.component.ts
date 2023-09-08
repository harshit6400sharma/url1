import { Component, TemplateRef, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from '../services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { constant } from '../constant';
declare var $: any;
@Component({
  selector: 'app-policy-compare',
  templateUrl: './policy-compare.component.html',
  styleUrls: ['./policy-compare.component.css']
})
export class PolicyCompareComponent implements OnInit {

  comparisonIds = [];
  compareArr = [];
  features = [];
  base_url: string;
  premium_type: string;
  age: number;
  city: string;
  gender: string;
  coverage: any;
  modalRef2: BsModalRef;
  savequotesObj: any = {}
  fullURL: string;
  session_id: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private commonService: CommonService,
    private ngxLoader: NgxUiLoaderService
  ) { }

  ngOnInit() {
    $("html, body").animate({ scrollTop: 0 }, 600);
    this.getAllFearures()
    this.base_url = constant.api_endpoint;
    this.session_id = localStorage.getItem("session_id") || '';
    this.route.queryParams.subscribe(params => {
      let compareId = params['premium'];
      this.coverage = params['coverage'];
      this.premium_type = params['c'];
      this.age = params['age'];
      this.city = params['city'];
      this.gender = params['gender'];
      this.comparisonIds = compareId.split(",");
      this.getAllFearures()
      //this.getCompare();
    })

    this.fullURL = constant.hosting_endpoint + this.router.url;

    let tab = localStorage.getItem('tab');
    let user;
    if (tab === 'I') {
      user = JSON.parse(localStorage.getItem('userData1'));
    } else if (tab === 'F') {
      user = JSON.parse(localStorage.getItem('userData2'));
    } else {
      user = JSON.parse(localStorage.getItem('userData3'));
    }

    this.savequotesObj.emailId = user.emailId;
    this.savequotesObj.contactNumber = user.contactNumber;
  }

  getAllFearures() {
    const url = `/featureRoute/list?status=1&page=0&order_by=1&search`;
    this.commonService.get(url).subscribe((response) => {
      console.log(response)
      if (response.error.errorCode === 200) {
        this.features = response.data.rows.filter(el => el.feature_type === 'feature_health_insurance');
        this.getCompare()
        this.compareSMS()
      }
    })
  }

  getCompare() {
    //this.ngxLoader.start('loader-01');
    let postBody = {
      premium_ids: this.comparisonIds
    }
    const url = `/premiumRoute/compare`;
    this.commonService.post(url, postBody).subscribe((response) => {
      if (response.error.errorCode === 200) {
        console.log(response)
        //this.ngxLoader.stop('loader-01');
        this.compareArr = response.data.rows.map(el => {
          this.features.forEach((e => {
            el[e.feature_slug] = el.product_plan_mapping.plan_feature_mappings.filter(f => {
              if (f.feature_master) {
                return f.feature_master.fm_id === e.fm_id
              }
            })
          }))
          el['term'] = el.premium_term;
          el['sum_insured'] = el.plan_si_mappings.length > 0 ? el.plan_si_mappings[0]['sum_insured_master']['si_display'] : '...'
          el['plan_name'] = el.product_plan_mapping.plan_name
          el['company_name'] = el.product_plan_mapping.company_master.company_name
          el['company_logo'] = this.base_url + '/' + el.product_plan_mapping.company_master.files[0]['file_path']
          el['premium_with_gst'] = Math.round(el.premium_with_gst)
          return el;
        })
        console.log("compareArr : ", this.compareArr)
      }
    }, (error) => {
      this.ngxLoader.stop('loader-01');
      console.log("error ts: ", error);
    });
  }

  backClicked() {
    //this._location.back();
    this.router.navigate([`quotes`], { queryParams: { construct: this.premium_type, age: this.age, city: this.city, gender: this.gender, coverage: this.coverage } });
  }

  buyNow(plan) {
    this.router.navigate([`proposal`], { queryParams: { plan_id: plan.plan_id, premium_id: plan.premium_id, c: this.premium_type, age: this.age, city: this.city, gender: this.gender, coverage: this.coverage } });
  }

  savenShareModal(template) {
    this.modalRef2 = this.modalService.show(template);
  }

  sendQuotes() {
    var regex = constant.emailvalidateregex;
    var regexcontactNo = constant.mobilevalidateregex;
    if (this.savequotesObj.emailId == '') {
      this.toastr.error("Please enter your valid email", "Error");
    } else if (!regex.test(this.savequotesObj.emailId)) {
      this.toastr.error("Please enter a valid email address", "Error");
    } else if (!regexcontactNo.test(this.savequotesObj.contactNumber)) {
      this.toastr.error('Please enter a valid 10 digit mobile number', "Error");
      return false;
    } else {
      const url = `/premiumRoute/compare/save`;
      const userId = localStorage.getItem("getquoteuserID") || '';
      console.log("userId : ", userId);
      let postBody = {
        user_id: userId,
        session_id: this.session_id,
        session_url: this.fullURL,
        premium_ids: this.comparisonIds,
        contactNumber: this.savequotesObj.contactNumber,
        sms_text: this.fullURL
      };
      this.commonService.post(url, postBody).subscribe((response) => {
        if (response.error.errorCode === 200) {
          //this.ngxLoader.stop('loader-01');
          console.log(response)
          this.compareSMS()
          this.toastr.success("Your comparison has been shared to Email Id and Mobile No. provided", "Success");
          this.modalRef2.hide();
        } else {
          this.toastr.success("Something went wrong", "Error");
          //this.featureDetail = [{ feature_detail: '' }]
        }
      }, (error) => {
        //this.ngxLoader.stop('loader-01');
        this.toastr.success("Something went wrong", "Error");
        console.log("error ts: ", error);
      });
    }
  }

  compareSMS() {
    this.commonService.createbitlyshortlink(JSON.stringify({ "long_url": this.fullURL, "domain": "bit.ly" })).subscribe(res => {
      let link = res.link
      const body = {
        "contactNumber": this.savequotesObj.contactNumber,
        "clickLink": link
      };
      const url = `/smsRoute/compare_quote_page`;
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

  numericCheck(e) {
    if (isNaN(e.target.value)) {
      this.savequotesObj.contactNumber = ''
    }
  }
}
