import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { constant } from '../constant';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {

  userName: string;
  modalRef: BsModalRef;
  userId: string;
  userData: any;
  sessionId: string;
  planid: string;
  sessionList = [];
  purchased = [];
  savedurls = [];

  constructor(
    private router: Router,
    private commonService: CommonService,
    private ngxService: NgxUiLoaderService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.userName = localStorage.getItem('fullname');
    this.userId = localStorage.getItem('user_Id');
    if (!this.userId) {
      this.router.navigate([`home`]);
    } else {
      this.userSession();
    }
  }

  SessionDetailModal(template: TemplateRef<any>, session) {
    this.sessionId = session.session_id;
    this.planid = session.plan_id;
    this.getSessionDetails();
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  userSession() {
    this.ngxService.start();
    const url = `/proposalFormRoute/user_session_list/${this.userId}`;
    this.commonService.get(url).subscribe((response) => {
      if (response.error.errorCode === 200) {
        this.ngxService.stop();
        this.userData = response.data;
        this.userData.city = (response.data.ul[0].city) ? response.data.ul[0]['city']['city_state_name'] : '';
        this.sessionList = response.data.user_plan_map.map(el => {
          return {
            plan_id: el.plan_id,
            plan: el.plan.plan_name,
            age: response.data.age,
            companylogo: constant.api_endpoint + '/' + el.plan.cm.files[0]['file_path'],
            company: el.plan.cm.company_name,
            premium: Math.round(el.premium.premium_with_gst),
            userid: el.user_id,
            family_size: el.premium.premium_type,
            session_id: el.user_session.user_sess_id,
            updatedAt: el.updatedAt
          }
        });
        console.log('Session : ', this.sessionList);
      }
    }, (error) => {
      this.ngxService.stop();
      console.log("error ts: ", error);
    });
  }

  getSessionDetails() {
    this.ngxService.start();
    const url = `/proposalFormRoute/user_session_details/${this.sessionId}?plan_id=${this.planid}`;
    this.commonService.get(url).subscribe((response) => {
      if (response.error.errorCode === 200) {
        this.ngxService.stop();
        console.log('getSessionDetails : ', response);
        this.savedurls = response.data.save_proposal.filter(f => f.proposal_form_url)
      }
    }, (error) => {
      this.ngxService.stop();
      console.log("error ts: ", error);
    });
  };

}
