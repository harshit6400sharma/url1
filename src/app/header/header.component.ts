import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonService } from '../services/common.service';
//import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { constant } from '../constant';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  mobmenu = false;
  contactNumber: string;
  modalRef: BsModalRef;
  step2 = false
  otp: string;
  fName: string;
  token: string;
  isLoggedIn$ = false;
  isHomepage2 = false;
  attempt = 0;

  constructor(
    private commonService: CommonService,
    //private ngxLoader: NgxUiLoaderService,
    private modalService: BsModalService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.attempt = +sessionStorage.getItem('attempts') || 0;
    this.authService.isHomepage2.subscribe(res => {
      this.isHomepage2 = true;
      setTimeout(() => {
        this.fName = localStorage.getItem('fname');
      }, 500);
    })
    this.authService.isLoggedIn.subscribe(status => {
      this.isLoggedIn$ = status;
      this.isHomepage2 = false;
      setTimeout(() => {
        this.fName = localStorage.getItem('fname');
      }, 500);
    })
    $(".closemenu").click(function () {
      $("#navbarNavDropdown").removeClass("show")
    })
    this.token = localStorage.getItem('pmtoken');
    this.fName = localStorage.getItem('fname');
    if (this.token) {
      this.isLoggedIn$ = true;
      this.isHomepage2 = false;
    }
    if (!this.isLoggedIn$ && this.fName) {
      this.isHomepage2 = true;
    }
  }

  getOtp() {
    var regexcontactNo = constant.mobilevalidateregex;
    if (!regexcontactNo.test(this.contactNumber)) {
      this.toastr.error('Please enter a valid 10 digit mobile number', "Error");
      return false;
    } else {
      if (this.attempt <= 3) {
        const url = `/loginSignupRoute/request_login_otp`;
        let body = {
          "contactNumber": this.contactNumber,
          "userType": "customer",
          "policy_purchase":'false'
        }
        this.commonService.post(url, body).subscribe((response) => {
          if (response.error.errorCode === 200) {
            //console.log(response)
            if (response.data.length > 0) {
              this.step2 = true;
              this.toastr.success("OTP has been sent to your mobile no", "Success")
            } else {
              alert('There is some error');
            }
          }
        }, (error) => {
          console.log("error ts: ", error);
          this.toastr.error(error.error.error.errorMessage || 'Something went wrong', "Error");
        });
      } else {
        this.toastr.error("You have attempted maximum times!Try after 24 hours", "Error");
        this.modalRef.hide();
      }
    }
  }

  loginpopup(template: TemplateRef<any>) {
    this.step2 = false;
    this.contactNumber = '';
    this.otp = '';
    this.modalRef = this.modalService.show(template, { class: 'common-popup' });
  }

  logout() {
    this.authService.logout()
  }

  doLogin() {
    var regexcontactNo = constant.mobilevalidateregex;
    if (!regexcontactNo.test(this.contactNumber)) {
      this.toastr.error('Please enter a valid 10 digit mobile number', "Error");
      return false;
    } else {
      this.authService
      const url = `/loginSignupRoute/login_with_otp`;
      let body = {
        "contactNumber": this.contactNumber,
        "login_otp": this.otp,
        "userType": "customer"
      }
      if (this.attempt < 4) {
        this.commonService.post(url, body).subscribe((response) => {
          if (response.error.errorCode === 200) {
            if (response.data.length > 0) {
              let user = response.data[0];
              this.authService.login();
              localStorage.setItem('fname', user.first_name);
              localStorage.setItem('fullname', user.userName);
              localStorage.setItem('pmtoken', user.token);
              localStorage.setItem('user_Id', user.userId);
              this.modalRef.hide();
              this.router.navigate([`userprofile/dashboard`]);
            } else {
              alert('There is some error');
            }
          }
        }, (error) => {
          console.log("error ts: ", error);
          if (error.status == 400) {
            this.attempt++;
            sessionStorage.setItem('attempts', this.attempt.toString());
          }
          let msg = error.error.error.errorMessage || 'Something went wrong';
          this.toastr.error(msg, "Error");
        });
      } else {
        this.toastr.error("You have attempted maximum times!Try after 24 hours", "Error");
        this.modalRef.hide();
      }
    }
  }

}
