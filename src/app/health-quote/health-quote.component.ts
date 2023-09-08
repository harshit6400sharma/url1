import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { catchError, retry } from 'rxjs/operators';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
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
  selector: 'app-health-quote',
  templateUrl: './health-quote.component.html',
  styleUrls: ['./health-quote.component.css']
})
export class HealthQuoteComponent implements OnInit {

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
  console.log("SDfsg");

  const url = 'https://ilesbsanity.insurancearticlez.com/cerberus/connect/token';
  var data1= {
    'grant_type': 'password',
    'username': 'TrinityIns',
    'password': 'ej4cjdgv72eTFez',
    'scope': 'esbmotor',
    'client_id': 'TrinityIns',
    'client_secret': 'YENPLYary8VBJHhe2yXtbtQJ'
  };
  var headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    "Access-Control-Allow-Origin":"*"
  };

  
  this.http.post<any>(url, data1,{headers}).subscribe({
        next: data => {
            console.log("sfdsgdfg");
            console.log(data);
        },
        error: error => {
            this.errorMessage = error.message;
            console.error('There was an error!', error);
        }
    })

    //var response1=this.iciciCreatePolicy({});
   // console.log(response1);

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

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  };

  iciciCreatePolicy(data): Observable<any> {

   
    
    
    const url = 'https://ilesbsanity.insurancearticlez.com/cerberus/connect/token';
    var data1= {
      'grant_type': 'password',
      'username': 'TrinityIns',
      'password': 'ej4cjdgv72eTFez',
      'scope': 'esbmotor',
      'client_id': 'TrinityIns',
      'client_secret': 'YENPLYary8VBJHhe2yXtbtQJ'
    };
    var headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'AppID': '554940',
    //     'Signature': 'VLwAATi/myXGqlG9C14DVIKsLgFjEUAZIizPSIbVdJw=',
    //     'TimeStamp': '1545391069685'
    //   })
    // };
    return this.http.post(
      url, data,{ headers }
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }
  

}


