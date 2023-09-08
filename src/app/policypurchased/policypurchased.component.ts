import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from '../services/common.service';
import { constant } from '../constant';

@Component({
  selector: 'app-policypurchased',
  templateUrl: './policypurchased.component.html',
  styleUrls: ['./policypurchased.component.css']
})
export class PolicypurchasedComponent implements OnInit {

  purchased = [];
  userId: string;
  userName:string;

  constructor(
    private commonService: CommonService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
  ) { }

  ngOnInit() {
    this.userId = localStorage.getItem('user_Id');
    this.userName = localStorage.getItem('fullname');
    if (!this.userId) {
      this.router.navigate([`home`]);
    } else {
      this.policyPurchased();
    }
  }

  policyPurchased() {
    this.ngxService.start();
    const url = `/userPlanTransactionRoute/list?page=0&order_by=1&status=1&user_id=${this.userId}&company_id=&plan_id=&premium_id=`;
    this.commonService.get(url).subscribe((response) => {
      if (response.error.errorCode === 200) {
        this.ngxService.stop();
        this.purchased = response.data.rows.map(e => {
          return {
            company: e.company_master.company_name,
            companylogo:constant.api_endpoint+'/'+e.company_master.files[0]['file_path'],
            plan: e.product_plan_mapping.plan_name,
            premium: e.premium_master.premium_with_gst,
            term: e.premium_master.premium_term,
            proposalTypeName:e.proposal_id_name,
            proposalTypeValue:e.proposal_id_value,
            updatedAt: e.updatedAt,
            payment_status:e.payment_status
          }
        })
        console.log(this.purchased)
      }
    }, (error) => {
      console.log("error ts: ", error);
    });
  };


}
