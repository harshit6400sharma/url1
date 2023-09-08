import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { noop, Observable, Observer, of } from 'rxjs';
import { map, switchMap, tap, debounceTime } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { constant } from '../constant';
import { CommonService } from '../services/common.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LegalAndAdminPoliciesComponent } from '../legal-and-admin-policies/legal-and-admin-policies.component';
import { AuthService } from '../services/auth.service';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { Options } from 'ng5-slider';


declare var $: any;

interface Disease {
  value: string;
  label: string;
}

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css']
})


export class HealthComponent implements OnInit {

  cities = [];
  bsModalRef: BsModalRef;
  tnc = false;
  tncf = false;
  tncp = false;
  search: string;
  search_Parents: string;
  search_Family: string;
  errorMessage: string;
  suggestions$: Observable<any[]>;
  city: string;
  f: string;
  diseaseSelection =[];
  individual: any = {
    type: 'I',
    gender: '1',
    age: '',
    adult_number: 1,
    child_number: 0,
    userName: '',
    emailId: '',
    city_id: '',
    contactNumber: '',
    ped: '0',
    from_pincode: '',
    to_pincode: '',
  };
  individualStep2 = false;
  familyData: any = {
    type: 'F',
    gender: '1',
    age: '',
    adult_number: 1,
    child_number: 1,
    userName: '',
    emailId: '',
    city_id: '',
    contactNumber: '',
    ped: '0'
  };
  familyStep2 = false;

  parentData: any = {
    type: 'P',
    gender: '1',
    age: '',
    adult_number: 1,
    child_number: 0,
    userName: '',
    emailId: '',
    city_id: '',
    contactNumber: '',
    ped: '0'
  }
  parentStep2 = false;
  getQuoteBtn = false;
  base_url: string;
  age = [];

  

