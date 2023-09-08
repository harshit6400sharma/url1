import { DOCUMENT } from '@angular/common';
import { Component, TemplateRef, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from '../services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { constant } from '../constant';
import Utils from '../utils';
import * as moment from 'moment';

declare var $: any;

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit, OnDestroy {

  age: number;
  //body: any;
  gotit = false;
  gotittext: any;
  agedropDown = [];
  preferredcompany = [];
  private util = new Utils;
  premium_type: string;
  city: string;
  city_id: string;
  gender: string;
  fullURL: string;
  coveragearr = [];
  compareArr = [];
  total: number;
  ped = 0;
  quotesData = [];
  coverDetails: any = {};
  notcoverDetail: any = {};
  networkHospitalList = [];
  preexisdieseases = [];
  roomrentlimit = [];
  preferredinsuranceopt = [];
  illness = [];
  loading = false;
  maternity = [];
  copay = [];
  sf_ids = [];
  illnessfilter = [];
  copayfilter = [];
  pedfilter = [];
  maternityfilter = [];
  roomrentFilter = [];
  preferredInsuranceFilter = [];
  constructVal: any;
  base_url: string;
  min_premium = 500000;
  max_premium = 550000;
  suminsured_slug: string;
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  premiumfilter = this.min_premium + '-' + this.max_premium;
  modifySearchData: any = {
    adult_member: '2',
    child_member: '0',
    gender: '1'
  }
  discount_breakup_data: any = {}
  filter: any = {};
  featureDetail = [];
  session_id: string;
  savequotesObj: any = {}

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private ngxLoader: NgxUiLoaderService
  ) { }

  async ngOnInit() {
    
    // this.body = document.getElementsByTagName('body')[0];
    // this.body.classList.add('bodybg');
    this.session_id = localStorage.getItem("session_id") || '';
    $("html, body").animate({ scrollTop: 0 }, 600);
    this.renderer.addClass(this.document.body, 'bodybg');
    let tab = localStorage.getItem('tab');
    let user;
    if (tab === 'I') {
      user = JSON.parse(localStorage.getItem('userData1'));
    } else if (tab === 'F') {
      user = JSON.parse(localStorage.getItem('userData2'));
    } else {
      user = JSON.parse(localStorage.getItem('userData3'));
    }

    if (!user) {
      this.router.navigate([`home`])
    }
    if (user) {
      this.savequotesObj.emailId = user.emailId;
      this.savequotesObj.contactNumber = user.contactNumber;
      this.ped = user.ped;
      this.city_id = user.city_id;
    }
    
    $('#dismiss').click(function () {
      $(".insure_compare_pop").removeClass("active")
    });
    this.base_url = constant.api_endpoint;
    $("html, body").animate({ scrollTop: 0 }, 600);
    for (let i = 3; i < 100; i++) {
      this.agedropDown.push(i - 2);
      this.coveragearr.push({
        key: i.toString().substr(0, 2) + 'L - ' + i.toString().substr(0, 2) + '.5L',
        val: (i * 100000) + '-' + (i * 100000 + 50000)
      })
    }
    this.fullURL = constant.hosting_endpoint + this.router.url;
    console.log("FullURL : ", this.fullURL);
    
    this.getVariousFilterTypes();
    await this.companyList();
    this.route.queryParams.subscribe(params => {
      this.age = params['age'];
      this.premium_type = params['construct'];
      this.suminsured_slug = (params['construct'] == '1a') ? 'individual' : 'family-floater';
      this.city = params['city'];
      this.gender = params['gender'];
      if (params['coverage']) {
        this.premiumfilter = params['coverage'];
      }
      this.modifySearchData.age = this.age;
      this.modifySearchData.gender = this.gender;
      if (this.premium_type == '1a') {
        this.modifySearchData.adult_member = 1;
      } else if (this.premium_type == '2a') {
        this.modifySearchData.adult_member = 2;
      } else if (this.premium_type == '1a-1c') {
        this.modifySearchData.adult_member = 1;
        this.modifySearchData.child_member = 1;
      } else if (this.premium_type == '1a-2c') {
        this.modifySearchData.adult_member = 1;
        this.modifySearchData.child_member = 2;
      } else if (this.premium_type == '1a-3c') {
        this.modifySearchData.adult_member = 1;
        this.modifySearchData.child_member = 3;
      } else if (this.premium_type == '2a-3c') {
        this.modifySearchData.adult_member = 2;
        this.modifySearchData.child_member = 3;
      } else if (this.premium_type == '2a-2c') {
        this.modifySearchData.adult_member = 2;
        this.modifySearchData.child_member = 2;
      } else if (this.premium_type == '2a-1c') {
        this.modifySearchData.adult_member = 2;
        this.modifySearchData.child_member = 1;
      }

      //this.constructVal = this.getConstructValue(parseInt(params['construct']))
      this.constructVal = this.commonService.relations().filter(el => {
        return el.value == params['construct']
      })[0]['key'];
      console.log(this.constructVal)
      this.getQuotes()
    });

  }

  ngOnDestroy() {
    this.renderer.removeClass(this.document.body, 'bodybg');
  }

  getVariousFilterTypes() {
    const url = `/specialFeaturesRoute/list/1/0/1/?sf_type=&sf_name=`;
    this.commonService.get(url).subscribe((response) => {
      if (response.error.errorCode === 200) {
        const dataRows = response.data.rows;
        this.preexisdieseases = dataRows.filter(e => e.sf_type === 'pec');
        this.illness = dataRows.filter(e => e.sf_type === 'diseases');
        this.maternity = dataRows.filter(e => e.sf_type === 'maternity');
        this.copay = dataRows.filter(e => e.sf_type === 'copay');
        this.roomrentlimit = dataRows.filter(e => e.sf_type === 'rrl');
      }
    }, (error) => {
      this.toastr.error("Error occured while getting filter types", "Error")
      console.log("error ts: ", error);
    });
  }

  companyList(): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      const url = `/companyRoute/company_list?status=1&page=1&order_by=1&search`
      this.commonService.get(url).subscribe((response) => {
        if (response.error.errorCode === 200) {
          this.preferredinsuranceopt = response.data.rows.map(c => {
            return {
              company_id: c.company_id,
              company_name: c.company_name,
              checked: false
            }
          });
          resolve(this.preferredinsuranceopt)
        }
      }, (error) => {
        console.log("error ts: ", error);
        this.toastr.error("Unable to find companies", "Error");
        reject(error)
      });
    });
    return promise;
  }

  search() {
    //this.sf_ids = [...this.copayfilter, ...this.maternityfilter, ...this.pedfilter, ...this.illnessfilter, ...this.roomrentFilter];
    this.sf_ids = [...this.copayfilter, ...this.maternityfilter, ...this.pedfilter, ...this.roomrentFilter];
    this.getQuotes();
  }

  clearFilter() {
    this.illnessfilter = [];
    this.copayfilter = [];
    this.pedfilter = [];
    this.maternityfilter = [];
    this.sf_ids = [];
    this.illness.forEach((element, i) => {
      $("#illness" + i).prop('checked', false)
    });
    this.copay.forEach((element, i) => {
      $("#copay" + i).prop('checked', false)
    });
    this.preexisdieseases.forEach((element, i) => {
      $("#ped" + i).prop('checked', false)
    });
    this.maternity.forEach((element, i) => {
      $("#matrnity" + i).prop('checked', false)
    });
    this.getQuotes();
  }

  selectIllness(e) {
    if (e.target.checked) {
      this.illnessfilter.push(e.target.value);
    } else {
      this.illnessfilter = this.illnessfilter.filter(el => {
        return el !== e.target.value
      })
    }
    this.search();
  }

  selectPed(e) {
    if (e.target.checked) {
      if (this.pedfilter.length < 1) {
        this.pedfilter.push(e.target.value);
        this.search();
      } else {
        this.toastr.warning("Please uncheck the previous one")
        $('#' + e.target.id).removeAttr('checked');
      }
    } else {
      this.pedfilter.pop();
      this.search();
    }
  }

  selectMaternity(e) {
    if (e.target.checked) {
      if (this.maternityfilter.length < 1) {
        this.maternityfilter.push(e.target.value);
        this.search();
      } else {
        console.log(e.target.id)
        this.toastr.warning("Please uncheck the previous one")
        $('#' + e.target.id).removeAttr('checked');
      }
    } else {
      this.maternityfilter.pop();
      this.search();
    }
  }

  selectCopay(e) {
    if (e.target.checked) {
      if (this.copayfilter.length < 1) {
        this.copayfilter.push(e.target.value);
        this.search();
      } else {
        this.toastr.warning("Please uncheck the previous one")
        $('#' + e.target.id).removeAttr('checked');
      }
    } else {
      this.copayfilter.pop();
      this.search();
    }
  }

  selectPreferredInsurance(e, i) {
    if (e.target.checked) {
      this.preferredinsuranceopt[i]['checked'] = true
      this.preferredInsuranceFilter = this.preferredinsuranceopt.filter(el => el.checked === true).map(e => e.company_id);
      this.search();
    } else {
      this.preferredinsuranceopt[i]['checked'] = false
      this.preferredInsuranceFilter = this.preferredinsuranceopt.filter(el => el.checked === true).map(e => e.company_id);
      this.search();
    }
  }

  selectRoomRentLimit(e) {
    if (e.target.checked) {
      if (this.roomrentFilter.length < 1) {
        this.roomrentFilter.push(e.target.value);
        this.search();
      } else {
        this.toastr.warning("Please uncheck the previous one")
        $('#' + e.target.id).removeAttr('checked');
      }
    } else {
      this.roomrentFilter.pop();
      this.search();
    }
  }

  changeSumInsured(e, i?) {
    let range = e.target.value;
    this.min_premium = range.split('-')[0];
    this.max_premium = range.split('-')[1];
    this.compareArr = [];
    $(".insure_compare_pop").removeClass("active");
    this.getQuotes();
  }

  changeCover(e, data) {
    this.ngxLoader.start();
    let si_id = e.target.value;
    const url = `/premiumRoute/listByPlanAndSi?plan_id=${data.plan_id}&si_id=${si_id}&age=${this.age}&premium_type=${this.premium_type}&gender=`;
    this.commonService.get(url).subscribe((response) => {
      if (response.error.errorCode === 200) {
        console.log("Cover : ", response)
        this.ngxLoader.stop();
        if (response.data.length > 0) {
          let premiumwithgst = response.data.filter(el => el.premium_term === 1);
          let premiumwithgst2 = response.data.filter(el => el.premium_term === 2);
          let premiumwithgst3 = response.data.filter(el => el.premium_term === 3);

          data.premium_with_gst_2 = (premiumwithgst2.length > 0) ? this.util.currencyFormat(Math.round(premiumwithgst2[0]['premium_with_gst'])) : null;
          data.premium_with_gst = (premiumwithgst.length > 0) ? this.util.currencyFormat(Math.round(premiumwithgst[0]['premium_with_gst'])) : null;
          data.premium_with_gst_3 = (premiumwithgst3.length > 0) ? this.util.currencyFormat(Math.round(premiumwithgst3[0]['premium_with_gst'])) : null;
          data.oneYr_premiumid = (premiumwithgst.length > 0) ? premiumwithgst[0]['premium_id'] : null;
          data.twoYr_premiumid = (premiumwithgst2.length > 0) ? premiumwithgst2[0]['premium_id'] : null;
          data.threeYr_premiumid = (premiumwithgst3.length > 0) ? premiumwithgst3[0]['premium_id'] : null;
          data.sum_insured_id = response.data[0].si_id;
        } else {
          this.util.errorDialog("Sorry! No premium found", "Invalid Sum Insured");
        }
      }
    }, (error) => {
      this.ngxLoader.stop();
      console.log("error ts: ", error);
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  addtoCompare(e, plan, i, j) {
    console.log(plan)
    if (e.target.checked) {
      if (this.compareArr.length < 3) {
        this.compareArr.push({
          plan_id: plan.plan_id,
          plan_name: plan.plan_name,
          //premium_id: plan.premium_id,
          premium_id: plan.oneYr_premiumid,
          companylogo: plan.companylogo
        });
        console.log(this.compareArr)
        $(".insure_compare_pop").addClass("active")
        this.compareArr = this.compareArr.filter((emp, index, self) => {
          return index === self.findIndex((t) => {
            return t.premium_id === emp.premium_id
          })
        });
      } else {
        setTimeout(() => {
          $("#comparechk" + i + j).prop('checked', false);
        }, 100);
        this.toastr.warning("Only 3 plan can be compared", "Warning")
      }
    } else {
      this.compareArr = this.compareArr.filter(el => {
        return el.premium_id !== plan.premium_id
      })
      if (this.compareArr.length <= 0) {
        $(".insure_compare_pop").removeClass("active")
      }
    }
  }

  getQuotes() {
    //alert(this.suminsured_slug)
    console.log("PED FILTER : ", this.illnessfilter)
    let counter = 0;
    this.ngxLoader.start();
    const companies = this.preferredInsuranceFilter.join(",");
    const diseaseids = this.illnessfilter.join(",");
    const url = `/planRoute/list_associations?page=0&order_by=1&search=&ped=${this.ped}&premium_slot_min=${this.min_premium}&premium_slot_max=${this.max_premium}&age=${this.age}&premium_type=${this.premium_type}&sf_ids=${this.sf_ids.join(",")}&company_id=${companies}&disease_ids=${diseaseids}&city_id=${this.city_id}`;
    this.commonService.get(url).subscribe(res => {
      //console.log("getQuotes : ", res);
      this.ngxLoader.stop();
      const quotes = res.data.rows;
      this.quotesData = quotes.filter(plan => {
        return !plan.parent_prod
      }).map(el => {
        let oneYr = el.premium_masters.filter(e => { return e.premium_term === 1 });
        let twoYr = el.premium_masters.filter(e => { return e.premium_term === 2 });
        let threeYr = el.premium_masters.filter(e => { return e.premium_term === 3 });
        let planId = el.plan_id;
        let premiumId = el.premium_masters.filter(el => el.premium_term === 1);
        let savingAmt2 = (oneYr.length > 0 && twoYr.length > 0) ? (parseFloat(oneYr[0]['premium_price']) * 2) - parseFloat(twoYr[0]['premium_price']) : 0;
        let savingAmt3 = (oneYr.length > 0 && threeYr.length > 0) ? (parseFloat(oneYr[0]['premium_price']) * 3) - parseFloat(threeYr[0]['premium_price']) : 0;
        counter++
        return {
          plan_name: el.plan_name,
          toggler: false,
          plan_code: el.plan_code,
          childplan: quotes.filter(filtered => {
            return filtered.parent_prod && (filtered.parent_prod.plan_id === planId)
          }).map((child, indx) => {
            //console.log(child.plan_name+" CHILD PLAN INDEX==>",indx)
            let childoneYr = child.premium_masters.filter(e => { return e.premium_term === 1 });
            let childtwoYr = child.premium_masters.filter(e => { return e.premium_term === 2 });
            let childthreeYr = child.premium_masters.filter(e => { return e.premium_term === 3 });
            let childpremiumId = child.premium_masters.filter(el => el.premium_term === 1);
            let savingAmt2 = (childtwoYr.length > 0) ? (parseFloat(childoneYr[0]['premium_price']) * 2) - parseFloat(childtwoYr[0]['premium_price']) : 0
            let savingAmt3 = (childthreeYr.length > 0) ? (parseFloat(childoneYr[0]['premium_price']) * 3) - parseFloat(childthreeYr[0]['premium_price']) : 0
            counter++
            return {
              moreplan: (indx == 0) ? false : true,
              morePlanText: (indx == 0) ? 'Show More Plans' : '',
              totalchildPlan: quotes.filter(filtered => {
                return filtered.parent_prod && (filtered.parent_prod.plan_id === planId)
              }),
              plan_id: child.plan_id,
              featureDetail: [],
              networkHospitalList: [],
              plan_name: child.plan_name,
              plan_code: child.plan_code,
              company_id: child.company_id,
              company_special_id: child.company_master.company_type,
              companylogo: this.base_url + '/' + child.company_master.files[0]['file_path'],
              network_hospital: child.company_master.net_hos_count,
              parentplan: child.parent_prod.plan_name,
              parent_plan_code: child.parent_prod.plan_code,
              premium_masters: child.premium_masters,
              oneYr_premiumid: (childoneYr.length > 0) ? childoneYr[0]['premium_id'] : null,
              twoYr_premiumid: (childtwoYr.length > 0) ? childtwoYr[0].premium_id : null,
              threeYr_premiumid: (childthreeYr.length > 0) ? childthreeYr[0].premium_id : null,
              one_yr_premium: (childoneYr.length > 0) ? childoneYr[0]['premium_price'] : 0,
              two_yr_premium: (childtwoYr.length > 0) ? childtwoYr[0]['premium_price'] : null,
              three_yr_premium: (childthreeYr.length > 0) ? childthreeYr[0]['premium_price'] : null,
              premium_with_gst: (childoneYr.length > 0) ? this.util.currencyFormat(Math.round(childoneYr[0]['premium_with_gst'])) : 0,
              premium_with_gst_2: (childtwoYr.length > 0) ? this.util.currencyFormat(Math.round(childtwoYr[0]['premium_with_gst'])) : null,
              premium_with_gst_3: (childthreeYr.length > 0) ? this.util.currencyFormat(Math.round(childthreeYr[0]['premium_with_gst'])) : null,
              saving_2yr: this.util.currencyFormat(Math.round(savingAmt2)),
              saving_3yr: this.util.currencyFormat(Math.round(savingAmt3)),
              premium_id: (childpremiumId.length > 0) ? childpremiumId[0]['premium_id'] : null,
              featuredPlan: child.plan_feature_mappings.filter(plan => {
                return plan.is_featured === 1
              }).map(filtered => {
                return {
                  feature_name: filtered.feature_master.feature_name,
                  feature_desc: filtered.feature_master.feature_desc,
                  content: filtered.plan_feature_content
                }
              }),
              sum_insured: this.formatSumInsuredValue(child.premium_masters[0]['sum_insured_master']['sum_insured']),
              sum_insured_display: child.premium_masters[0]['sum_insured_master']['si_display'],
              sum_insured_id: child.premium_masters[0]['sum_insured_master']['si_id'],
              coverDropdown: child['sum_insured_masters'].filter(sumi => {
                if (this.premium_type != '1a') {
                  return sumi.si_slug === 'family-floater'
                } else {
                  return sumi.si_slug === 'individual'
                }
              }).map(newval => {
                return {
                  si_id: newval.si_id,
                  sum_insured: newval.sum_insured,
                  si_display: newval.si_display,
                  si_code_name: newval.si_code_name,
                  si_slug: newval.si_slug
                }
              })
            }
          }).sort((a, b) => (b.premium_with_gst > a.premium_with_gst) ? 1 : -1),
          plan_id: el.plan_id,
          featureDetail: [],
          networkHospitalList: [],
          premium_with_gst: (oneYr.length > 0) ? this.util.currencyFormat(Math.round(oneYr[0]['premium_with_gst'])) : null,
          premium_with_gst_2: (twoYr.length > 0) ? this.util.currencyFormat(Math.round(twoYr[0]['premium_with_gst'])) : null,
          premium_with_gst_3: (threeYr.length > 0) ? this.util.currencyFormat(Math.round(threeYr[0]['premium_with_gst'])) : null,
          company_id: el.company_id,
          company_special_id: el.company_master.company_type,
          companylogo: this.base_url + '/' + el.company_master.files[0]['file_path'],
          oneYr_premiumid: (oneYr.length > 0) ? oneYr[0]['premium_id'] : null,
          twoYr_premiumid: (twoYr.length > 0) ? twoYr[0].premium_id : null,
          threeYr_premiumid: (threeYr.length > 0) ? threeYr[0].premium_id : null,
          one_yr_premium: (oneYr.length > 0) ? oneYr[0]['premium_price'] : 0.00,
          two_yr_premium: (twoYr.length > 0) ? twoYr[0]['premium_price'] : null,
          three_yr_premium: (threeYr.length > 0) ? threeYr[0]['premium_price'] : null,
          saving_2yr: this.util.currencyFormat(Math.round(savingAmt2)),
          saving_3yr: this.util.currencyFormat(Math.round(savingAmt3)),
          premium_id: (premiumId.length > 0) ? premiumId[0]['premium_id'] : null,
          network_hospital: el.company_master.net_hos_count,
          featuredPlan: el.plan_feature_mappings.filter(plan => {
            return plan.is_featured === 1 && plan.feature_master
          }).map(filtered => {
            return {
              feature_name: filtered.feature_master.feature_name,
              feature_desc: filtered.feature_master.feature_desc,
              content: filtered.plan_feature_content
            }
          }),
          sum_insured: el.premium_masters[0]['sum_insured_master']['sum_insured'],
          sum_insured_display: el.premium_masters[0]['sum_insured_master']['si_display'],
          sum_insured_id: el.premium_masters[0]['sum_insured_master']['si_id'],
          coverDropdown: el['sum_insured_masters'].filter(sumi => sumi.si_slug == this.suminsured_slug).map(newval => {
            return {
              si_id: newval.si_id,
              sum_insured: newval.sum_insured,
              si_display: newval.si_display,
              si_code_name: newval.si_code_name,
              si_slug: newval.si_slug
            }
          })
        }
      }

      )
      //let popovervisible = sessionStorage.getItem('popover');
      this.openPrompt();

      console.log("QUOTES : ", this.quotesData)
      this.total = counter
      //this.personalisedSMS();
    }, err => {
      const errorMessage = err && err.message || 'Something goes wrong';
      this.toastr.error(errorMessage, 'Error');
    })
  }

  personalisedSMS() {
    this.commonService.createbitlyshortlink(JSON.stringify({ "long_url": this.fullURL, "domain": "bit.ly" })).subscribe(res => {
      let link = res.link
      const body = {
        "contactNumber": this.savequotesObj.contactNumber,
        "clickLink": link,
        "quotation_date":moment().format('LL')
      };
      const url = `/smsRoute/quote_page`;
      this.commonService.post(url, body).subscribe((response) => {
        if (response.error.errorCode === 200) {
          console.log("Welcome SMS Sent: ", response);
        }
      }, (error) => {
        console.log("SMS error ts: ", error);
        this.toastr.error(error.error.error.errorMessage || 'Please try after sometime', "Error");
      });
    })
  }

  openPrompt() {
    let _self = this;
    let sessgotit = localStorage.getItem('gotit') || '';
    if (sessgotit == '0' || sessgotit == '') {
      this.gotit = false;
      //Popover jQuery
      setTimeout(() => {
        $("[data-toggle=popover]").popover('show');
        $(document).ready(function () {
          $('body').addClass('overflow-hidden');
        });
        $(".btn-gotit").click(function () {
          $(".got-it-bttn-hld").hide();
          $(".popover").hide();
          _self.gotit = true;
          localStorage.setItem('gotit', '1');
          $("body").removeClass("overflow-hidden");
        });
      }, 100);
    } else {
      this.gotit = true;
      $(".got-it-bttn-hld").hide();
      $(".popover").hide();
      $("body").removeClass("overflow-hidden");
    }
  }

  morePlan(i) {
    const flag = this.quotesData[i]['toggler'] = !this.quotesData[i]['toggler'];
    this.quotesData[i]['childplan'] = this.quotesData[i]['childplan'].map((el, index) => {
      if (flag) {
        el['moreplan'] = false;
        el['morePlanText'] = (index == 0) ? 'Hide Plan' : ''
      } else {
        if (index > 0) {
          el['moreplan'] = true;
        }
        el['morePlanText'] = (index == 0) ? 'Show More Plans' : ''
      }
      return el
    })
  }

  formatSumInsuredValue(v) {
    if (v == 300000.00) {
      return '3L'
    } else if (v == 500000.00) {
      return '5L'
    } else if (v == 700000.00) {
      return '7L'
    } else if (v == 1000000.00) {
      return '10L'
    } else if (v == 1500000.00) {
      return '15L'
    } else if (v == 2000000.00) {
      return '20L'
    } else if (v == 2500000.00) {
      return '25L'
    } else if (v == 3000000.00) {
      return '30L'
    } else if (v == 3500000.00) {
      return '35L'
    } else if (v == 4000000.00) {
      return '40L'
    } else if (v == 4500000.00) {
      return '45L'
    } else if (v == 5000000.00) {
      return '50L'
    } else if (v == 5500000.00) {
      return '55L'
    } else if (v == 6000000.00) {
      return '60L'
    } else if (v == 6500000.00) {
      return '65L'
    } else if (v == 6500000.00) {
      return '65L'
    } else if (v == 7000000.00) {
      return '70L'
    } else if (v == 7500000.00) {
      return '75L'
    }
  }

  modifySearch() {
    const construct = this.commonService.relationValue(this.modifySearchData.adult_member, this.modifySearchData.child_member);
    this.modalRef.hide();
    this.router.navigate([`quotes`], { queryParams: { age: this.modifySearchData.age, construct: construct, gender: this.modifySearchData.gender, city: this.city } });
  }

  discountbreakupmodal(discount: TemplateRef<any>, data, yr) {
    console.log(data);
    if (yr == '2') {
      const gst = (parseFloat(data.two_yr_premium) * 18) / 100;
      this.discount_breakup_data = {
        year: 2,
        plan_name: data.plan_name,
        first_yr_premium: this.util.currencyFormat(Math.round(parseFloat(data.one_yr_premium))),
        total_premium: this.util.currencyFormat(Math.round(parseFloat(data.one_yr_premium) * 2)),
        saving_amt: data.saving_2yr,
        final_price: data.two_yr_premium,
        gst: gst,
        finalpremium: this.util.currencyFormat(Math.round(parseFloat(data.two_yr_premium) + gst)),
        logo: data.companylogo
      }
    } else if (yr == '3') {
      const gst = (parseFloat(data.three_yr_premium) * 18) / 100;
      this.discount_breakup_data = {
        year: 3,
        plan_name: data.plan_name,
        first_yr_premium: this.util.currencyFormat(Math.round(parseFloat(data.one_yr_premium))),
        total_premium: this.util.currencyFormat(Math.round(parseFloat(data.one_yr_premium) * 3)),
        saving_amt: data.saving_3yr,
        final_price: data.three_yr_premium,
        gst: (parseFloat(data.three_yr_premium) * 18) / 100,
        finalpremium: this.util.currencyFormat(Math.round(parseFloat(data.three_yr_premium) + gst)),
        logo: data.companylogo
      }
    }
    this.modalRef = this.modalService.show(discount, { class: 'modal-md' });
  }

  viewfeature(plan, index, j?) {
    let plan_id = plan.plan_id;
    let premium_id = plan.premium_id;
    this.loading = true;
    this.featureDetail = [];
    const url = `/planRoute/details/${plan_id}/?premium_id=${premium_id}&company_id=${plan.company_id}&city_id=${this.city_id}`;
    this.commonService.get(url).subscribe((response) => {
      if (response.error.errorCode === 200) {
        //this.ngxLoader.stop('loader-01');
        console.log("View Feature Response: ", response)
        this.loading = false;
        if (response.data) {
          let comp_special_id = response.data.company_master.company_type;
          this.featureDetail = response.data.plan_feature_mappings.filter(el => el.feature_master && el.feature_master.hasOwnProperty('feature_type') && el.feature_master.feature_type === 'feature_health_insurance' && el.comparison == 1)
          //console.log(this.featureDetail)
          //console.log(response.data.company_master.com_hos_map)
          // if (index && j) {
          //   this.quotesData[index]['childplan'][j]['featureDetail'] = this.featureDetail;
          //   this.quotesData[index]['childplan'][j]['networkHospitalList'] = response.data.company_master.com_hos_map;
          // } else {
          //   this.quotesData[index]['featureDetail'] = this.featureDetail;
          //   this.quotesData[index]['networkHospitalList'] = response.data.company_master.com_hos_map;
          // }
          plan.featureDetail = this.featureDetail;
          if (comp_special_id == '2') {

          } else {
            //plan.networkHospitalList = response.data.company_master.com_hos_map;
          }
          plan.showmore = true;
          plan.allhospital = response.data.network_hospital;
          plan.networkHospitalList = response.data.network_hospital.splice(0, 6);


          //waiting period & Exclusion
          // this.notcoverDetail = response.data.plan_feature_mappings.filter(el => {
          //   if (el.feature_master) {
          //     return el.feature_master.feature_type === "not_covered_feature_health_insurance"
          //   }
          // })[0] || {}
          //this.networkHospitalList = response.data.company_master.com_hos_map;
        }
      }
    }, (error) => {
      //this.ngxLoader.stop('loader-01');
      console.log("error ts: ", error);
    });
  }

  showmoreNH(plan) {
    plan.showmore = !plan.showmore;
    if (!plan.showmore) {
      plan.networkHospitalList = plan.allhospital
    } else {
      plan.networkHospitalList = plan.allhospital.splice(0, 6);
    }
  }

  starNetworkHospitals() {
    const url = constant.star_endpoint + '/api/authentication-service/v1/auth/token/generate';
    const reqbody = {
      "userId": constant.star_JWT_userid,
      "password": constant.star_JWT_password,
      "deviceType": "web"
    }
    this.commonService.post(url, reqbody).subscribe((response) => {
      if (response.status === 'success') {
        console.log(response)
        const jwt = response.token
        // ==========get hospital now============
        const hospitalurl = constant.star_endpoint + '/api/utility-service/v1/hospital/network/pincode/700106/list?startIndex=0&endIndex=20'
        this.commonService.get(hospitalurl).subscribe((response) => {
          if (response.error.errorCode === 200) {
            console.log(response)
          }
        }, (error) => {
          console.log("error ts: ", error);
          this.toastr.error("Something went wrong", "Error");
        });
      }
    }, (error) => {
      console.log("error ts: ", error);
      this.toastr.error("Something went wrong", "Error");
    });
  }

  removeCompare(x) {
    this.compareArr.splice(x, 1);
    if (this.compareArr.length <= 0) {
      $(".insure_compare_pop").removeClass("active")
    }
  }

  // buyNow(plan, yr) {
  //   const premiumid = (yr == '1') ? plan.oneYr_premiumid : ((yr == '2') ? plan.twoYr_premiumid : plan.threeYr_premiumid);
  //   this.router.navigate([`proposal`], { queryParams: { plan_id: plan.plan_id, premium_id: premiumid, gender: this.gender, c: this.premium_type, age: this.age, city: this.city } });
  // }

  buyNow(plan, yr) {
    this.ngxLoader.start();
    const userId = localStorage.getItem("getquoteuserID") || '';
    const session_id = localStorage.getItem("session_id") || '';
    const url = `/proposalFormRoute/add_plan_details/${userId}`;
    const premiumid = (yr == '1') ? plan.oneYr_premiumid : ((yr == '2') ? plan.twoYr_premiumid : plan.threeYr_premiumid);
    let postBody = {
      plan_id: plan.plan_id,
      premium_id: plan.premium_id,
      session_id: session_id
    };
    localStorage.setItem('plan_id', plan.plan_id);
    localStorage.setItem('premium_id', plan.premium_id);
    this.commonService.post(url, postBody).subscribe((response) => {
      if (response.error.errorCode === 200) {
        this.ngxLoader.stop();
        this.router.navigate([`proposal`], { queryParams: { plan_id: plan.plan_id, premium_id: premiumid, gender: this.gender, c: this.premium_type, age: this.age, city: this.city, company: plan.company_special_id } });
        console.log(response)
      }
    }, (error) => {
      console.log("error ts: ", error);
      this.toastr.error("Something went wrong", "Error");
    });
  }

  saveQuotes(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template);
  }

  goback() {
    this.router.navigate([`health`]);
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
      const url = `/quoteRoute/add`;
      const userId = localStorage.getItem("getquoteuserID") || '';
      console.log("userId : ", userId);
      let postBody = {
        user_id: userId,
        session_id: this.session_id,
        url: this.fullURL,
        contactNumber: this.savequotesObj.contactNumber,
        sms_text: "quote page sms"
      };
      this.personalisedSMS()
      this.commonService.post(url, postBody).subscribe((response) => {
        if (response.error.errorCode === 200) {
          //this.ngxLoader.stop('loader-01');
          console.log(response)
          this.toastr.success("Your quote has been shared to Email Id and Mobile No. provided", "Success");
          this.modalRef2.hide();
        } else {
          this.featureDetail = [{ feature_detail: '' }]
        }
      }, (error) => {
        //this.ngxLoader.stop('loader-01');
        console.log("error ts: ", error);
      });
    }
  }

  gotoCompare() {
    if (this.compareArr.length > 1) {
      let ids = this.compareArr.map(el => { return el.premium_id }).join(",");
      this.router.navigate([`compare`], { queryParams: { premium: ids, c: this.premium_type, age: this.age, gender: this.gender, city: this.city, coverage: this.premiumfilter } });
    } else {
      this.toastr.warning("Select min 2 plans to compare");
    }
  }

  mobFilter() {
    $(".left_panel.sidebar").addClass("active")
  }

  closeLeftFilterPanel() {
    $(".left_panel.sidebar").removeClass("active")
  }

  numericCheck(e) {
    if (isNaN(e.target.value)) {
      this.savequotesObj.contactNumber = ''
    }
  }

}
