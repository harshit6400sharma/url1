import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { constant } from '../constant';
import { CommonService } from '../services/common.service';

declare var $: any;

@Component({
  selector: 'app-nstp',
  templateUrl: './nstp.component.html',
  styleUrls: ['./nstp.component.css']
})
export class NstpComponent implements OnInit {

  premium_id: string;
  plan_id: string;
  contactNumber:string;

  constructor(
    private commonService: CommonService,
    private ngxLoader: NgxUiLoaderService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    let tab = localStorage.getItem('tab');
        var user;
        if (tab === 'I') {
            user = JSON.parse(localStorage.getItem('userData1'));
        } else if (tab === 'F') {
            user = JSON.parse(localStorage.getItem('userData2'));
        } else {
            user = JSON.parse(localStorage.getItem('userData3'));
        }
    this.contactNumber = user.contactNumber;
    this.nstpSMS()
    $("html, body").animate({ scrollTop: 0 }, 600);
    this.route.queryParams.subscribe(async params => {
      this.plan_id = params['plan_id'];
      this.premium_id = params['premium_id'];
      this.planDetails()
    });
  }

  nstpSMS() {
    this.commonService.createbitlyshortlink(JSON.stringify({ "long_url": constant.playstore_link, "domain": "bit.ly" })).subscribe(res => {
      let link = res.link
      const body = {
        "contactNumber": this.contactNumber,
        "clickLink": link
      };
      const url = `/smsRoute/thank_you_nstp`;
      this.commonService.post(url, body).subscribe((response) => {
        if (response.error.errorCode === 200) {
          console.log("Welcome SMS : ", response);
        }
      }, (error) => {
        console.log("SMS error ts: ", error);
        //this.toastr.error(error.error.error.errorMessage || 'Please try after sometime', "Error");
      });
    })
  }

  planDetails() {
    this.ngxLoader.start();
    const url = `/planRoute/details/${this.plan_id}?premium_id=${this.premium_id}`;
    this.commonService.get(url).subscribe(async res => {
      this.ngxLoader.stop();
      console.log("Plan Details : ", res)
    })
  }

}