  diseases: Disease[] = [
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'hypertension', label: 'Hypertension' },
    { value: 'thyroid', label: 'Thyroid' },
    { value: 'asthma', label: 'Asthma' },
    { value: 'other', label: 'Other diseases' }
  ];

  selectedDiseases: { [key: string]: boolean } = {
    diabetes: false,
    hypertension: false,
    thyroid: false,
    asthma: false,
    other: false
  };


  items: string[] =[
    'Andaman and Nicobar Islands',
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chandigarh',
    'Chhattisgarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Lakshadweep',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Puducherry',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal'
  ];



  items_Parents: string[] =[
    'Andaman and Nicobar Islands',
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chandigarh',
    'Chhattisgarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Lakshadweep',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Puducherry',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal'
  ];
  items_Family: string[] = [
    'Andaman and Nicobar Islands',
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chandigarh',
    'Chhattisgarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Lakshadweep',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Puducherry',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal'
  ];

  filteredItems: string[] = [];
  filteredItems_Family: string[] = [];

  filteredItems_Parents: string[] = [];

  searchTerm: string = '';

  searchTerm_Parents: string = '';

  searchTerm_Family: string = '';

  

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private http: HttpClient,
    private _location: Location,
    private authService: AuthService,
    private ngxLoader: NgxUiLoaderService
  ) { }

  // agreentoTnC(e, flag) {
  //   if (e.target.checked) {
  //     if (flag == 'I') {
  //       this.tnc = false;
  //     } else if (flag == 'F') {
  //       this.tncf = false;
  //     } else {
  //       this.tncp = false;
  //     }
  //   } else {
  //     this.tnc = true;
  //     this.tncp = false;
  //     this.tncf = false;
  //   }
  // }

  ngOnInit() {
    // let activeTab = localStorage.getItem('tab');
    // activeTab = (activeTab && activeTab == 'I') ? 'Individual' : ((activeTab && activeTab == 'F') ? "Family" : "Parent");
    // $("html, body").animate({ scrollTop: 0 }, 600);
    // $('.nav-tabs a[href="#' + activeTab + '"]').tab('show'); // Default Tab Selection
    // $('.nav-tabs a').on('show.bs.tab', function () {
    //   this.search = '';
    // });
    this.base_url = environment.api_endpoint;
    const individualFrm = JSON.parse(localStorage.getItem('userData1'));
    const familyFrm = JSON.parse(localStorage.getItem('userData2'));
    const parentFrm = JSON.parse(localStorage.getItem('userData3'));
    if (individualFrm) {
      this.individual = individualFrm
      this.individual.city_id = '';
    }
    if (familyFrm) {
      this.familyData = familyFrm
      this.familyData.city_id = '';
    }
    if (parentFrm) {
      this.parentData = parentFrm;
      this.parentData.city_id = '';
    }
    this.individual.ped = '0';
    this.familyData.ped = '0';
    this.parentData.ped = '0'

    for (let x = 18; x <= 90; x++) {
      this.age.push(x);
    }

    $('.tab_slider').owlCarousel({
      loop: true,
      margin: 10,
      nav: false,
      center: true,
      autoplay: true,
      rewind: true,
      autoplayTimeout: 3000,
      responsive: {
        0: {
          items: 2
        },
        600: {
          items: 3
        },
        1000: {
          items: 3
        }
      }
    })
    this.f = this.route.snapshot.url[0].path;
    this.suggestions$ = new Observable((observer: Observer<string>) => {
      observer.next(this.search);
    }).pipe(
      debounceTime(200),
      
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.http.get<any>(
            constant.api_endpoint + '/cityRoute/list/1/0/4/', {
            params: { search_key: query }
          }).pipe(
            map((response: any) => {
              if (response.data.length === 0) {
                this.search = ''
              }
              return response && response.data.rows || []
            }),
            tap(() => noop, err => {
              // in case of http error
              this.errorMessage = err && err.message || 'Something goes wrong';
            })
          );
        }

        return of([]);
      })
    );
  }

  onTabSelect(data: TabDirective) {
    console.log(data.heading)
    this.search = ''
    if (data.heading == 'Family') {
      this.familyData.city_id = ''
    } else if (data.heading == 'Individual') {
      this.individual.city_id = ''
    } else if (data.heading == 'Parents') {
      this.parentData.city_id = ''
    }
  }

  hasdisease(v, type) {
    if (type === 'I') {
      this.individual.ped = v
    } else if (type === 'F') {
      this.familyData.ped = v
    } else {
      this.parentData.ped = v;
    }
  }

  onSelect(e, type) {
    if (type === 'I') {
      this.individual.city_name = e.item.city_name;
      this.individual.city_id = e.item.id;
      this.individual.state_id = e.item.state_id;
      this.individual.from_pincode = e.item.from_pincode;
      this.individual.to_pincode = e.item.to_pincode;
    } else if (type === 'F') {
      this.familyData.city_name = e.item.city_name;
      this.familyData.city_id = e.item.id;
      this.familyData.state_id = e.item.state_id;
      this.familyData.from_pincode = e.item.from_pincode;
      this.familyData.to_pincode = e.item.to_pincode;
    } else {
      this.parentData.city_name = e.item.city_name;
      this.parentData.city_id = e.item.id;
      this.parentData.state_id = e.item.state_id;
      this.parentData.from_pincode = e.item.from_pincode;
      this.parentData.to_pincode = e.item.to_pincode;
    }
    this.city = e.item.city_name;
  }

  setGender(gen, type) {
    if (type === 'I') {
      this.individual.gender = gen;
    } else if (type === 'F') {
      this.familyData.gender = gen;
    } else {
      this.parentData.gender = gen;
    }
  }


  getFamilyAdult(no) {
    this.familyData.adult_number = no
  }

  getParentAdult(no) {
    this.parentData.adult_number = no
  }

  getFamilyChild(no) {
    this.familyData.child_number = no
  }

  getQuotes(type) {
    var regex = constant.mobilevalidateregex;
    if (type === 'F') {
      if (!regex.test(this.familyData.contactNumber)) {
        this.toastr.error('Please enter a valid 10 digit mobile number', "Error");
        return false;
      } else if (!this.familyData.age || parseInt(this.familyData.age) < 18) {
        this.toastr.error("Please enter adult member's age which should >18 yrs", "Error");
        return false;
      } else if (!this.familyData.city_id) {
        this.toastr.error("Please enter your city", "Error");
      } else {
        this.familyStep2 = true;
      }
    } else if (type === 'I') {
      if (!this.individual.age || parseInt(this.individual.age) < 18) {
        this.toastr.error("Please enter member's age which should >18 yrs", "Error");
      } else if (this.individual.city_id == '') {
        this.toastr.error("Please enter your city", "Error");
      } else if (!regex.test(this.individual.contactNumber)) {
        this.toastr.error('Please enter a valid 10 digit mobile number', "Error");
      } else {
        this.individualStep2 = true;
      }
    } else {
      if (!regex.test(this.parentData.contactNumber)) {
        this.toastr.error('Please enter a valid 10 digit mobile number', "Error");
        return false;
      } else if (!this.parentData.age || parseInt(this.parentData.age) < 36) {
        this.toastr.error("Please enter member's age which should >36 yrs", "Error");
        return false;
      } else if (!this.parentData.city_id) {
        this.toastr.error("Please enter city", "Error");
      } else {
        this.parentStep2 = true;
      }
    }
  }

  goback(type) {
    if (type === 'I') {
      this.individualStep2 = false;
    } else if (type === 'F') {
      this.familyStep2 = false
    } else {
      this.parentStep2 = false
    }
  }

  individualSubmit() {
    var regex = constant.emailvalidateregex;
    var namearr = this.individual.userName.split(" ");
    if (this.individual.userName == '') {
      this.toastr.error("Please enter your full name", "Error");
    } else if (namearr.length === 1) {
      this.toastr.error("Enter your lastname with a space sperator", "Error");
    } else if (namearr.length > 3) {
      this.toastr.error("Only firstname middlename and lastname are allowed", "Error");
    } else if (this.individual.emailId == '') {
      this.toastr.error("Please enter your email address", "Error");
    } else if (!regex.test(this.individual.emailId)) {
      this.toastr.error("Please enter a valid email address", "Error");
    } else {
      this.getQuoteBtn = true;
      localStorage.removeItem('userData1');
      this.individual.construct = '1a';
      localStorage.setItem('userData1', JSON.stringify(this.individual));
      localStorage.setItem('fname', namearr[0]);
      //this.authService.homepage2();
      localStorage.setItem('tab', 'I');
      // const url = `/premiumRoute/livequotes?page=1&order_by=1&search`;
      // this.commonService.post(url, this.individual).subscribe(res => {
      //   console.log(res)
      //   const uerId = (res.data.length > 1) ? res.data[1][0]['userId'] : res.data['userId'];
      //   const session_id = (res.data.length > 1) ? res.data[1][0]['session_data']['user_sess_id'] : null;
      //   localStorage.setItem("getquoteuserID", uerId);
      //   localStorage.setItem("session_id", session_id);
      //   this.getQuoteBtn = false;
      //   this.router.navigate([`quotes`], { queryParams: { age: this.individual.age, construct: '1a', gender: this.individual.gender, city: this.city, sessid: session_id } });
      // }, err => {
      //   this.getQuoteBtn = false;
      //   const errorMessage = err && err.message || 'Something goes wrong';
      //   this.toastr.error(errorMessage, 'Error');
      // })
      this.router.navigate(['/health-quote']); // Replace 'new-page' with the actual route path

    }

  }

  familySubmit() {
    var regex = constant.emailvalidateregex;
    var namearr = this.familyData.userName.split(" ");
    if (this.familyData.userName == '') {
      this.toastr.error("Please enter your full name", "Error");
    } else if (namearr.length === 1) {
      this.toastr.error("Enter your lastname with a space sperator", "Error");
    } else if (namearr.length > 3) {
      this.toastr.error("Only firstname middlename and lastname are allowed", "Error");
    } else if (this.familyData.age == '' || parseInt(this.familyData.age) < 18) {
      this.toastr.error("Please enter your age which should greater than 18", "Error");
    } else if (this.familyData.city_id == '') {
      this.toastr.error("Please enter your city", "Error");
    } else if (this.familyData.emailId == '') {
      this.toastr.error("Please enter your valid email", "Error");
    } else if (!regex.test(this.familyData.emailId)) {
      this.toastr.error("Please enter a valid email address", "Error");
    } else {
      this.getQuoteBtn = true;
      localStorage.removeItem('userData2');
      const construct = this.commonService.relationValue(this.familyData.adult_number, this.familyData.child_number);
      const url = `/premiumRoute/livequotes?page=1&order_by=1&search`;
      this.familyData.construct = construct;
      localStorage.setItem('userData2', JSON.stringify(this.familyData));
      localStorage.setItem('tab', 'F');
      localStorage.setItem('fname', namearr[0]);
      this.router.navigate(['/health-quote']); // Replace 'new-page' with the actual route path

    }
  }

  filterItems() {
    this.filteredItems = this.items.filter(item =>
      item.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectItem(item: string) {
    this.searchTerm = item;
    this.individual.city_id = item;
    this.filteredItems = [];
    this.search=item;
  }

  filterItems_Parents() {
    this.filteredItems_Parents = this.items.filter(item =>
      item.toLowerCase().includes(this.search_Parents.toLowerCase())
    );
  }

  selectItem_Parents(item: string) {
    this.search_Parents = item;
    this.parentData.city_id = item;
    this.filteredItems_Parents = [];
    this.search_Parents=item;
  }



  filterItems_Family() {
    this.filteredItems_Family = this.items.filter(item =>
      item.toLowerCase().includes(this.search_Family.toLowerCase())
    );
  }

  selectItem_Family(item: string) {
    this.search_Family = item;
    this.familyData.city_id = item;
    this.filteredItems_Family= [];
    this.search_Family=item;
  }



  onCheckboxChange() {
    const selected = Object.keys(this.selectedDiseases).filter(
      key => this.selectedDiseases[key]
    );
    this.diseaseSelection=selected;
  }
  

  parentSubmit() {
    var regex = constant.emailvalidateregex;
    var namearr = this.parentData.userName.split(" ");
    if (this.parentData.userName == '') {
      this.toastr.error("Please enter your full name", "Error");
    } else if (namearr.length === 1) {
      this.toastr.error("Enter your lastname with a space sperator", "Error");
    } else if (namearr.length > 3) {
      this.toastr.error("Only firstname middlename and lastname are allowed", "Error");
    } else if (this.parentData.age == '' || parseInt(this.parentData.age) < 36) {
      this.toastr.error("Please enter your age which should greater than 35", "Error");
    } else if (this.parentData.city_id == '') {
      this.toastr.error("Please enter your city", "Error");
    } else if (this.parentData.emailId == '') {
      this.toastr.error("Please enter your valid email", "Error");
    } else if (!regex.test(this.parentData.emailId)) {
      this.toastr.error("Please enter a valid email address", "Error");
    } else {
      const construct = this.commonService.relationValue(this.parentData.adult_number, this.parentData.child_number);
      this.parentData.construct = construct;
      localStorage.removeItem('userData3');
      localStorage.setItem('userData3', JSON.stringify(this.parentData));
      localStorage.setItem('tab', 'P');
      localStorage.setItem('fname', namearr[0]);
      this.authService.homepage2();
      this.getQuoteBtn = true;
      this.router.navigate(['/health-quote']); // Replace 'new-page' with the actual route path


      
      // https://ilesbapigee.insurnacearticlez.com/generate-jwt-token
      var objectHealth={
        "grantType":"password",
        "username":"TrinityIns",
        "password":"ej4cjdgv72eTFez",
        "client_secret":"GEVkeuBwtQYQjPnrgaCBkMp39MezdbG2E0aonzKG1kl8chXfwObZq2Hsp0YXbGo7",
        "client_id":"TrinityIns",
        "scope":"esbpayment"|| "esbpolicypdf" || "esbmotor" || "esbmotormaster" || "esbmotormodel"
      };



      //For KYC

      // https://ilesbsanity.insurancearticlez.com/cerberus/connect/token
      // var Token={
      //   "grantType":"password",
      //   "username":"TrinityIns",
      //   "Password":"ej4cjdgv72eTFez",
      //   "scope":"esb-kyc",
      //   "clientId":"TrinityIns",
      //   "sec"
      // };


    }
  }

  back() {
    this._location.back();
  }

  opentncmodal() {
    this.bsModalRef = this.modalService.show(LegalAndAdminPoliciesComponent, { 'class': 'modal-lg' });
  }

}
