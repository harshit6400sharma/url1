import { Component, OnInit } from '@angular/core';
import { constant } from '../constant';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../services/common.service';

declare var $: any;

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})
export class ComplaintComponent implements OnInit {

  products = [];
  complaint: any = {
    product: '',
    issue_type: ''
  }
  issues = [];

  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    $("html, body").animate({ scrollTop: 0 }, 600);
    this.products = ['Health', 'Two Wheeler', 'Four Wheeler', 'Life', 'Travel', 'Corporate'];
    this.issues = ['Payment Issue', 'Policy Related Issue', 'Calling Support Issue(Misselling)', 'Website Content Issue', 'General Feedback', 'Other'];
  }

  submit() {
    var regexEmail = constant.emailvalidateregex;
    var regexMobile = constant.mobilevalidateregex;
    if (!regexMobile.test(this.complaint.contactNumber)) {
      this.toastr.error('Please enter a valid 10 digit mobile number', "Error");
    } else if (!regexEmail.test(this.complaint.email)) {
      this.toastr.error("Please enter a valid email address", "Error");
    } else {
      console.log(this.complaint);
      const url = `/complaintRoute/add`;
      const body = {
        customer_name: this.complaint.name,
        reg_email_id: this.complaint.email,
        contact_no: this.complaint.contactNumber,
        product: this.complaint.product,
        type_of_issue: this.complaint.issue_type,
        description: this.complaint.description
      }
      this.commonService.post(url, body).subscribe(res => {
        console.log(res)
        this.complaint = {
          name:'',
          email:'',
          contactNumber:'',
          description:'',
          product: '',
          issue_type: ''
        }
        this.toastr.success("Your Complaint Has Been Registered Successfully!", "Success")
      }, err => {
        const errorMessage = err && err.message || 'Something goes wrong';
        this.toastr.error(errorMessage, 'Error');
      })
    }
  }

}
