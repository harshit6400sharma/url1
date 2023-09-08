import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
//import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';
//import { NgxUiLoaderService } from 'ngx-ui-loader';
import { constant } from '../constant';




declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  static_content: any = {};
  base_url: string;
  scrollto: string;
  firework: any;
  @ViewChild('ourpartners', { static: false }) ourpartners: ElementRef;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

    // let lnch = localStorage.getItem('lnchd') || null;
    // if (!lnch) {
    //   $('#grand-oprning').modal('show');
    // }

    this.route.queryParams.subscribe(params => {
      setTimeout(() => {
        var point = params['scrollto'];
        if (point) {
          document.querySelector('#' + point).scrollIntoView({ behavior: 'smooth', block: 'end' });
        } else {
          $("html, body").animate({ scrollTop: 0 }, 600);
        }

      }, 100);

    })
    this.base_url = constant.api_endpoint;
    this.getcms()
  }

  launch() {
    //localStorage.setItem('lnchd', '1')
  }

  gotoHealth(param: string) {
    console.log(param);
    if (param === 'H')
      this.router.navigate(['health']);
    else if (param === 'L')
      this.router.navigate(['term']);
    else if (param === 'C')
      this.router.navigate(['corporate']);
    else if (param === 'T')
      this.router.navigate(['travel']);
    else if (param === 'M')
      this.router.navigate(['four-wheeler']);
    else if (param === 'h')
      this.router.navigate(['health-insurance']);
    else if (param === 'l')
      this.router.navigate(['term-insurance']);
    else if (param === 't')
      this.router.navigate(['travel-insurance']);
    else if (param === 'c')
      this.router.navigate(['four-wheeler-insurance']);
    else if (param === 'co')
      this.router.navigate(['corporate-insurance']);
  }

  getcms() {
    const url = `/optionRoute/listMetaData?option_type=home_page_static`;
    this.commonService.get(url).subscribe(res => {
      console.log(res)
      this.static_content = res.data[0]['option_value'][0];
    }, err => {
      const errorMessage = err && err.message || 'Something goes wrong';
      this.toastr.error(errorMessage, 'Error');
    })
  }



}
