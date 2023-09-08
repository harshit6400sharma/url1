import { DatePipe, Location } from '@angular/common';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { constant } from '../constant';
import Utils from '../utils';
import { CommonService } from '../services/common.service';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
//import * as JsonToXML from "js2xmlparser";
//import { promise } from 'protractor';

declare var $: any

@Component({
    selector: 'app-proposal',
    templateUrl: './proposal.component.html',
    styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {

    @ViewChild('abhipgform', { static: true }) abhipgform: ElementRef;
    IDProofArr = [
        {
            id: 'IDNO3',
            value: 'Driving License'
        }, {
            id: 'IDNO2',
            value: 'PAN'
        }, {
            id: 'IDNO1',
            value: 'Passport'
        }, {
            id: 'IDNO4',
            value: 'Voter ID'
        }
    ]
    proposal: any = {
        first_name: '',
        middle_name: '',
        last_name: '',
        emailId: '',
        dob: {
            dd: '',
            mm: '',
            yy: ''
        },
        feb: true,
        height: {
            ft: '',
            inch: "0"
        },
        address: {
            house_no: "",
            area: "",
            landmark: "",
            nationality: "Indian",
            pincode: "",
            city_id: "",
            state: '',
            state_id: ""
        },
        weight: '',
        gender: "",
        occupation: '',
        occupationName: '',
        marital_status: "",
        politically_exposed: '',
        IDProofType: '',
        IDProofNumber: '',
        pan: '',
        annual_income: '',
        insured_member: [],
        nominee: {
            first_name: '',
            last_name: '',
            email: '',
            mobileno: '',
            date_of_birth: {
                dd: '',
                mm: '',
                yy: ''
            },
            age: '',
            relationship_with_proposer: '',
            relation_value: '',
            addressline1: '',
            addressline2: '',
            state: '',
            city: '',
            pincode: ''
        },
        appointee: {
            appointeeName: '',
            appointeeAge: '',
            appointeeRelationship: ''
        },
        relations: [],
        lifestyle: []
    };
    otp = '';
    //modalRef: BsModalRef;
    @ViewChild('otppopup', { static: true }) otppopup: BsModalRef
    noofyear = [];
    ABHI_PG_LANDING: string;
    CARE_PG_LANGING: string;
    userid: string;
    session_id: string;
    step2nextbtn = false;
    eldestmemberAge: any;
    eldestmemberGender: any;
    stateName: string;
    actulaRel = [];
    questions = [];
    proposer_pincode: string;
    section: string;
    savenshareObj: any = {};
    modalRef: BsModalRef;
    modalRef2: BsModalRef;
    ped_section = false;
    imdisabled = false;
    totalmember = [];
    seletedRelArr = [];
    //lifestyleFlag = false;
    dd = [];
    YY = [];
    snsBtn = 'Save & Share';
    snsdisabled = false;
    occupation = [];
    stateList = [];
    cityList = [];
    cityList2 = [];
    weight = [];
    age = [];
    areaList = [];
    appointeeAge = []
    relationShip = [];
    lifestyleList = [];
    medical_histories = [];
    medical = [];
    step1 = true;
    step2 = false;
    step3 = false;
    step4 = false; //** */
    step5 = false;
    step6 = false;
    step14 = false;
    noOfChild = 0;
    proposer_step = false;
    insured_member_step = false;
    nominee_step = false;
    medical_history_step = false;
    cover_type_slug: string;
    cover_type: string;
    previewFlag = false;
    appointee = false;
    medi1 = false;
    medi2 = false;
    medi3 = false;
    medi4 = false;
    medi5 = false;
    medi6 = false;
    coverageDisplay: string;
    finalPremiumDisplay: string;
    cityDisabled = true;
    nomineeRelations = [];
    btnText = 'Buy Now';
    btndisabled = true;
    plan_id: string;
    company_id: string;
    company_special_id: string;
    premium_id = '';
    fullURL: string;
    plandetails: any = {
        product_master: {},
        company: {},
        premium: {},
        coverage: {}
    };
    base_url: string;
    gst: number;
    util = new Utils;
    avlbPincodes = [];
    genericrelationShip = [];
    carebody: any = {};
    responsejson = {};
    construct: any;
    agee: any;
    city: any;
    gender: any;
    coverage: string;
    currentYr: number;
    abhi: any = {};
    carepg: any = {};
    step: string;
    linkclicked = false;
    backbtnhidefromapp = '0';
    countmedicalQus = 0;
    medical_questions: any = [];


    constructor(
        private commonService: CommonService,
        private _location: Location,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        private ngxXml2jsonService: NgxXml2jsonService,
        private modalService: BsModalService,
        private ngxLoader: NgxUiLoaderService
    ) { }

    backClicked() {
        //this._location.back();
        this.router.navigate([`quotes`], { queryParams: { age: this.agee, construct: this.construct, gender: this.gender, city: this.city, coverage: this.coverage } });
    }

    onpincodeSelect(event) {
        console.log('Pincode : ', event)
        this.proposal.address.pincode = event.target.value
    }

    async ngOnInit() {
        //console.log(moment())
        $("html, body").animate({ scrollTop: 0 }, 600);
        this.userid = localStorage.getItem("getquoteuserID") || '';
        this.session_id = localStorage.getItem("session_id") || '';
        this.backbtnhidefromapp = localStorage.getItem('backbtnhidefromapp') || '0';
        this.fullURL = constant.hosting_endpoint + this.router.url + '&sess=' + this.session_id;
        //this.fullURL = this.router.url;
        var d = new Date();
        this.ABHI_PG_LANDING = constant.abhi_landing_page_url;
        this.CARE_PG_LANGING = constant.religare_payment_url;
        this.currentYr = d.getFullYear();
        //const random = this.util.randomString(15);
        this.base_url = constant.api_endpoint;
        this.gst = constant.gstval;
        let tab = localStorage.getItem('tab');
        var user;
        if (tab === 'I') {
            user = JSON.parse(localStorage.getItem('userData1'));
        } else if (tab === 'F') {
            user = JSON.parse(localStorage.getItem('userData2'));
        } else {
            user = JSON.parse(localStorage.getItem('userData3'));
        }
        this.lifestyleList = await this.getLifeStyle();
        for (let i = 1; i <= 31; i++) {
            if (i.toString().length === 1) {
                this.noofyear.push(i + 1)
                this.dd.push('0' + i);
            } else {
                this.dd.push(i);
            }

        }
        for (let x = 1; x <= 100; x++) {
            this.weight.push(x);
            this.age.push(x);
            this.YY.push((this.currentYr - 90) + x);
            if (x > 18) {
                this.appointeeAge.push(x);
            }
        }
        // this.route.params.subscribe(params => {
        //   this.plan_id = params['plan'];
        //   console.log(params)

        // });
        this.route.queryParams.subscribe(async params => {
            this.plan_id = params['plan_id'];
            this.premium_id = params['premium_id'];
            this.construct = params['c'];
            this.agee = params['age'];
            this.city = params['city'];
            this.gender = params['gender'];
            this.coverage = params['coverage'];
            this.company_special_id = params['company'];
            this.cover_type_slug = (params['c'] != '1a') ? 'family-floater' : 'individual';
            await this.planDetails();
            if (params['sess'] && params['step']) {
                console.log('===================From Saved Session========================');
                localStorage.removeItem("session_id"); //remove previous saved session
                this.step = params['step'];
                this.linkclicked = true;
                localStorage.setItem("session_id", params['sess']);  // set saved session
                this.getSessionDetails(params['sess'])
                if (this.step === 'one') {
                    this.step1 = true;
                    this.step2 = false;
                    this.step3 = false;
                    this.step4 = false;
                    this.step6 = false;
                    //this.proposer_step = true;
                } else if (this.step === 'two') {
                    this.step1 = false;
                    this.step2 = true;
                    this.step3 = false;
                    this.step4 = false;
                    this.step6 = false;
                    this.proposer_step = true;
                } else if (this.step === 'three') {
                    this.step1 = false;
                    this.step2 = false;
                    this.step3 = true;
                    this.step4 = false;
                    this.step6 = false;
                    this.proposer_step = true;
                    this.insured_member_step = true;
                } else if (this.step === 'four') {
                    //this.getQuestionarries()
                    this.step1 = false;
                    this.step2 = false;
                    this.step3 = false;
                    this.step4 = true;
                    this.step6 = false;
                    this.proposer_step = true;
                    this.insured_member_step = true;
                    this.nominee_step = true;
                    //this.medical_history_step = true;
                } else if (this.step === 'five') {
                    this.step1 = false;
                    this.step2 = false;
                    this.step3 = false;
                    this.step4 = false;
                    this.step6 = true;
                    this.proposer_step = true;
                    this.insured_member_step = true;
                    this.nominee_step = true;
                    this.medical_history_step = true;
                } else {
                    this.step1 = true;
                    this.step2 = false;
                    this.step3 = false;
                    this.step4 = false;
                    this.step6 = false;
                    this.proposer_step = true;
                    this.insured_member_step = true;
                    this.nominee_step = true;
                    this.medical_history_step = true;
                }
            } else {
                console.log('========New Session============');
                this.populateInsuredMemberForm()
                let userArr = user.userName.split(" ");
                this.proposal.first_name = userArr[0];
                this.savenshareObj.emailId = user.emailId;
                this.savenshareObj.contactNumber = user.contactNumber;

                //set pincodes
                for (let i = parseInt(user.from_pincode); i <= parseInt(user.to_pincode); i++) {
                    this.avlbPincodes.push(i.toString())
                }
                //console.log("avlbPincodes : ", this.avlbPincodes)

                //this.proposal.insured_member[0]['first_name'] = userArr[0];
                if (userArr.length == 3) {
                    this.proposal.middle_name = userArr[1];
                    this.proposal.last_name = userArr[2];
                    //this.proposal.insured_member[0]['middle_name'] = userArr[1];
                    //this.proposal.insured_member[0]['last_name'] = userArr[2];
                } else if (userArr.length == 2) {
                    this.proposal.last_name = userArr[1];
                    //this.proposal.insured_member[0]['last_name'] = userArr[1];
                }

                this.proposal.emailId = user.emailId;
                this.proposal.contactNumber = user.contactNumber;
                this.proposal.address.state_id = user.state_id;
                this.proposal.dob.yy = this.currentYr - this.agee;
                this.welcomeFormFillingSMS();
                this.getstateList();
                this.proposal.gender = (user.gender == '1') ? 'MALE' : 'FEMALE';
                if (user.state_id) {
                    this.cityList = [];
                    const url = `/cityRoute/list/1/0/4/?search_key=&state_id=${user.state_id}`;
                    this.commonService.get(url).subscribe(res => {
                        this.cityList = res.data.rows;
                        console.log(this.cityList)
                        this.proposal.address.city_id = user.city_id;
                        this.proposal.address.city = res.data.rows.filter(el => {
                            return el.id === this.proposal.address.city_id
                        })[0]['city_name'];
                    }, err => {
                        const errorMessage = err && err.message || 'Something goes wrong';
                        this.toastr.error(errorMessage, 'Error');
                    })
                }
                //console.log(this.proposal.insured_member)
            }

            //let relationships = this.commonService.relationshipWithProposer();

        });


        //this.ped_section = user.ped;

    }

    async populateInsuredMemberForm() {
        let proposalform = this.commonService.relations().filter(el => el.value == this.construct);
        this.noOfChild = proposalform[0]['nochild'];
        this.medical_questions = await this.getMedicalQuestionarries();

        //let totalmember = proposalform[0]['totalmember'];
        for (var member of proposalform[0]['form']) {
            console.log(member)
            let yyyy = []
            if (member.membertype == '1c') {
                var startingYr = (this.currentYr - 25);
                for (let x = 1; x <= 25; x++) {
                    yyyy.push(startingYr + x)
                }

            } else {
                var Yr = (this.currentYr - 90);
                for (let x = 1; x <= 90; x++) {
                    yyyy.push(Yr + x)
                }
            }
            //console.log(member.membertype, ":", yyyy)
            this.proposal.insured_member.push(
                {
                    relationship_with_user: '',
                    memberDef: member.memberTypeDef,
                    membertype: member.membertype,
                    relArr: member.relations,
                    dateOfBirthYear: yyyy,
                    first_name: '',
                    middle_name: '',
                    last_name: '',
                    weight: '',
                    occupation: '',
                    marital_status: (member.membertype == '1c') ? 'Single' : '',
                    maritaldropdown: (member.membertype == '1c') ? true : false,
                    gender: '',
                    height: {
                        ft: '', inch: '0'
                    },
                    date_of_birth: {
                        dd: '',
                        mm: '',
                        yy: ''
                    },
                    emailId: '',
                    contactNumber: '',
                    IDProofType: '',
                    IDProofNumber: '',
                    isdisabled: false,
                    has_ped: false,
                    medical_questions: this.medical_questions.map(el => {
                        return {
                            pqm_id: el.pqm_id,
                            question_code: el.question_code,
                            existing_since_code: el.existing_since_code,
                            question_title: el.question_title,
                            question_desc: el.question_desc,
                            criticalIllness: 'false',
                            isPersonalAccidentApplicable: (this.construct == '1a') ? 'true' : 'false',
                            illness: '',
                            ManualLabour: '',
                            WinterSports: '',
                            eyeProblem: 'No',
                            kidneyProblem: 'No',
                            nonHealing: 'No',
                            response: '',
                            additional_info: '',
                            existing_since: {
                                mm: '', yy: ''
                            },
                            diabetes: {
                                diabetesMellitus: '',
                                insulinProblem: '',
                                insulinFrom: '',
                                bloodSugar: '',
                                serumCreatinine: '',
                                hba1c: ''
                            },
                        }
                    }),
                    medical_history: this.medical_histories.map(e => {
                        return {
                            medical_history_id: e.medical_history_id,
                            health_declined: e.health_declined,
                            medical_code: e.medical_code,
                            medical_history_name: e.medical_history_name,
                            recovery_status: '',
                            symptom_start_date: { mm: '', yy: '' }
                        }
                    }),
                    lifestyle: this.lifestyleList.map(ls => {
                        return {
                            checked: false,
                            lifestyle_id: ls.lifestyle_id,
                            lifestyle_name: ls.lifestyle_name,
                            consumes: '',
                            numberOfYears: '',
                            interval: (ls.lifestyle_name == 'Smoke') ? 'Per day' : ((ls.lifestyle_name == 'Alcohol') ? 'Per Week' : 'Per Day'),
                            placeholder: (ls.lifestyle_name == 'Smoke') ? '5' : ((ls.lifestyle_name == 'Tobacco') ? '4' : '60')
                        }
                    }),
                    mh: false,
                    marital_status_flag: true,
                    genderfreez: false,
                }
            )
        }
        console.log(this.proposal.insured_member)
    }

    getNomineeRelations() {
        if (this.company_special_id == '3') {
            this.nomineeRelations = this.commonService.abhiNomineeRel();
        } else {
            this.nomineeRelations = this.commonService.nomineeRelations();
        }
        console.log("Nominee RelationShip: ", this.nomineeRelations)
    }

    getSessionDetails(sessid) {
        this.ngxLoader.start();
        const url = `/proposalFormRoute/user_session_details/${sessid}?plan_id=${this.plan_id}`;
        this.commonService.get(url).subscribe(res => {
            this.ngxLoader.stop();
            console.log("Session Detail : ", res);
            let data = res.data;
            let dobArr = data.date_of_birth.split("-");
            let occ_code = this.occupation.find(e => e.oc_id === data.occupation);
            let height = data.height.split(".");
            //console.log(occ_code);
            this.savenshareObj.emailId = data.emailId;
            this.savenshareObj.contactNumber = data.contactNumber;
            this.userid = data.userId;
            this.proposal.first_name = data.first_name;
            this.proposal.last_name = data.last_name;
            this.proposal.middle_name = data.middle_name;
            this.proposal.emailId = data.emailId;
            this.proposal.occupation = (occ_code) ? occ_code.occupation_code : '';
            this.proposal.contactNumber = data.contactNumber;
            this.proposal.height = {
                ft: height[0],
                inch: height[1]
            },
                this.proposal.weight = data.weight
            this.proposal.dob = {
                dd: dobArr[2],
                mm: dobArr[1],
                yy: dobArr[0],
            }
            this.proposal.annual_income = data.annual_income;
            this.proposal.address.state_id = data.ul[0]['state_id'];
            this.getstateList();
            this.proposal.address.area = data.ul[0]['area'];
            this.proposal.gender = (data.gender == '1') ? "MALE" : "FEMALE";
            this.proposal.address.pincode = data.ul[0]['pincode'];
            this.proposal.address.house_no = data.ul[0]['house_no'];
            this.proposal.address.landmark = data.ul[0]['landmark'];
            if (this.company_special_id != '2' && this.proposal.address.state_id) {
                this.getCityByState(data.ul[0]['state_id'], data.ul[0]['city_id'])
            } else if (this.company_special_id == '2') {
                this.getCitybyPincodeforStar(this.proposal.address.pincode, data.ul[0]['city_id'])
            }
            this.proposal.marital_status = data.marital_status;
            this.proposal.marital_status = data.marital_status;
            let proposalform = this.commonService.relations().filter(el => el.value == this.construct);
            if (data.relationships.length > 0) {
                this.proposal.insured_member = data.relationships.map((e, index) => {
                    //console.log(e)
                    let dob = e.date_of_birth.split("-");
                    let age = this.currentYr - parseInt(dob[0]);
                    let yr = [];
                    for (let x = 1; x <= age; x++) {
                        yr.push(parseInt(dob[0]) + x)
                    }
                    //console.log(this.occupation)
                    let occ_code = this.occupation.find(v => v.oc_id === e.occupation_id);
                    //console.log(occ_code)
                    let height = e.height.split(".");
                    e['relArr'] = [{ key: 'self', value: 'Self' }, { key: 'spouse', value: 'Spouse' }, { key: 'father', value: 'Father' }, { key: 'mother', value: 'Mother' }, { key: 'mother-in-law', value: 'Mother-In-Law' }, { key: 'father-in-law', value: 'Father-In-Law' }, { key: 'son', value: 'Son' }, { key: 'daughter', value: 'Daughter' }],
                        e['relationship_with_user'] = e.relationship_with_user
                    e['dateOfBirthYear'] = this.YY
                    e['date_of_birth'] = {
                        dd: dob[2],
                        mm: dob[1],
                        yy: dob[0]
                    };
                    e['height'] = {
                        'ft': height[0],
                        'inch': height[1]
                    }
                    e['lifestyle'] = e.user_lifestyle_map.map(ls => {
                        return {
                            checked: true,
                            lifestyle_id: ls.lifestyle_id,
                            lifestyle_name: ls.lifestyle.lifestyle_name,
                            consumes: ls.consumption_per_day,
                            numberOfYears: ls.number_of_years,
                            interval: (ls.lifestyle_name == 'Smoke') ? 'Per day' : ((ls.lifestyle_name == 'Alcohol') ? 'Per Week' : 'Per Day'),
                            placeholder: (ls.lifestyle_name == 'Smoke') ? '5' : ((ls.lifestyle_name == 'Tobacco') ? '4' : '60')
                        }
                    })
                    e['occupation'] = (occ_code) ? occ_code.occupation_code : ''
                    e['has_ped'] = e.has_ped || true,
                        e['memberDef'] = proposalform[0].form[index].memberTypeDef;
                    e['membertype'] = proposalform[0].form[index].membertype;
                    e['medical_history'] = e.user_med_hist.map(e => {
                        return {
                            medical_history_id: e.medical_history_id,
                            health_declined: e.health_declined,
                            formvisible: (e.recovery_status) ? true : false,
                            current_status: e.recovery_status,
                            medical_history_name: e.medical_history.medical_history_nam,
                            symptom_start_date: { mm: e.symptom_start_date.split("-")[1], yy: e.symptom_start_date.split("-")[0] }
                        }
                    });
                    e['medical_questions'] = e.user_med_qa.map(el => {
                        return {
                            pqm_id: el.plan_question_mapping.pqm_id,
                            question_code: el.plan_question_mapping.question_code,
                            question_title: el.plan_question_mapping.question_title,
                            question_desc: el.plan_question_mapping.question_desc,
                            [el.question_code]: el.answer
                        }
                    });
                    e['occupationName'] = [{
                        occupation_name: e.occupation_master.occupation_name
                    }];
                    e['symptomStartYr'] = yr;
                    return e
                });
                this.countmedicalQus = this.proposal.insured_member[0]['user_med_qa'].length
                console.log("Final Obj ==>", this.proposal.insured_member['medical_questions'])
            } else {
                this.populateInsuredMemberForm()
            }
            //console.log("==>>", this.proposal.insured_member)
            if (data.nominee.length > 0) {
                this.proposal.nominee.first_name = data.nominee[0]['first_name'];
                this.proposal.nominee.last_name = data.nominee[0]['last_name'];
                this.proposal.nominee.age = data.nominee[0]['age'];
                this.proposal.nominee.relationship_with_proposer = data.nominee[0]['relationship_with_proposer'];
                if (this.proposal.nominee.age < 18) {
                    this.appointee = true;
                }
                if (data.appointee.length > 0) {
                    this.proposal.appointee.appointeeName = data.appointee[0]['first_name'];
                    this.proposal.appointee.appointeeAge = data.appointee[0]['age'];
                    this.proposal.appointee.appointeeRelationship = data.appointee[0]['relationship_with_proposer'];
                }
            }

        }, err => {
            const errorMessage = err && err.message || 'Something goes wrong';
            this.toastr.error(errorMessage, 'Error');
        })
    }

    getCityByState(stateid, cityid) {
        this.cityList = [];
        const url = `/cityRoute/list/1/0/4/?search_key=&state_id=${stateid}`;
        this.commonService.get(url).subscribe(res => {
            this.cityList = res.data;
            this.proposal.address.city_id = cityid;
            let cityName = res.data.rows.filter(el => {
                return el.id === this.proposal.address.city_id
            })
            this.proposal.address.city = (cityName.length > 0) ? cityName[0]['city_name'] : ''
        }, err => {
            const errorMessage = err && err.message || 'Something goes wrong';
            this.toastr.error(errorMessage, 'Error');
        })
    }

    getLifeStyle(): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            const url = `/lifestyleRoute/list?status=1&page&order_by=2`;
            this.commonService.get(url).subscribe(res => {
                console.log(res)
                resolve(res.data.rows)
            }, err => {
                const errorMessage = err && err.message || 'Something goes wrong';
                this.toastr.error(errorMessage, 'Error');
            })
        });
        return promise;
    }

    changeRelation(e, index) {
        let val = e.target.value;
        if (index === 0) {
            this.seletedRelArr = [];
            console.log(this.seletedRelArr)
        }
        if (val == 'self') {
            console.log(this.proposal)
            this.proposal.insured_member[index].isdisabled = true;
            this.proposal.insured_member[index]['first_name'] = this.proposal.first_name;
            this.proposal.insured_member[index]['middle_name'] = this.proposal.middle_name;
            this.proposal.insured_member[index]['last_name'] = this.proposal.last_name;
            this.proposal.insured_member[index]['occupation'] = this.proposal.occupation;
            this.proposal.insured_member[index]['marital_status'] = this.proposal.marital_status;
            this.proposal.insured_member[index]['gender'] = this.proposal.gender;
            this.proposal.insured_member[index]['date_of_birth']['dd'] = this.proposal.dob.dd;
            this.proposal.insured_member[index]['date_of_birth']['mm'] = this.proposal.dob.mm;
            this.proposal.insured_member[index]['date_of_birth']['yy'] = this.proposal.dob.yy;
            this.proposal.insured_member[index]['height']['ft'] = this.proposal.height.ft;
            this.proposal.insured_member[index]['height']['inch'] = this.proposal.height.inch;
            this.proposal.insured_member[index]['weight'] = this.proposal.weight;
            this.proposal.insured_member[index]['emailId'] = this.proposal.emailId;
            this.proposal.insured_member[index]['contactNumber'] = this.proposal.contactNumber;
            this.proposal.insured_member[index]['IDProofType'] = this.proposal.IDProofType;
            this.proposal.insured_member[index]['IDProofNumber'] = this.proposal.IDProofNumber;
        } else {
            this.proposal.insured_member[index].isdisabled = false;
            this.proposal.insured_member[index]['gender'] = '';
            this.proposal.insured_member[index]['marital_status'] = '';
            this.proposal.insured_member.isdisabled = false;
            this.proposal.insured_member[index]['first_name'] = '';
            this.proposal.insured_member[index]['middle_name'] = '';
            this.proposal.insured_member[index]['last_name'] = '';
            this.proposal.insured_member[index]['occupation'] = '';
            this.proposal.insured_member[index]['marital_status'] = '';
            this.proposal.insured_member[index]['gender'] = '';
            this.proposal.insured_member[index]['date_of_birth']['dd'] = '';
            this.proposal.insured_member[index]['date_of_birth']['mm'] = '';
            this.proposal.insured_member[index]['date_of_birth']['yy'] = '';
            this.proposal.insured_member[index]['height']['ft'] = '';
            this.proposal.insured_member[index]['height']['inch'] = '';
            this.proposal.insured_member[index]['weight'] = '';
            this.proposal.insured_member[index]['emailId'] = '';
            this.proposal.insured_member[index]['contactNumber'] = '';
            this.proposal.insured_member[index]['IDProofType'] = '';
            this.proposal.insured_member[index]['IDProofNumber'] = '';
        }
        let relMatch = this.relationShip.filter(e => e.relation_slug == val);
        if (relMatch.length <= 0) {
            this.util.errorDialog("This relation is not available");
            this.proposal.insured_member[index]['relationship_with_user'] = '';
        }
        console.log(relMatch)
        this.proposal.insured_member[index]['relationship_with_proposer'] = (relMatch.length > 0) ? relMatch[0]['relation_code'] : null;
        this.seletedRelArr[index] = val;
        console.log(this.seletedRelArr)

        if (this.construct == '2a') {
            if (this.proposal.insured_member[0]['relationship_with_user'] == 'self') {
                this.proposal.insured_member[1]['relArr'] = [{ key: 'spouse', value: 'Spouse' }];
            } else if (this.proposal.insured_member[0]['relationship_with_user'] == 'spouse') {
                this.proposal.insured_member[1]['relArr'] = [{ key: 'self', value: 'Self' }];
            } else if (this.proposal.insured_member[0]['relationship_with_user'] == 'father') {
                this.proposal.insured_member[1]['relArr'] = [{ key: 'mother', value: 'Mother' }];
            } else if (this.proposal.insured_member[0]['relationship_with_user'] == 'mother') {
                this.proposal.insured_member[1]['relArr'] = [{ key: 'father', value: 'Father' }];
            } else if (this.proposal.insured_member[0]['relationship_with_user'] == 'father-in-law') {
                this.proposal.insured_member[1]['relArr'] = [{ key: 'mother-in-law', value: 'Mother-in-Law' }];
            } else if (this.proposal.insured_member[0]['relationship_with_user'] == 'mother-in-law') {
                this.proposal.insured_member[1]['relArr'] = [{ key: 'father-in-law', value: 'Father-in-Law' }];
            }
        } else {
            // =======Remove Selected Insured members relation (ADULT)===============

            this.proposal.insured_member.forEach((mem, i) => {
                let IDProofNam = this.IDProofArr.find(el => el.id == mem.IDProofType);
                if (IDProofNam) {
                    this.proposal.insured_member[i]['IDProofName'] = this.IDProofArr.find(el => el.id == mem.IDProofType)['value']
                }
                if (i > index && mem.membertype == '1a' && (this.noOfChild > 0)) {
                    let rels = [{ key: 'self', value: 'Self' }, { key: 'spouse', value: 'Spouse' }]
                    this.proposal.insured_member[i]['relArr'] = rels.filter((el) => {
                        if (this.proposal.marital_status == 'Single') {
                            return el.key != 'spouse' && !this.seletedRelArr.includes(el.key)
                        } else {
                            return !this.seletedRelArr.includes(el.key)
                        }
                    })
                } else if (i > index && mem.membertype == '1c' && (this.noOfChild > 0)) {
                    // =======SPECIAL CASE FRO CHILD===============
                    this.proposal.insured_member[i]['relArr'] = [{ key: 'son', value: 'Son' }, { key: 'daughter', value: 'Daughter' }]
                }
            })
        }


        if (val == 'spouse') {
            if (this.proposal.gender == 'MALE') {
                this.proposal.insured_member[index]['gender'] = 'FEMALE';
                this.proposal.insured_member[index]['marital_status'] = 'Married';
                this.proposal.insured_member[index]['maritaldropdown'] = true;
                this.proposal.insured_member[index]['genderfreez'] = true;
            } else {
                this.proposal.insured_member[index]['gender'] = 'MALE';
                this.proposal.insured_member[index]['genderfreez'] = true;
                this.proposal.insured_member[index]['marital_status'] = 'Married';
                this.proposal.insured_member[index]['maritaldropdown'] = true;
            }
        } else {
            this.proposal.insured_member[index]['genderfreez'] = false;
            this.proposal.insured_member[index]['maritaldropdown'] = false;
        }

        if (val == 'son') {
            this.proposal.insured_member[index]['marital_status'] = 'Single';
            this.proposal.insured_member[index]['gender'] = 'MALE';
            this.proposal.insured_member[index]['genderfreez'] = true;
            this.proposal.insured_member[index]['maritaldropdown'] = true;
        } else if (val == 'daughter') {
            this.proposal.insured_member[index]['marital_status'] = 'Single';
            this.proposal.insured_member[index]['gender'] = 'FEMALE';
            this.proposal.insured_member[index]['genderfreez'] = true;
            this.proposal.insured_member[index]['maritaldropdown'] = true;
        }

        if (val == 'father' || val == 'father-in-law' || val == 'grand-father') {
            this.proposal.insured_member[index]['gender'] = 'MALE';
            this.proposal.insured_member[index]['genderfreez'] = true;
            this.proposal.insured_member[index]['marital_status'] = 'Married';
        } else if (val == 'mother' || val == 'mother-in-law' || val == 'grand-mother') {
            this.proposal.insured_member[index]['gender'] = 'FEMALE';
            this.proposal.insured_member[index]['genderfreez'] = true;
            this.proposal.insured_member[index]['marital_status'] = 'Married';
        }
    }

    getstateList() {
        const url = `/cityRoute/liststate/1/0/1/?search_key=`;
        this.commonService.get(url).subscribe(res => {
            this.stateList = res.data;
            this.stateName = res.data.filter(el => {
                return el.state_id === this.proposal.address.state_id
            })[0]['state_name'];
            if (this.stateName) {
                this.proposal.address.state = this.stateName
            } else {
                alert("State Name not found")
            }
            console.log("State Name : ", this.proposal.address.state);
        }, err => {
            const errorMessage = err && err.message || 'Something goes wrong';
            this.toastr.error(errorMessage, 'Error');
        })
    }

    getcityList(e) {
        this.cityList = [];
        const url = `/cityRoute/list/1/0/4/?search_key=&state_id=${e.target.value}`;
        this.commonService.get(url).subscribe(res => {
            console.log("City List : ", res)
            this.cityList = res.data;
            this.proposal.address.city = res.data.rows.filter(el => {
                return el.city_id === this.proposal.address.city_id
            })[0]['city_name'];
        }, err => {
            const errorMessage = err && err.message || 'Something goes wrong';
            this.toastr.error(errorMessage, 'Error');
        })
    }

    getcityListNominee(e) {
        this.proposal.nominee.stateName = this.stateList.filter(el => {
            return el.state_id === e.target.value
        })[0]['state_name'];
        this.cityList2 = [];
        const url = `/cityRoute/list/1/0/4/?search_key=&state_id=${e.target.value}`;
        this.commonService.get(url).subscribe(res => {
            console.log("City List2 : ", res)
            this.cityList2 = res.data.rows;
        }, err => {
            const errorMessage = err && err.message || 'Something goes wrong';
            this.toastr.error(errorMessage, 'Error');
        })
    }

    getOccupationList(): Promise<any> {
        return new Promise((resolve, reject) => {
            var url = '';
            if (this.company_special_id == '1') {
                url = `/companyRoute/listOccupation?status=1&page=0&order_by=5&search=&company_id=${this.company_id}`;
            } else {
                url = `/companyRoute/listOccupation?status=1&page=0&order_by=5&search=&company_id=${this.company_id}&plan_id=${this.plan_id}&cover_type_slug=${this.cover_type_slug}`;
            }
            this.commonService.get(url).subscribe(res => {
                this.occupation = res.data.rows;
                resolve(this.occupation);
            }, err => {
                const errorMessage = err && err.message || 'Something goes wrong';
                this.toastr.error(errorMessage, 'Error');
                reject(errorMessage)
            })
        });
    }

    getRelationShip() {
        const url = `/companyRoute/listRelation?status=1&page=0&order_by=1&search&company_id=${this.company_id}&plan_id=${this.plan_id}&cover_type_slug=${this.cover_type_slug}`;
        //const url = `/companyRoute/listRelation?status=1&page=0&order_by=1&search=&company_id=${this.company_id}`;
        this.commonService.get(url).subscribe(res => {
            this.relationShip = res.data.rows;
            console.log("Relations : ", res)
        }, err => {
            const errorMessage = err && err.message || 'Something goes wrong';
            this.toastr.error(errorMessage, 'Error');
        })
    }

    getGenericRelationShip() {
        this.genericrelationShip = this.commonService.relationshipWithProposer();
    }

    getMedicalHistory(): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            const url = `/medicalHistoryRoute/list?status=1&page&order_by&company_id=${this.company_id}`;
            this.commonService.get(url).subscribe(res => {
                this.medical_histories = res.data.rows.map(med => {
                    return {
                        'medical_history_id': med.medical_history_id,
                        'medical_history_name': med.medical_history_name,
                        'questionSetCd': med.set_code_name,
                        'questionCd': med.medical_code,
                        'questionCd_existing_since': med.existing_since,
                        'symptom_start_date': { dd: '', mm: '', yy: '' },
                        'current_status': '',
                        'health_declined': '',
                        'formvisible': false
                    }
                });
                // this.proposal.insured_member = this.proposal.insured_member.map(im => {
                //     im['medical_history'] = this.medical_histories
                //     return im;
                // })
                resolve(this.medical_histories);
                console.log("Disease by CompanyID: ", this.medical_histories)
            }, err => {
                const errorMessage = err && err.message || 'Something goes wrong';
                this.toastr.error(errorMessage, 'Error');
                reject(errorMessage)
            })
        });
        return promise;
    }

    planDetails(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ngxLoader.start();
            let url;
            if (this.company_special_id == '3') {
                url = `/planRoute/details/${this.plan_id}?premium_id=${this.premium_id}&plan_id=${this.plan_id}`;
            } else {
                url = `/planRoute/details/${this.plan_id}?premium_id=${this.premium_id}`;
            }
            this.commonService.get(url).subscribe(async res => {
                console.log("Plan Details : ", res)
                this.ngxLoader.stop();
                this.plandetails = res.data;

                this.plan_id = res.data.plan_id;
                this.finalPremiumDisplay = this.util.currencyFormat(Math.round(res.data.premium_masters[0]['premium_with_gst']));
                this.plandetails.OneyearFinalPremium = Math.round(res.data.premium_masters[0]['premium_with_gst']);
                this.company_id = res.data.company_id;
                this.company_special_id = res.data.company_master.company_type;
                this.getNomineeRelations();
                if (this.company_special_id == '2') {
                    this.cityDisabled = false
                }
                this.plandetails.companylogo = this.base_url + '/' + res.data.company_master.files[0]['file_path'];
                this.plandetails.coverage = res.data.premium_masters[0]['sum_insured_master'];
                this.plandetails.coverage.sum_insured = Math.round(this.plandetails.coverage.sum_insured);
                this.coverageDisplay = this.util.currencyFormat(this.plandetails.coverage.sum_insured);
                this.plandetails.premium = res.data.premium_masters[0];
                this.plandetails.premium.premium_price = this.util.currencyFormat(Math.round(this.plandetails.premium.premium_price));
                this.plandetails.premium.gst_amount = this.util.currencyFormat(Math.round(this.plandetails.premium.gst_amount));
                this.plandetails.premium_term = res.data.premium_masters[0]['premium_term'];
                this.cover_type = res.data.coverage.si_code_name;
                await this.getMedicalHistory();
                await this.getOccupationList();
                this.getGenericRelationShip();
                this.getRelationShip();
                resolve(res.data)
            }, err => {
                const errorMessage = err && err.message || 'Something goes wrong';
                this.toastr.error(errorMessage, 'Error');
            })
        });
    }

    previewSMS() {
        const shortenURL = this.commonService.createbitlyshortlink(JSON.stringify({ "long_url": this.fullURL + '&step=five', "domain": "bit.ly" })).subscribe(res => {
            console.log("SMS RES : ", res)
            let link = res.link
            const body = {
                "contactNumber": this.proposal.contactNumber,
                "clickLink": link
            };
            const url = `/smsRoute/preview`;
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

    goto(step) {
        var regex = constant.emailvalidateregex;
        var mobileNoregex = constant.mobilevalidateregex;
        if (step == 2) {
            //-----------Proposer--------------
            this.step2nextbtn = false;
            this.seletedRelArr = [];

            //this.proposal.insured_member[0]['relationship_with_user'] = '';
            this.proposal.insured_member = this.proposal.insured_member.map((el) => {
                if (this.noOfChild > 0 && el.membertype == '1a') {
                    el['relArr'] = [{ key: 'self', value: 'Self' }, { key: 'spouse', value: 'Spouse' }]
                } else if (this.noOfChild == 0 && el.membertype == '1a') {
                    if (this.proposal.marital_status == 'Single') {
                        el['relArr'] = el.relArr.filter(e => e.key != 'spouse');
                    } else if (this.proposal.marital_status == 'Married') {
                        el['relArr'] = this.commonService.relationshipWithProposer()
                    }
                } else {
                    el['relArr'] = el.relArr
                }
                return el;
            });

            if (!this.stateName) {
                this.util.errorDialog("State name is undefined", "Error");
                return;
            }

            let panregex = constant.pannumberregex;
            console.log(this.avlbPincodes.includes(this.proposal.address.pincode))
            if (this.proposal.first_name == '') {
                this.toastr.error("Please enter your First Name", "Error");
            } else if (!constant.onlyalphabetregex.test(this.proposal.first_name)) {
                this.toastr.error('Only alphabet allowed in First Name', "Error");
                return false;
            } else if (this.proposal.last_name === '') {
                this.toastr.error("Please enter your Last Name", "Error");
            } else if (!constant.onlyalphabetregex.test(this.proposal.last_name)) {
                this.toastr.error('Only alphabet allowed in Last Name', "Error");
                return false;
            } else if (this.proposal.emailId == '') {
                this.toastr.error("Please enter an email address", "Error");
            } else if (!regex.test(this.proposal.emailId)) {
                this.toastr.error("Please enter a valid email address", "Error");
            } else if (!mobileNoregex.test(this.proposal.contactNumber)) {
                this.toastr.error('Please enter a valid 10 digit mobile number', "Error");
                return false;
            } else if (!this.proposal.dob.dd || !this.proposal.dob.mm || !this.proposal.dob.yy) {
                this.toastr.error("Date Of birth is required", "Error");
            } else if (!this.proposal.marital_status) {
                this.toastr.error("Select your Marital Status", "Error");
            } else if (!this.proposal.gender) {
                this.toastr.error("Select your Gender", "Error");
            } else if (!this.proposal.height.ft) {
                this.toastr.error("Select your Height", "Error");
            } else if (!this.proposal.weight) {
                this.toastr.error("Select your Weight", "Error");
            } else if ((this.noOfChild > 0) && (this.proposal.marital_status == 'Single')) {
                this.toastr.error("Wrong Marital Status", "Error");
            } else if (!this.proposal.annual_income) {
                this.toastr.error("Annual Income is required", "Error");
            } else if (!this.proposal.pan && this.plandetails.OneyearFinalPremium >= 50000) {
                this.toastr.error("PAN No is required", "Error");
            } else if (this.plandetails.OneyearFinalPremium >= 50000 && this.proposal.pan && !panregex.test(this.proposal.pan)) {
                this.toastr.error("Valid PAN No is required", "Error");
            } else if (this.company_special_id != '1' && !this.proposal.occupation) {
                this.toastr.error("Occupation is required", "Error");
            } else if (this.company_special_id == '4' && !this.proposal.IDProofType) {
                this.toastr.error("IDProofType is required", "Error");
            } else if (this.company_special_id == '4' && !this.proposal.IDProofNumber) {
                this.toastr.error("IDProofNumber is required", "Error");
            } else if (!this.proposal.address.house_no) {
                this.toastr.error("Enter your Flat,House No, Street", "Error");
            } else if (!this.proposal.address.area) {
                this.toastr.error("Enter your Area", "Error");
            } else if (!this.proposal.address.pincode) {
                this.toastr.error("Enter your pincode", "Error");
            } else if (!this.linkclicked && !this.avlbPincodes.includes(this.proposal.address.pincode)) {
                this.toastr.error("This pincode is not available in your city", "Error");
            } else if (!this.proposal.address.city_id) {
                this.toastr.error("Enter your city", "Error");
            } else if (!this.proposal.address.state_id) {
                this.toastr.error("Enter your state", "Error");
            } else if (this.construct == '2a' && this.proposal.marital_status == 'Single') {
                this.toastr.error("Wrong Marital Status", "Error");
            } else {
                const dob = `${this.proposal.dob.mm}/${this.proposal.dob.dd}/${this.proposal.dob.yy}`; //12/18/1988
                let monthdays = this.util.getDaysInMonth(this.proposal.dob.mm, this.proposal.dob.yy);
                console.log("monthdays : ", monthdays);
                const proposerAge = this.util.calculateAge(dob);
                let pannum = (this.proposal.pan) ? this.proposal.pan.split("") : [];
                console.log("PAN : ", pannum)
                if (this.proposal.pan && pannum.length > 0 && pannum[3] != 'P') {
                    this.toastr.error("Invalid Pan Number", "Error");
                } else if (this.proposal.dob.dd > monthdays) {
                    this.toastr.error("Invalid Date Of Birth", "Error");
                } else if (proposerAge < 18) {
                    this.toastr.error("Proposer should be 18+", "Error");
                } else {
                    this.activityCapture('proposer')
                }
            }
            //localStorage.setItem('proposaldata1', JSON.stringify(this.proposal));
        } else if (step == 3) {
            //-----------Insured Member------------
            this.seletedRelArr = [];
            this.actulaRel = []
            let valid = true;
            var d = new Date();
            var n = d.getFullYear();
            var maxAge = 0;
            var eldestmemberGender = '';
            let proposerAge = this.util.calculateAge(`${this.proposal.dob.mm}/${this.proposal.dob.dd}/${this.proposal.dob.yy}`);
            for (var el of this.proposal.insured_member) {
                let relName = this.relationShip.filter(e => e.relation_slug == el.relationship_with_user);
                for (let ls of el.lifestyle) {
                    //console.log("LS============>",ls)
                    if (ls.checked && (!ls.numberOfYears || !ls.consumes)) {
                        this.toastr.error(`Please Enter ${ls.lifestyle_name} Details`, "Error");
                        return
                    }
                }

                if (!el.relationship_with_user) {
                    this.toastr.error(`${el.memberDef} relationship with proposer`, "Error");
                    valid = false;
                    break;
                }
                if (relName.length > 0) {
                    this.actulaRel.push(relName[0]['relation_slug']);
                }
                if (!el.first_name || !el.last_name) {
                    this.toastr.error(`${el.memberDef} First name and Last name is required`, "Error");
                    valid = false;
                    break;
                } else if (!constant.onlyalphabetregex.test(el.first_name)) {
                    this.toastr.error('Only alphabet allowed in First Name', "Error");
                    valid = false;
                    break;
                } else if (!constant.onlyalphabetregex.test(el.last_name)) {
                    this.toastr.error('Only alphabet allowed in Last Name', "Error");
                    valid = false;
                    break;
                } else if (!el.weight) {
                    this.toastr.error(`${el.memberDef} weight is required`, "Error");
                    valid = false;
                    break;
                } else if (!el.marital_status) {
                    this.toastr.error(`${el.memberDef} marital status is required`, "Error");
                    valid = false;
                    break;
                } else if (!el.gender) {
                    this.toastr.error(`${el.memberDef} gender is required`, "Error");
                    valid = false;
                    break;
                } else if (this.company_special_id != '1' && !el.occupation) {
                    this.toastr.error(`${el.memberDef} occupation is required`, "Error");
                    valid = false;
                    break;
                } else if (!el.height.ft || !el.height.inch) {
                    this.toastr.error(`${el.memberDef} height is required`, "Error");
                    valid = false;
                    break;
                } else if (!el.date_of_birth.dd || !el.date_of_birth.mm || !el.date_of_birth.yy) {
                    this.toastr.error(`${el.memberDef} Date Of Birth is required`, "Error");
                    valid = false;
                    break;
                } else if (this.company_special_id == '4' && !el.emailId) {
                    this.toastr.error(`${el.memberDef} Email is required`, "Error");
                    valid = false;
                    break;
                } else if (this.company_special_id == '4' && !regex.test(el.emailId)) {
                    this.toastr.error("Please enter a valid email address", "Error");
                    valid = false;
                    break;
                } else if (this.company_special_id == '4' && !el.contactNumber) {
                    this.toastr.error(`${el.memberDef} contactNumber is required`, "Error");
                    valid = false;
                    break;
                } else if (this.company_special_id == '4' && !el.IDProofType) {
                    this.toastr.error(`${el.memberDef} IDProofType is required`, "Error");
                    valid = false;
                    break;
                } else if (this.company_special_id == '4' && !el.IDProofNumber) {
                    this.toastr.error(`${el.memberDef} IDProofNumber is required`, "Error");
                    valid = false;
                    break;
                }

                let dob = `${el.date_of_birth.mm}/${el.date_of_birth.dd}/${el.date_of_birth.yy}`; //mm/dd/yyyy
                var varDate = new Date(`${el.date_of_birth.yy}-${el.date_of_birth.mm}-${el.date_of_birth.dd}`).getTime();
                var today = new Date().getTime();
                let monthdays = this.util.getDaysInMonth(el.date_of_birth.mm, el.date_of_birth.yy);
                console.log("monthdays : ", monthdays);

                if (varDate > today) {
                    this.toastr.error(`Wrong date of birth choosen for ${el.memberDef}`, "Error");
                    valid = false;
                    break;
                } else if (el.date_of_birth.dd > monthdays) {
                    this.toastr.error("Invalid Date Of Birth", "Error");
                    valid = false;
                    break;
                }

                let memberAge = this.util.calcAgeinDecimal(dob);
                //alert(memberAge);

                if (memberAge > maxAge) {
                    maxAge = memberAge
                    eldestmemberGender = el.gender;
                }

                if (el.membertype == '1a' && memberAge < 18) {
                    this.toastr.error(`${el.memberDef} age should be 18+`, "Error");
                    valid = false;
                    break;
                }

                if (el.membertype == '1c' && ((memberAge > constant.childamaxAgelimit) || (memberAge < constant.childminAge))) {
                    this.toastr.error(`Child age should be between > 91 days and < 24 yrs`, "Error");
                    valid = false;
                    break;
                }

                if (el.relationship_with_user == 'father' || el.relationship_with_user == 'mother') {
                    let ageDiffwithproposer = memberAge - proposerAge;
                    if (ageDiffwithproposer < 18) {
                        this.toastr.error(`Incorrect Age of ${el.memberDef}`, "Error");
                        valid = false;
                        break;
                    }
                }
            }; // end of for loop

            this.eldestmemberAge = maxAge;
            this.eldestmemberGender = eldestmemberGender;

            console.log("valid : ", valid)
            if (valid) {
                this.checkPremium();
                // this.step1 = false;
                // this.step2 = false;
                // this.step3 = true;
                // this.insured_member_step = true
            }

        } else if (step == 4) {
            //this.getQuestionarries();
            this.proposal.insured_member = this.proposal.insured_member.map((el) => {
                let age = this.currentYr - parseInt(el.date_of_birth.yy);
                let yr = [];
                for (let x = 1; x <= age; x++) {
                    yr.push(parseInt(el.date_of_birth.yy) + x)
                }
                el['symptomStartYr'] = yr;
                return el;
            });
            if (!this.proposal.nominee.first_name || !this.proposal.nominee.last_name) {
                this.toastr.error(`Nominee first name  and last name is required`, "Error");
            } else if (!constant.onlyalphabetregex.test(this.proposal.nominee.first_name)) {
                this.toastr.error('Only alphabet allowed in First Name', "Error");
                return false;
            } else if (!constant.onlyalphabetregex.test(this.proposal.nominee.last_name)) {
                this.toastr.error('Only alphabet allowed in Last Name', "Error");
                return false;
            } else if (!this.proposal.nominee.mobileno && this.company_special_id == '3') {
                this.toastr.error(`Nominee Mobile No is required`, "Error");
            } else if (this.company_special_id == '3' && !mobileNoregex.test(this.proposal.nominee.mobileno)) {
                this.toastr.error('Please enter a valid 10 digit mobile number of nominee', "Error");
                return false;
            } else if (!this.proposal.nominee.age) {
                this.toastr.error(`Nominee age is required`, "Error");
            } else if (this.proposal.nominee.age < 18 && (!this.proposal.appointee.appointeeName || !this.proposal.appointee.appointeeAge || !this.proposal.appointee.appointeeRelationship)) {
                this.toastr.error(`Please enter all appointee details`, "Error");
            } else if (!this.proposal.nominee.relationship_with_proposer) {
                this.toastr.error(`Nominee relation is required`, "Error");
            } else if (this.proposal.nominee.relationship_with_proposer == 'Father' || this.proposal.nominee.relationship_with_proposer == 'Mother' || this.proposal.nominee.relationship_with_proposer == 'Father-in-law' || this.proposal.nominee.relationship_with_proposer == 'Mother-in-law') {
                const dob = `${this.proposal.dob.mm}/${this.proposal.dob.dd}/${this.proposal.dob.yy}`; //12/18/1988
                const proposerAge = this.util.calculateAge(dob);
                let agediff = this.proposal.nominee.age - proposerAge;
                if (agediff < 18) {
                    this.toastr.error(`Nominee age difference should be minimimum 18 years with proposer`, "Error");
                } else {
                    this.activityCapture('nominee')
                }
            } else {
                this.step1 = false;
                this.step2 = false;
                this.step3 = false;
                this.step4 = true;
                this.step5 = false;
                this.nominee_step = true;
                this.activityCapture('nominee')
            }
        } else if (step == 6) {
            if (!this.proposal.address.pincode) {
                this.toastr.error("Enter your pincode", "Error");
            } else if (!this.linkclicked && !this.avlbPincodes.includes(this.proposal.address.pincode)) {
                this.toastr.error("This pincode is not available in your city", "Error");
            } else {
                let nextStep = true;
                let personalAccidentCount = 0
                for (let im of this.proposal.insured_member) {
                    let dieseases = im.medical_history.filter(e => e.formvisible == true);
                    let personalAccident = im.medical_questions.find(el => el.question_code == 'isPersonalAccidentApplicable');
                    // if (im.has_ped && dieseases.length == 0) {
                    //     this.toastr.error("Please select disease for " + im.first_name + ' ' + im.last_name, "Error");
                    //     nextStep = false;
                    //     break;
                    // } else 
                    //alert(this.plandetails.plan_code)
                    if (im.medical_questions.length > 0 && personalAccident && personalAccident['isPersonalAccidentApplicable'] == 'true') {
                        personalAccidentCount++
                    } else if (im.has_ped && dieseases.length > 0) {
                        for (let mh of dieseases) {
                            console.log(mh)
                            if (mh.symptom_start_date.mm == '' || mh.symptom_start_date.yy == '') {
                                this.toastr.error("Please provide symptom start month & year for " + im.first_name + ' ' + im.last_name, "Error");
                                nextStep = false;
                                break;
                            } else if (mh.current_status == '') {
                                this.toastr.error("Please provide current status for " + im.first_name + ' ' + im.last_name, "Error");
                                nextStep = false;
                                break;
                            } else if (mh.health_declined == '') {
                                this.toastr.error("Please provide Health Insurance been declined status for " + im.first_name + ' ' + im.last_name, "Error");
                                nextStep = false;
                                break;
                            }
                        };
                    }

                    if (this.plandetails.plan_code == 'DIABETESIND' || this.plandetails.plan_code == 'DIABETESFMLY') {
                        //======== If Diabetes Plan selected the diabetes detail validation ===========
                        for (let qus of im.medical_questions) {
                            console.log("Diabetes Qus : ", qus)
                            // if (qus.question_code == 'isDiabetes' && (qus.diabetes.diabetesMellitus == "" || qus.diabetes.insulinProblem == "" || qus.diabetes.bloodSugar == "" || qus.diabetes.serumCreatinine == "" || qus.diabetes['HBA1C'] == "")) {
                            //     this.toastr.error("Please provide all the details of Diabetes of " + im.first_name + ' ' + im.last_name, "Error");
                            //     nextStep = false;
                            //     break;
                            // }
                            if (qus.question_code == 'isDiabetes' && qus.diabetes.insulinProblem == "true" && qus.diabetes.insulinFrom == "") {
                                this.toastr.error("Please provide insuline taking from years " + im.first_name + ' ' + im.last_name, "Error");
                                nextStep = false;
                                break;
                            }
                        }
                    }
                }

                if (this.company_special_id == '2' && this.plandetails.plan_code != 'REDCARPET' && this.plandetails.plan_code != 'REDCARPETFMLY' && this.plandetails.plan_code != 'STARYSIND' && this.plandetails.plan_code != 'STARYSFMLY' && this.plandetails.plan_code != 'MCINEW' && (personalAccidentCount > 1 || personalAccidentCount == 0)) {
                    this.toastr.error("Any one insured member should be added for personal accident benefit in this section", "Error");
                    nextStep = false;
                    return;
                }

                //======================================================
                if (nextStep) {
                    this.proposal.insured_member = this.proposal.insured_member.map(rel => {

                        rel['occupationName'] = this.occupation.filter(e => rel.occupation == e.occupation_code);

                        // rel['lifestyle'] = rel.lifestyle.filter(e => {
                        //     return e.checked && e.consumes
                        // })
                        if (rel.has_ped) {
                            this.ped_section = true;
                        }
                        console.log(rel)
                        return rel
                    })

                    this.activityCapture('medical')
                    //this.previewSMS()
                } else {
                    this.step1 = false;
                    this.step2 = false;
                    this.step3 = false;
                    this.step4 = true;
                    this.step6 = false;
                    this.medical_history_step = true;
                }
            }
        }
        console.log("Step : ", step);
        console.log(this.proposal.insured_member)
        $("html, body").animate({ scrollTop: 0 }, 600);
    }

    selectNomineeCity(e) {
        let cityObj = this.cityList2.find(c => c.hdfc_code == e.target.value);
        console.log(cityObj)
        if (cityObj) {
            this.proposal.nominee.cityName = cityObj['city_name']
        } else {
            this.proposal.nominee.city = '';
            alert('City Code doesnot exist');
            return;
        }
    }

    relationshipVal() {
        const relName = this.nomineeRelations.find(el => el.key == this.proposal.nominee.relationship_with_proposer)
        this.proposal.nominee.relation_value = relName.value
    }

    activityCapture(step) {
        if (step == 'proposer') {
            this.ngxLoader.start()
            const url = `/proposalFormRoute/add_user_details/${this.userid}`;
            const occupation = this.occupation.find((occ) => occ.occupation_code == this.proposal.occupation);
            const postData = {
                "first_name": this.proposal.first_name,
                "last_name": this.proposal.last_name,
                "date_of_birth": this.proposal.dob.yy + '-' + this.proposal.dob.mm + '-' + this.proposal.dob.dd,
                "marital_status": this.proposal.marital_status,
                "gender": this.proposal.gender,
                "session_id": this.session_id,
                "height": this.proposal.height.ft + '.' + this.proposal.height.inch,
                "weight": this.proposal.weight,
                "occupation": (occupation) ? occupation.oc_id : '',
                "pan_card_no": this.proposal.pan,
                "emailId": this.proposal.emailId,
                "contactNumber": this.proposal.contactNumber,
                "annual_income": this.proposal.annual_income,
                "plan_id": this.plan_id,
                "sms_text": "",
                "address": {
                    "house_no": this.proposal.address.house_no,
                    "area": this.proposal.address.area,
                    "landmark": this.proposal.address.landmark,
                    "pincode": this.proposal.address.pincode,
                    "city_id": this.proposal.address.city_id,
                    "state_id": this.proposal.address.state_id,
                    "nationality": this.proposal.address.nationality
                }
            };
            //console.log(postData)
            this.commonService.post(url, postData).subscribe(res => {
                console.log(res)
                this.proposer_step = true;
                this.step1 = false;
                this.step2 = true;
                this.step3 = false;
                this.step4 = false;
                this.step6 = false;
                this.ngxLoader.stop();
            }, err => {
                const errorMessage = err && err.message || 'Something goes wrong';
                this.toastr.error(errorMessage, 'Error');
            })
        } else if (step == 'insuredmembers') {
            this.ngxLoader.start()
            const url = `/proposalFormRoute/add_insured_members/${this.userid}?plan_id=${this.plan_id}&session_id=${this.session_id}`;
            const postBody = this.proposal.insured_member.map((el) => {
                const occupation = this.occupation.find((occ) => occ.occupation_code == el.occupation);
                return {
                    "session_url": "",
                    "sms_text": "",
                    "sms_contact_no": this.savenshareObj.contactNumber,
                    "share_email_id": this.savenshareObj.emailId,
                    "relationship_with_user": el.relationship_with_user,
                    "relation_code": el.relationship_with_proposer,
                    "first_name": el.first_name,
                    "middle_name": el.middle_name,
                    "last_name": el.last_name,
                    "date_of_birth": `${el.date_of_birth.yy}-${el.date_of_birth.mm}-${el.date_of_birth.dd}`,
                    "marital_status": el.marital_status,
                    "gender": el.gender,
                    "height": el.height.ft + '.' + el.height.inch,
                    "weight": el.weight,
                    "aadhar_number": "",
                    "pan_card_no": "",
                    "contactNumber": "",
                    "emailId": "",
                    "occupation_id": (occupation) ? occupation.oc_id : '',
                    "medical_history": [],
                    "medical_qa": [],
                    "lifestyle": el.lifestyle.filter(el => el.checked).map(v => {
                        return {
                            lifestyle_id: v.lifestyle_id,
                            lifestyle_type: v.lifestyle_name,
                            number_of_years: v.numberOfYears,
                            consumption_per_day: v.consumes
                        }
                    })
                }
            })
            console.log(postBody)
            this.commonService.post(url, postBody).subscribe(res => {
                console.log(res)
                this.step1 = false;
                this.step2 = false;
                this.step3 = true;
                this.step2nextbtn = true;
                this.insured_member_step = true
                this.ngxLoader.stop()

            }, err => {
                console.log(err)
            })
        } else if (step == 'nominee') {
            this.ngxLoader.start()
            const url = `/proposalFormRoute/add_nominee/${this.userid}?plan_id=${this.plan_id}&session_id=${this.session_id}&session_url=${this.fullURL + '&step=one'}`;
            const body = {
                "first_name": this.proposal.nominee.first_name,
                "last_name": this.proposal.nominee.last_name,
                "age": parseInt(this.proposal.nominee.age),
                "date_of_birth": 0,
                "sms_text": "",
                "relationship_with_proposer": this.proposal.nominee.relationship_with_proposer
            }
            if (parseInt(this.proposal.nominee.age) < 18) {
                body['appointee_data'] = [{
                    "first_name": this.proposal.appointee.appointeeName,
                    "last_name": this.proposal.appointee.appointeeName,
                    "age": (this.proposal.appointee.appointeeAge) ? parseInt(this.proposal.appointee.appointeeAge) : 0,
                    "relationship_with_proposer": this.proposal.appointee.appointeeRelationship
                }]
            } else {
                body['appointee_data'] = "";
            }
            this.commonService.post(url, body).subscribe(res => {
                console.log(res)
                this.step1 = false;
                this.step2 = false;
                this.step3 = false;
                this.step4 = true;
                this.step5 = false;
                this.nominee_step = true;
                this.ngxLoader.stop()
            }, err => {
                this.toastr.error("Something went wrong while saving nominee", "Error");
                console.log(err)
            })
        } else {
            this.ngxLoader.start()
            const url = `/proposalFormRoute/add_insured_members/${this.userid}?plan_id=${this.plan_id}`;
            const postBody = this.proposal.insured_member.map((el) => {
                console.log(el)
                return {
                    "relationship_with_user": el.relationship_with_user,
                    "first_name": el.first_name,
                    "middle_name": el.middle_name,
                    "last_name": el.first_name,
                    "date_of_birth": `${el.date_of_birth.yy}-${el.date_of_birth.mm}-${el.date_of_birth.dd}`,
                    "marital_status": el.marital_status,
                    "gender": el.gender,
                    "height": el.height.ft + '.' + el.height.inch,
                    "weight": el.weight,
                    "aadhar_number": "",
                    "pan_card_no": "",
                    "contactNumber": "",
                    "emailId": "",
                    "sms_text": "",
                    "has_ped": el.has_ped,
                    "medical_history": el.medical_history.map(m => {
                        return {
                            medical_history_id: m.medical_history_id,
                            recovery_status: m.current_status,
                            symptom_start_date: (m.symptom_start_date.mm && m.symptom_start_date.yy) ? m.symptom_start_date.yy + '-' + m.symptom_start_date.mm + '-01' : 0,
                            health_declined: m.health_declined
                        }
                    }),
                    medical_qa: el.medical_questions.map(qus => {
                        return {
                            plan_ques_map_id: qus.pqm_id,
                            question_code: qus.question_code,
                            answer: qus[qus['question_code']]
                        }
                    }),
                    "lifestyle": el.lifestyle.map(e => {
                        return {
                            lifestyle_id: e.lifestyle_id
                        }
                    })
                }
            })
            console.log(postBody)
            this.commonService.post(url, postBody).subscribe(res => {
                console.log(res)
                this.step1 = false;
                this.step2 = false;
                this.step3 = false;
                this.step4 = false;
                this.step6 = true;
                this.medical_history_step = true;
                this.ngxLoader.stop()
            }, err => {
                this.toastr.error("Something went wrong while saving Medical Questions", "Error");
                console.log(err)
            })
        }
    }

    checkPremium() {
        this.ngxLoader.start()
        if (this.company_special_id == '3') {
            let k = 0;
            this.actulaRel = this.actulaRel.map((el) => {
                if (el == 'son' || el == 'daughter') {
                    return `kid`
                } else {
                    return el
                }
            }).map(e => {
                if (e == 'kid') {
                    k++;
                    return `kid${k}`;
                } else {
                    return e;
                }
            })
        }
        console.log(this.actulaRel);
        const prem_type_disp = this.actulaRel.join("-");
        console.log(prem_type_disp);
        let url;
        this.eldestmemberAge = Math.round(this.eldestmemberAge);
        if (this.company_special_id == '3') {
            //Aditya Birla
            let gender;
            if (this.plandetails.premium.gender == "" || !this.plandetails.premium.gender) {
                gender = '';
            } else {
                gender = (this.eldestmemberGender == 'MALE' || this.eldestmemberGender == 'Male') ? '1' : '2';
            }
            let premtype = (this.construct == '1a' && prem_type_disp == 'self') ? 'individual' : prem_type_disp;
            url = `/premiumRoute/listByPlanCompanyPremDisplay?plan_id=${this.plan_id}&company_id=${this.company_id}&prem_type_disp=${premtype}&si_id=${this.plandetails.premium.si_id}&age=${this.eldestmemberAge}&gender=${gender}`;
        } else if (this.company_special_id == '2') {
            //Star
            let premtype = (this.construct == '1a' && prem_type_disp == 'self') ? '1a' : this.construct;
            url = `/premiumRoute/listByPlanCompanyPremDisplay?plan_id=${this.plan_id}&company_id=${this.company_id}&prem_type_disp=${premtype}&si_id=${this.plandetails.premium.si_id}&age=${this.eldestmemberAge}&gender=`
        } else if (this.company_special_id == '1') {
            //Religare
            let premtype = (this.construct == '1a' && prem_type_disp == 'self') ? 'individual' : this.construct;
            url = `/premiumRoute/listByPlanCompanyPremDisplay?plan_id=${this.plan_id}&company_id=${this.company_id}&prem_type_disp=${premtype}&si_id=${this.plandetails.premium.si_id}&age=${this.eldestmemberAge}&gender=`
        }

        if (url) {
            this.commonService.get(url).subscribe(res => {
                console.log("Check Premium : ", res);
                //alert('Premium will be changed..')
                this.ngxLoader.stop()
                if (res.data.length > 0) {
                    let finalPremium = res.data.filter(el => el.premium_term == this.plandetails.premium_term);
                    let finalPremiumwithGST = Math.round(finalPremium[0]['premium_with_gst']);
                    let finalPremiumwithoutGST = Math.round(finalPremium[0]['premium_price']);
                    let finalGSTAmt = Math.round(finalPremium[0]['gst_amount']);
                    //console.log("Final Premium : ", finalPremium);
                    console.log("New Premium", finalPremiumwithGST);
                    console.log("Prev Premium", this.plandetails.OneyearFinalPremium);
                    if (finalPremiumwithGST != this.plandetails.OneyearFinalPremium) {
                        this.plandetails.OneyearFinalPremium = finalPremiumwithGST;
                        this.finalPremiumDisplay = this.util.currencyFormat(finalPremiumwithGST);
                        this.plandetails.premium.premium_price = this.util.currencyFormat(finalPremiumwithoutGST);
                        this.plandetails.premium.gst_amount = this.util.currencyFormat(finalGSTAmt);
                        this.step1 = false;
                        this.step2 = true;
                        this.step3 = false;
                        this.insured_member_step = true
                        var _self = this;
                        $.confirm({
                            title: 'Premium Change Alert!',
                            content: `Based on Relations & Age Your Final Premium will be Rs. ${this.finalPremiumDisplay}`,
                            buttons: {
                                proceed: function () {
                                    //$.alert('Confirmed!');
                                    console.log('proceed')
                                    localStorage.setItem('premium_id', finalPremium[0].premium_id);
                                    _self.step1 = false;
                                    _self.step2 = false;
                                    _self.step3 = true;
                                    _self.step2nextbtn = true;
                                    _self.insured_member_step = true
                                    _self.activityCapture('insuredmembers')
                                },
                                back: function () {
                                    _self._location.back();
                                }
                            }
                        });
                    } else {
                        this.activityCapture('insuredmembers')
                    }

                } else {
                    this.step2nextbtn = true;
                    this.step1 = false;
                    this.step2 = true;
                    this.step3 = false;
                    this.insured_member_step = true
                    this.util.errorDialog(`Based on the Insured Member relationship with proposer there is no suitable premium found.`, "Alert");
                }
            }, err => {

                const errorMessage = err && err.message || 'Something goes wrong';
                this.toastr.error(errorMessage, 'Error');
            })
        } else {
            this.step1 = false;
            this.step2 = false;
            this.step3 = true;
            this.step2nextbtn = true;
            this.insured_member_step = true
            this.activityCapture('insuredmembers')
        }
    }

    back(step, flag?, index?) {
        if (flag) {
            this.previewFlag = flag
        }
        if (step == 1) {
            this.step1 = true;
            this.step2 = false;
            this.step6 = false;

        } else if (step == 2) {
            this.step2nextbtn = false;
            this.step2 = true;
            this.step1 = false;
            this.step3 = false;
            this.step6 = false;
        } else if (step == 3) {
            this.step2 = false;
            this.step1 = false;
            this.step4 = false;
            this.step3 = true;
            this.step6 = false;
        } else if (step == 4) {
            this.step2 = false;
            this.step1 = false;
            this.step3 = false;
            this.step4 = true;
            this.step5 = false;
            this.step6 = false;
        }
        $("html, body").animate({ scrollTop: 0 }, 600);
    }

    selectDisease(e, member, disease) {
        if (e.target.checked) {
            disease['formvisible'] = true;
        } else {
            disease['formvisible'] = false;
        }
        console.log(this.proposal.insured_member)
    }

    medicalHistorySelect(e, member) {
        if (e.target.checked) {
            member.has_ped = true;
        } else {
            member.has_ped = false;
            this.proposal.insured_member.forEach(member => {
                member.has_ped = false
                member.medical_questions.forEach(med => {
                    med.response = ''
                    med.existing_since = {
                        mm: '', yy: ''
                    },
                        med.diabetes = {
                            diabetesMellitus: '',
                            insulinProblem: '',
                            insulinFrom: '',
                            bloodSugar: '',
                            serumCreatinine: '',
                            hba1c: ''
                        },
                        med.illness = '',
                        med.ManualLabour = '',
                        med.WinterSports = '',
                        med.eyeProblem = 'No',
                        med.kidneyProblem = 'No',
                        med.nonHealing = 'No'
                })
            });
        }
    }

    checkLifeStyle(e, ls, i) {
        if (e.target.checked) {
            ls.checked = true
        } else {
            ls.checked = false;
            ls.consumes = '';
            ls.numberOfYears = '';
        }
    }

    star() {
        const url = `/tpRoute/care`;
        let body;
        //this.ngxLoader.start()
        if (this.plandetails.plan_code === 'COMPREHENSIVE') {
            //==========FAMILY FLOATER========
            body = {
                "APIKEY": constant.APIKEY,
                "SECRETKEY": constant.SECRETKEY,
                "policyTypeName": this.plandetails.plan_code,
                "postalCode": this.proposal.address.pincode,
                "sumInsuredId": `${this.plandetails.coverage.si_code}`,
                "schemeId": (this.plandetails.premium.hasOwnProperty('prem_type_details')) ? this.plandetails.premium.prem_type_details.premium_type_code : '1',
            };
            this.proposal.insured_member.forEach((elm, i) => {
                body['insureds[' + i + ']'] = {
                    "dob": this.datePipe.transform(`${elm.date_of_birth.yy}-${elm.date_of_birth.mm}-${elm.date_of_birth.dd}`),
                    "buyBackPED": 0
                }
            });
        } else if (this.plandetails.plan_code === 'COMPREHENSIVEIND') {
            //======INDIVIDUAL=====
            body = {
                "APIKEY": constant.APIKEY,
                "SECRETKEY": constant.SECRETKEY,
                "policyTypeName": this.plandetails.plan_code,
                "postalCode": this.proposal.address.pincode,
                "period": this.plandetails.premium_term,
            };
            this.proposal.insured_member.forEach((elm, i) => {
                body['insureds[' + i + ']'] = {
                    "dob": this.datePipe.transform(`${elm.date_of_birth.yy}-${elm.date_of_birth.mm}-${elm.date_of_birth.dd}`),
                    "sumInsuredId": `${this.plandetails.coverage.si_code}`,
                    "buyBackPED": 0
                }
            });
        } else if (this.plandetails.plan_code === 'FHONEW') {
            console.log("Family Health Optima")
            body = {
                "APIKEY": constant.APIKEY,
                "SECRETKEY": constant.SECRETKEY,
                "policyTypeName": this.plandetails.plan_code,
                "postalCode": this.proposal.address.pincode,
                "sumInsuredId": `${this.plandetails.coverage.si_code}`,
                "schemeId": (this.plandetails.premium.hasOwnProperty('prem_type_details')) ? this.plandetails.premium.prem_type_details.premium_type_code : '1',
            };
            this.proposal.insured_member.forEach((elm, i) => {
                body['insureds[' + i + ']'] = {
                    "dob": this.datePipe.transform(`${elm.date_of_birth.yy}-${elm.date_of_birth.mm}-${elm.date_of_birth.dd}`)
                }
            });
        } else if (this.plandetails.plan_code === 'MCINEW') {
            body = {
                "APIKEY": constant.APIKEY,
                "SECRETKEY": constant.SECRETKEY,
                "policyTypeName": this.plandetails.plan_code,
                "postalCode": this.proposal.address.pincode,
                "period": this.plandetails.premium_term,
            };
            this.proposal.insured_member.forEach((elm, i) => {
                body['insureds[' + i + ']'] = {
                    "dob": this.datePipe.transform(`${elm.date_of_birth.yy}-${elm.date_of_birth.mm}-${elm.date_of_birth.dd}`),
                    "sumInsuredId": `${this.plandetails.coverage.si_code}`
                }
            });
        } else if (this.plandetails.plan_code === 'REDCARPETFMLY') {
            body = {
                "APIKEY": constant.APIKEY,
                "SECRETKEY": constant.SECRETKEY,
                "policyTypeName": this.plandetails.plan_code,
                "postalCode": this.proposal.address.pincode,
                "sumInsuredId": `${this.plandetails.coverage.si_code}`,
                "period": this.plandetails.premium_term,
                "schemeId": (this.plandetails.premium.hasOwnProperty('prem_type_details')) ? this.plandetails.premium.prem_type_details.premium_type_code : '1',
            };
            this.proposal.insured_member.forEach((elm, i) => {
                body['insureds[' + i + ']'] = {
                    "dob": this.datePipe.transform(`${elm.date_of_birth.yy}-${elm.date_of_birth.mm}-${elm.date_of_birth.dd}`)
                }
            });
        } else if (this.plandetails.plan_code === 'REDCARPET') {
            body = {
                "APIKEY": constant.APIKEY,
                "SECRETKEY": constant.SECRETKEY,
                "policyTypeName": this.plandetails.plan_code,
                "postalCode": this.proposal.address.pincode,
                "period": this.plandetails.premium_term,
            };
            this.proposal.insured_member.forEach((elm, i) => {
                body['insureds[' + i + ']'] = {
                    "dob": this.datePipe.transform(`${elm.date_of_birth.yy}-${elm.date_of_birth.mm}-${elm.date_of_birth.dd}`),
                    "sumInsuredId": `${this.plandetails.coverage.si_code}`
                }
            });
        } else if (this.plandetails.plan_code === 'STARYSFMLY') {
            body = {
                "APIKEY": constant.APIKEY,
                "SECRETKEY": constant.SECRETKEY,
                "policyTypeName": this.plandetails.plan_code,
                "postalCode": this.proposal.address.pincode,
                "sumInsuredId": this.plandetails.coverage.si_code,
                "period": this.plandetails.premium_term,
                "schemeId": (this.plandetails.premium.hasOwnProperty('prem_type_details')) ? this.plandetails.premium.prem_type_details.premium_type_code : '1',
            };
            this.proposal.insured_member.forEach((elm, i) => {
                body['insureds[' + i + ']'] = {
                    "dob": this.datePipe.transform(`${elm.date_of_birth.yy}-${elm.date_of_birth.mm}-${elm.date_of_birth.dd}`),
                }
            });
        } else if (this.plandetails.plan_code === 'STARYSIND') {
            body = {
                "APIKEY": constant.APIKEY,
                "SECRETKEY": constant.SECRETKEY,
                "policyTypeName": this.plandetails.plan_code,
                "postalCode": this.proposal.address.pincode,
                "period": this.plandetails.premium_term
            };
            this.proposal.insured_member.forEach((elm, i) => {
                body['insureds[' + i + ']'] = {
                    "dob": this.datePipe.transform(`${elm.date_of_birth.yy}-${elm.date_of_birth.mm}-${elm.date_of_birth.dd}`),
                    "sumInsuredId": `${this.plandetails.coverage.si_code}`
                }
            });
        } else if (this.plandetails.plan_code === 'DIABETESIND') {
            body = {
                "APIKEY": constant.APIKEY,
                "SECRETKEY": constant.SECRETKEY,
                "policyTypeName": this.plandetails.plan_code,
                "planId": '2'
            };
            this.proposal.insured_member.forEach((elm, i) => {
                body['insureds[' + i + ']'] = {
                    "dob": this.datePipe.transform(`${elm.date_of_birth.yy}-${elm.date_of_birth.mm}-${elm.date_of_birth.dd}`),
                    "sumInsuredId": `${this.plandetails.coverage.si_code}`,
                }
            });
        } else if (this.plandetails.plan_code === 'DIABETESFMLY') {
            body = {
                "APIKEY": constant.APIKEY,
                "SECRETKEY": constant.SECRETKEY,
                "policyTypeName": this.plandetails.plan_code,
                "planId": '2',
                "sumInsuredId": this.plandetails.coverage.si_code,
                "schemeId": (this.plandetails.premium.hasOwnProperty('prem_type_details')) ? this.plandetails.premium.prem_type_details.premium_type_code : '1',
            };
            this.proposal.insured_member.forEach((elm, i) => {
                body['insureds[' + i + ']'] = {
                    "dob": this.datePipe.transform(`${elm.date_of_birth.yy}-${elm.date_of_birth.mm}-${elm.date_of_birth.dd}`)
                }
            });
            console.log(this.plandetails.plan_code, body)
        }
        const postBody = {
            type: 'POST',
            url: constant.star_endpoint + '/api/proposal/premium/calculate',
            header: {},
            data: body
        }
        console.log(body)
        //this.ngxLoader.start()
        this.commonService.postSTAR(url, postBody).subscribe(res => {
            console.log("Quick quote success : ", res)
            this.proposal.insured_member.forEach(element => {
                let mh = element.medical_history.filter(mh => {
                    return mh.formvisible && mh.medical_history_name != ''
                })
            });

            const areaDetail = this.areaList.find(area => area.areaID == this.proposal.address.area);
            //console.log(areaDetail);
            let criticalIllnessflag = false;
            let personalAccidentCount = 0;
            this.proposal.insured_member.forEach((e, i) => {
                let criticalIllness = e.medical_questions.find(mq => mq.question_code == 'criticalIllness');
                console.log("criticalIllness : ", criticalIllness);
                let personalAccident = e.medical_questions.find(el => el.question_code == 'isPersonalAccidentApplicable');
                //console.log("CRITICAL ILLNESS : ", e.medical_questions.find(mq => mq.question_code == 'criticalIllness')['criticalIllness']);
                if (criticalIllness && criticalIllness['criticalIllness'] == 'true') {
                    criticalIllnessflag = true;
                    return;
                }
                if (personalAccident && personalAccident['isPersonalAccidentApplicable'] == 'true') {
                    personalAccidentCount++
                }
            });

            console.log("criticalIllnessflag : ", criticalIllnessflag);

            // if (personalAccidentCount > 1 || personalAccidentCount == 0) {
            //     this.toastr.error("Any one insured for personal accident", "Error");
            //     return;
            // }


            let nondiabetic = 0;
            let body = {
                "APIKEY": constant.APIKEY,
                "SECRETKEY": constant.SECRETKEY,
                "policyTypeName": this.plandetails.plan_code,
                "startOn": moment().add(1, 'day').format('LL'),
                "endOn": moment().add(this.plandetails.premium_term, 'year').format('LL'),
                "schemeId": (this.plandetails.premium.hasOwnProperty('prem_type_details')) ? this.plandetails.premium.prem_type_details.premium_type_code : '1',
                "period": this.plandetails.premium_term,
                "policyCategory": "fresh",
                "proposerName": (this.proposal.middle_name) ? `${this.proposal.first_name} ${this.proposal.middle_name} ${this.proposal.last_name}` : `${this.proposal.first_name} ${this.proposal.last_name}`,
                "proposerEmail": this.proposal.emailId,
                "proposerPhone": this.proposal.contactNumber,
                "proposerAddressOne": this.proposal.address.house_no + ', ' + this.proposal.address.landmark,
                "proposerAddressTwo": areaDetail.areaName,
                "proposerAreaId": this.proposal.address.area,
                "proposerResidenceAddressOne": this.proposal.address.house_no + ', ' + this.proposal.address.landmark,
                "proposerResidenceAddressTwo": areaDetail.areaName,
                "proposerResidenceAreaId": this.proposal.address.area,
                "proposerDob": moment(this.proposal.dob.yy + '-' + this.proposal.dob.mm + '-' + this.proposal.dob.dd).format('LL'),
                "panNumber": this.proposal.pan,
                "gstTypeId": "",
                "gstIdNumber": "",
                "aadharNumber": "",
                "socialStatus": "0",
                "socialStatusBpl": "",
                "socialStatusDisabled": "0",
                "socialStatusInformal": "0",
                "socialStatusUnorganized": "0",
                "previousMedicalInsurance": "",
                "annualIncome": this.proposal.annual_income,
                "criticalIllness": criticalIllnessflag,
                "nomineeName": `${this.proposal.nominee.first_name} ${this.proposal.nominee.last_name}`,
                "nomineeAge": this.proposal.nominee.age,
                "nomineeRelationship": this.proposal.nominee.relationship_with_proposer,
                "nomineePercentClaim": "100",
                "appointeeName": this.proposal.appointee.appointeeName,
                "appointeeAge": this.proposal.appointee.appointeeAge,
                "appointeeRelationship": this.proposal.appointee.appointeeRelationship,
                "nomineeNameTwo": "",
                "nomineeAgeTwo": "",
                "nomineeRelationshipTwo": "",
                "nomineePercentClaimTwo": "",
                "appointeeNameTwo": "",
                "appointeeAgeTwo": "",
                "appointeeRelationshipTwo": ""
            };
            this.proposal.insured_member.forEach((elm, i) => {
                let height = elm.height.ft + '.' + elm.height.inch;
                let mh = elm.medical_history.filter(mh => {
                    return mh.formvisible && mh.medical_history_name != ''
                })
                let relCode = this.relationShip.find(rel => rel.relation_slug === elm.relationship_with_user);
                if (!relCode) {
                    alert('Invalid Relation');
                    return;
                }

                let ManualLabour = elm.medical_questions.find(el => el.question_code == 'ManualLabour');
                let WinterSports = elm.medical_questions.find(el => el.question_code == 'WinterSports');
                let illness = elm.medical_questions.find(el => el.question_code == 'illness');
                let PersonalAccidentApplicable = elm.medical_questions.find(el => el.question_code == 'isPersonalAccidentApplicable');
                let diabetes = elm.medical_questions.find(el => el.question_code == 'isDiabetes');
                let kidneyProblem = elm.medical_questions.find(el => el.question_code == 'kidneyProblem');
                let eyeProblem = elm.medical_questions.find(el => el.question_code == 'eyeProblem');
                let nonHealing = elm.medical_questions.find(el => el.question_code == 'nonHealing');
                // console.log("diabetes ==>: ", diabetes);
                // console.log("illness ==>: ", illness);
                // console.log("ManualLabour==>", ManualLabour);
                // console.log("WinterSports==>", WinterSports);
                //console.log("PersonalAccidentApplicable ==>", PersonalAccidentApplicable);
                if (this.plandetails.plan_code == 'DIABETESFMLY') {
                    if (diabetes['diabetes'].diabetesMellitus == '' || !diabetes['diabetes'].diabetesMellitus) {
                        nondiabetic++
                    }
                    body['planId'] = 2; // PLAN B
                    body['sumInsuredId'] = this.plandetails.coverage.si_code
                    body['insureds[' + i + ']'] = {
                        "name": `${elm.first_name} ${elm.last_name}`,
                        "sex": elm.gender,
                        "illness": (illness) ? illness['illness'] || 'NONE' : 'NONE',
                        "dob": elm['dob'] = this.datePipe.transform(`${elm.date_of_birth.yy}-${elm.date_of_birth.mm}-${elm.date_of_birth.dd}`),
                        "relationshipId": relCode.relation_code,
                        "isDiabetes": (diabetes['diabetes'].diabetesMellitus == '' || !diabetes['diabetes'].diabetesMellitus) ? 0 : 1,
                        "diabetesMellitus": (diabetes['diabetes'].diabetesMellitus) ? `1-${diabetes['diabetes'].diabetesMellitus} years` : '',
                        "insulinProblem": (diabetes) ? diabetes['diabetes'].insulinProblem : 'false',
                        "insulinFrom": (diabetes) ? diabetes['diabetes'].insulinFrom : '',
                        "bloodSugar": (diabetes) ? diabetes['diabetes'].bloodSugar : '',
                        "serumCreatinine": (diabetes) ? diabetes['diabetes'].serumCreatinine : '',
                        "hba1c": (diabetes) ? diabetes['diabetes']['HBA1C'] : '',
                        "kidneyProblem": (kidneyProblem) ? kidneyProblem['kidneyProblem'] : 'false',
                        "eyeProblem": (eyeProblem) ? eyeProblem['eyeProblem'] : 'false',
                        "nonHealing": (nonHealing) ? nonHealing['nonHealing'] : 'false',
                        "height": this.util.convertheightTocm(parseFloat(height)),
                        "weight": elm.weight,
                        "isPersonalAccidentApplicable": (PersonalAccidentApplicable) ? PersonalAccidentApplicable['isPersonalAccidentApplicable'] : 'false',
                    }
                } else if (this.plandetails.plan_code == 'DIABETESIND') {
                    body['planId'] = 2; // PLAN B
                    body['insureds[' + i + ']'] = {
                        "name": `${elm.first_name} ${elm.last_name}`,
                        "sex": elm.gender,
                        "illness": (illness) ? illness['illness'] || 'NONE' : 'NONE',
                        "dob": elm['dob'] = this.datePipe.transform(`${elm.date_of_birth.yy}-${elm.date_of_birth.mm}-${elm.date_of_birth.dd}`),
                        "relationshipId": relCode.relation_code,
                        "sumInsuredId": this.plandetails.coverage.si_code,
                        "diabetesMellitus": (diabetes['diabetes'].diabetesMellitus) ? `1-${diabetes['diabetes'].diabetesMellitus} years` : '',
                        "insulinProblem": (diabetes) ? diabetes['diabetes'].insulinProblem : 'false',
                        "insulinFrom": (diabetes) ? diabetes['diabetes'].insulinFrom : '',
                        "bloodSugar": (diabetes) ? diabetes['diabetes'].bloodSugar : '',
                        "serumCreatinine": (diabetes) ? diabetes['diabetes'].serumCreatinine : '',
                        "hba1c": (diabetes) ? diabetes['diabetes']['HBA1C'] : '',
                        "kidneyProblem": (kidneyProblem) ? kidneyProblem['kidneyProblem'] : 'false',
                        "eyeProblem": (eyeProblem) ? eyeProblem['eyeProblem'] : 'false',
                        "nonHealing": (nonHealing) ? nonHealing['nonHealing'] : 'false',
                        "height": this.util.convertheightTocm(parseFloat(height)),
                        "weight": elm.weight,
                    }
                } else if (this.plandetails.plan_code == 'STARYSIND') {
                    body['insureds[' + i + ']'] = {
                        name: `${elm.first_name} ${elm.last_name}`,
                        sex: elm.gender,
                        illness: (illness) ? illness['illness'] || 'NONE' : 'NONE',
                        dob: elm['dob'] = this.datePipe.transform(`${elm.date_of_birth.yy}-${elm.date_of_birth.mm}-${elm.date_of_birth.dd}`),
                        relationshipId: relCode.relation_code,
                        occupationId: elm.occupation,
                        sumInsuredId: (this.plandetails.premium.hasOwnProperty('prem_type_details')) ? this.plandetails.premium.prem_type_details.premium_type_code : '1',
                        height: this.util.convertheightTocm(parseFloat(height)),
                        weight: elm.weight
                    }
                } else if (this.plandetails.plan_code == 'STARYSFMLY') {
                    body['sumInsuredId'] = this.plandetails.coverage.si_code
                    body['insureds[' + i + ']'] = {
                        name: `${elm.first_name} ${elm.last_name}`,
                        sex: elm.gender,
                        illness: (illness) ? illness['illness'] || 'NONE' : 'NONE',
                        dob: elm['dob'] = this.datePipe.transform(`${elm.date_of_birth.yy}-${elm.date_of_birth.mm}-${elm.date_of_birth.dd}`),
                        relationshipId: relCode.relation_code,
                        occupationId: elm.occupation,
                        height: this.util.convertheightTocm(parseFloat(height)),
                        weight: elm.weight
                    }
                } else if (this.plandetails.plan_code == 'REDCARPET') {
                    body['insureds[' + i + ']'] = {
                        name: `${elm.first_name} ${elm.last_name}`,
                        sex: elm.gender,
                        illness: (illness) ? illness['illness'] || 'NONE' : 'NONE',
                        dob: elm['dob'] = this.datePipe.transform(`${elm.date_of_birth.yy}-${elm.date_of_birth.mm}-${elm.date_of_birth.dd}`),
                        relationshipId: relCode.relation_code,
                        occupationId: elm.occupation,
                        sumInsuredId: this.plandetails.coverage.si_code,
                        height: this.util.convertheightTocm(parseFloat(height)),
                        weight: elm.weight
                    }
                } else if (this.plandetails.plan_code == 'REDCARPETFMLY') {
                    body['sumInsuredId'] = this.plandetails.coverage.si_code,
                        body['insureds[' + i + ']'] = {
                            name: `${elm.first_name} ${elm.last_name}`,
                            sex: elm.gender,
                            illness: (illness) ? illness['illness'] || 'NONE' : 'NONE',
                            dob: elm['dob'] = this.datePipe.transform(`${elm.date_of_birth.yy}-${elm.date_of_birth.mm}-${elm.date_of_birth.dd}`),
                            relationshipId: relCode.relation_code,
                            occupationId: elm.occupation,
                            height: this.util.convertheightTocm(parseFloat(height)),
                            weight: elm.weight
                        }
                } else if (this.plandetails.plan_code == 'COMPREHENSIVEIND') {
                    body['insureds[' + i + ']'] = {
                        name: `${elm.first_name} ${elm.last_name}`,
                        sex: elm.gender,
                        illness: (illness) ? illness['illness'] || 'NONE' : 'NONE',
                        dob: elm['dob'] = this.datePipe.transform(`${elm.date_of_birth.yy}-${elm.date_of_birth.mm}-${elm.date_of_birth.dd}`),
                        relationshipId: relCode.relation_code,
                        occupationId: elm.occupation,
                        sumInsuredId: this.plandetails.coverage.si_code,
                        height: this.util.convertheightTocm(parseFloat(height)),
                        weight: elm.weight,
                        buyBackPED: 0,
                        isPersonalAccidentApplicable: 'true',
                        engageManualLabour: (ManualLabour) ? ManualLabour['ManualLabour'] || 'NONE' : 'nil',
                        engageWinterSports: (WinterSports) ? WinterSports['WinterSports'] || 'NONE' : 'nil',
                    }
                } else if (this.plandetails.plan_code == 'COMPREHENSIVE') {
                    body['sumInsuredId'] = this.plandetails.coverage.si_code;
                    body['insureds[' + i + ']'] = {
                        name: `${elm.first_name} ${elm.last_name}`,
                        sex: elm.gender,
                        illness: (illness) ? illness['illness'] || 'NONE' : 'NONE',
                        dob: elm['dob'] = this.datePipe.transform(`${elm.date_of_birth.yy}-${elm.date_of_birth.mm}-${elm.date_of_birth.dd}`),
                        relationshipId: relCode.relation_code,
                        occupationId: elm.occupation,
                        height: this.util.convertheightTocm(parseFloat(height)),
                        weight: elm.weight,
                        buyBackPED: 0,
                        isPersonalAccidentApplicable: (PersonalAccidentApplicable) ? PersonalAccidentApplicable['isPersonalAccidentApplicable'] : 'false',
                        engageManualLabour: (ManualLabour) ? ManualLabour['ManualLabour'] || 'NONE' : 'nil',
                        engageWinterSports: (WinterSports) ? WinterSports['WinterSports'] || 'NONE' : 'nil',
                    }
                } else if (this.plandetails.plan_code == 'FHONEW') {
                    body['sumInsuredId'] = this.plandetails.coverage.si_code;
                    body['insureds[' + i + ']'] = {
                        name: `${elm.first_name} ${elm.last_name}`,
                        sex: elm.gender,
                        illness: (illness) ? illness['illness'] || 'NONE' : 'NONE',
                        dob: elm['dob'] = this.datePipe.transform(`${elm.date_of_birth.yy}-${elm.date_of_birth.mm}-${elm.date_of_birth.dd}`),
                        relationshipId: relCode.relation_code,
                        occupationId: elm.occupation,
                        height: this.util.convertheightTocm(parseFloat(height)),
                        weight: elm.weight,
                    }
                } else if (this.plandetails.plan_code == 'MCINEW') {
                    body['insureds[' + i + ']'] = {
                        name: `${elm.first_name} ${elm.last_name}`,
                        sex: elm.gender,
                        illness: (illness) ? illness['illness'] || 'NONE' : 'NONE',
                        dob: elm['dob'] = this.datePipe.transform(`${elm.date_of_birth.yy}-${elm.date_of_birth.mm}-${elm.date_of_birth.dd}`),
                        sumInsuredId: this.plandetails.coverage.si_code,
                        relationshipId: relCode.relation_code,
                        occupationId: elm.occupation,
                        height: this.util.convertheightTocm(parseFloat(height)),
                        weight: elm.weight,
                        hospitalCash: 0
                    }
                }
                else {
                    alert('Invalid Plan'); return;
                }
            });

            if (this.plandetails.plan_code == 'DIABETESFMLY' && (this.proposal.insured_member.length == nondiabetic)) {
                this.toastr.error("At least one member has to be diabetic and all diabetes related information need to be provided", "Error");
                return;
            }


            const body2 = {
                type: 'POST',
                url: constant.star_endpoint + '/api/policy/proposals',
                headers: {},
                data: body
            }
            this.carebody = body2;
            this.commonService.post(url, body2).subscribe(res => {
                console.log("Proposal Creation success : ", res);
                const refId = res.data.referenceId;
                // save savePolicy
                //================================================

                this.savePolicy(refId, 'ReferenceId')


                //==============================================

                const body3 = {
                    type: 'POST',
                    url: constant.star_endpoint + `/api/policy/proposals/${refId}/token`,
                    headers: {},
                    data: {
                        "APIKEY": constant.APIKEY,
                        "SECRETKEY": constant.SECRETKEY,
                        "referenceId": refId
                    }
                }
                this.commonService.post(url, body3).subscribe(res => {
                    console.log("Policy Token success : ", res);
                    const redirecrtToken = res.data.redirectToken;
                    window.open(`${constant.star_endpoint}/policy/proposals/purchase/${redirecrtToken}`, "_self");
                }, err => {
                    console.log("Policy Token Fail : ", err);
                    this.util.errorDialog("Policy Token Creation Failed", "Error");
                })
            }, err => {
                console.log("Proposal Creation Fail : ", err);
                this.router.navigate(['nstp'], { queryParams: { plan_id: this.plan_id, premium_id: this.premium_id } });
                //this.util.errorDialog("Something went wrong while creating proposal.Please try after sometime", "Proposal Creation Error");
            })
        }, err => {
            console.log("Quick quote Fail : ", err);
            this.util.errorDialog("Quick quote Failed", "Error");
        })
    }

    religare() {
        //=========Create Policy API============
        var panObj: any = [{ "identityTypeCd": "PAN" }];
        if (this.plandetails.premium.premium_with_gst >= 50000) {
            panObj = [{ "identityTypeCd": "PAN", "identityNum": this.proposal.pan }];
        }
        let guidPrimary = this.util.randomString(12) + '-' + this.util.randomString(12);
        let ageRange = this.plandetails.premium.premium_range.split("-");
        let ageRangeString = ageRange[0] + ' - ' + ageRange[0] + ' years';
        //alert(this.plandetails.plan_code)
        let data;
        let error = false;
        if (this.plandetails.plan_code == '10001101') {
            //CARE
            data = {
                "intPolicyDataIO": {
                    "policy": {
                        "partyDOList": this.proposal.insured_member.map(el => {
                            let height = el.height.ft + '.' + el.height.inch;
                            let partyQuestionDOList = [];
                            let partyIdentityDOList = [];
                            //28.04.2021
                            if (el.has_ped) {

                                let pedobj = el.medical_questions.find(q => q.response == 'YES' && q.existing_since_code)
                                if (pedobj) {
                                    if (pedobj.existing_since.mm == '' || pedobj.existing_since.yy == '') {
                                        this.util.errorDialog("Please select existing since month and year");
                                        error = true;
                                    }
                                }

                                if (pedobj) {
                                    partyQuestionDOList.push({
                                        "questionSetCd": "yesNoExist",
                                        "questionCd": "pedYesNo",
                                        "response": "YES"
                                    })
                                }


                                el.medical_questions.forEach(med => {
                                    if (med.response == 'YES') {
                                        partyQuestionDOList.push({
                                            "questionSetCd": med.question_title,
                                            "questionCd": med.question_code,
                                            "response": med.response,
                                        })
                                    }
                                    if (med.response == 'YES' && med.existing_since.mm != '' && med.existing_since.yy != '') {
                                        partyQuestionDOList.push({
                                            "questionSetCd": med.question_title,
                                            "questionCd": med.existing_since_code,
                                            "response": `${med.existing_since.mm}/${med.existing_since.yy}`
                                        })
                                    }
                                    if (med.question_code == '210' && med.response == 'YES') {
                                        if (med.additional_info == '') {
                                            this.toastr.error("Please enter description");
                                            error = true;
                                        }
                                        partyQuestionDOList.push({
                                            "questionSetCd": med.question_title,
                                            "questionCd": 'otherDiseasesDescription',
                                            "response": med.additional_info
                                        })
                                    }
                                    if (med.question_code == '504' && med.response == 'YES') {
                                        if (med.additional_info == '') {
                                            this.toastr.error("Please enter description");
                                            error = true
                                        }
                                        partyQuestionDOList.push({
                                            "questionSetCd": med.question_title,
                                            "questionCd": 'OtherSmokeDetails',
                                            "response": med.additional_info
                                        })
                                    }

                                });
                            } else {
                                partyQuestionDOList.push({
                                    "questionSetCd": "yesNoExist",
                                    "questionCd": "pedYesNo",
                                    "response": "NO"
                                })
                            }
                            el['partyQuestionDOList'] = partyQuestionDOList


                            if (this.plandetails.premium.premium_with_gst > 50000) {
                                partyIdentityDOList.push({
                                    "identityTypeCd": "PAN",
                                    "identityNum": el.pan
                                })
                            } else {
                                partyIdentityDOList.push({
                                    "identityTypeCd": "PAN"
                                })
                            }

                            return {
                                "guid": (el.relationship_with_user === 'self') ? guidPrimary : this.util.randomString(12) + '-' + this.util.randomString(12),
                                "firstName": el.first_name,
                                "lastName": el.last_name,
                                "roleCd": "PRIMARY",
                                "birthDt": `${el.date_of_birth.dd}/${el.date_of_birth.mm}/${el.date_of_birth.yy}`,
                                "genderCd": el.gender.toUpperCase(),
                                "titleCd": (el.gender === 'MALE') ? 'MR' : 'MS',
                                "relationCd": el.relationship_with_proposer,
                                "height": this.util.convertheightTocm(parseFloat(height)),
                                "weight": el.weight,
                                "partyQuestionDOList": partyQuestionDOList,
                                "partyIdentityDOList": partyIdentityDOList,
                                "partyAddressDOList": [
                                    {
                                        "addressTypeCd": "PERMANENT",
                                        "addressLine1Lang1": this.proposal.address.house_no,
                                        "addressLine2Lang1": this.proposal.address.area,
                                        "stateCd": this.stateName.toUpperCase(),
                                        "cityCd": this.proposal.address.city,
                                        "pinCode": this.proposal.address.pincode,
                                        "areaCd": this.proposal.address.area,
                                        "countryCd": 'IND'
                                    },
                                    {
                                        "addressTypeCd": "COMMUNICATION",
                                        "addressLine1Lang1": this.proposal.address.house_no,
                                        "addressLine2Lang1": this.proposal.address.area,
                                        "stateCd": this.stateName.toUpperCase(),
                                        "cityCd": this.proposal.address.city,
                                        "pinCode": this.proposal.address.pincode,
                                        "areaCd": this.proposal.address.area,
                                        "countryCd": 'IND'
                                    }
                                ],
                                "partyContactDOList": [
                                    {
                                        "contactTypeCd": "MOBILE",
                                        "contactNum": parseInt(this.proposal.contactNumber),
                                        "stdCode": "+91"
                                    }
                                ],
                                "partyEmailDOList": [
                                    {
                                        "emailTypeCd": "PERSONAL",
                                        "emailAddress": this.proposal.emailId
                                    }
                                ]
                            }
                        }),
                        "quotationPremium": Math.round(this.plandetails.premium.premium_with_gst),
                        "baseAgentId": constant.religare_agentId,
                        "sumInsuredValue": this.plandetails.coverage.si_display,
                        "baseProductId": this.plandetails.plan_code,
                        "productName": this.plandetails.plan_name.toUpperCase(),
                        "productFamilyId": "HEALTH",
                        "businessTypeCd": "NEWBUSINESS",
                        "coverType": this.cover_type.replace("-", "").toUpperCase(),
                        "eldestMemberAge": ageRangeString,
                        "policyAdditionalFieldsDOList": [
                            {
                                "fieldAgree": "YES",
                                "fieldTc": "YES",
                                "fieldAlerts": "YES",
                                "field1": "Partner_Trinity",
                                "field10": this.proposal.nominee.first_name + ' ' + this.proposal.nominee.last_name,
                                "field12": this.proposal.nominee.relationship_with_proposer.toUpperCase()
                            }
                        ],
                        "sumInsured": this.plandetails.coverage.si_code,
                        "term": this.plandetails.premium_term,
                        "isPremiumCalculation": 'YES'
                    }
                }
            }
            if (this.plandetails.plan_slug == 'care-ncb-super') {
                data['intPolicyDataIO']['policy']['addOns'] = 'CAREWITHNCB'
            } else if (this.plandetails.plan_slug == 'care-uar') {
                data['intPolicyDataIO']['policy']['addOns'] = 'UAR'
            } else if (this.plandetails.plan_slug == 'care-ncb-super-uar') {
                data['intPolicyDataIO']['policy']['addOns'] = 'UAR,CAREWITHNCB'
            } else if (this.plandetails.plan_slug == 'care-smart-select') {
                data['intPolicyDataIO']['policy']['addOns'] = 'SMART'
            }
        } else if (this.plandetails.plan_code == '12001002' || this.plandetails.plan_code == '12001003') {
            //CARE FREEDOM

            data = {
                "intPolicyDataIO": {
                    "policy": {
                        "partyDOList": this.proposal.insured_member.map(el => {
                            let height = el.height.ft + '.' + el.height.inch;
                            let partyQuestionDOList = [];
                            let partyIdentityDOList = [];
                            if (el.has_ped) {

                                let pedobj = el.medical_questions.find(q => q.response == 'YES' && q.existing_since_code)
                                if (pedobj) {
                                    if (pedobj && pedobj.existing_since.mm == '' || pedobj.existing_since.yy == '') {
                                        this.util.errorDialog("Please select existing since month and year");
                                        error = true;
                                    }
                                }
                                if (pedobj) {
                                    partyQuestionDOList.push({
                                        "questionSetCd": "yesNoExist",
                                        "questionCd": "pedYesNo",
                                        "response": "YES"
                                    })
                                }


                                el.medical_questions.forEach(med => {
                                    if (med.response == 'YES') {
                                        partyQuestionDOList.push({
                                            "questionSetCd": med.question_title,
                                            "questionCd": med.question_code,
                                            "response": med.response
                                        })
                                    }
                                    if (med.response == 'YES' && med.existing_since.mm != '' && med.existing_since.yy != '') {
                                        partyQuestionDOList.push({
                                            "questionSetCd": med.question_title,
                                            "questionCd": med.existing_since_code,
                                            "response": `${med.existing_since.mm}/${med.existing_since.yy}`
                                        })
                                    }
                                    if (med.question_code == "AddInfo" && med.additional_info != '') {
                                        partyQuestionDOList.push({
                                            "questionSetCd": 'CFLEAFFIFTEEN',
                                            "questionCd": 'AddInfo',
                                            "response": med.additional_info
                                        })
                                    }
                                });

                            } else {
                                partyQuestionDOList.push({
                                    "questionSetCd": "yesNoExist",
                                    "questionCd": "pedYesNo",
                                    "response": "NO"
                                })
                            }
                            el['partyQuestionDOList'] = partyQuestionDOList

                            if (this.plandetails.premium.premium_with_gst > 50000) {
                                partyIdentityDOList.push({
                                    "identityTypeCd": "PAN",
                                    "identityNum": el.pan
                                })
                            } else {
                                partyIdentityDOList.push({
                                    "identityTypeCd": "PAN"
                                })
                            }

                            return {
                                "guid": (el.relationship_with_user === 'self') ? guidPrimary : this.util.randomString(12) + '-' + this.util.randomString(12),
                                "firstName": el.first_name,
                                "lastName": el.last_name,
                                "roleCd": "PRIMARY",
                                "birthDt": `${el.date_of_birth.dd}/${el.date_of_birth.mm}/${el.date_of_birth.yy}`,
                                "genderCd": el.gender.toUpperCase(),
                                "titleCd": (el.gender === 'MALE') ? 'MR' : 'MS',
                                "relationCd": el.relationship_with_proposer,
                                "height": this.util.convertheightTocm(parseFloat(height)),
                                "weight": el.weight,
                                "partyQuestionDOList": partyQuestionDOList,
                                "partyIdentityDOList": partyIdentityDOList,
                                "partyAddressDOList": [
                                    {
                                        "addressTypeCd": "PERMANENT",
                                        "addressLine1Lang1": this.proposal.address.house_no,
                                        "addressLine2Lang1": this.proposal.address.area,
                                        "stateCd": this.stateName.toUpperCase(),
                                        "cityCd": this.proposal.address.city,
                                        "pinCode": this.proposal.address.pincode,
                                        "areaCd": this.proposal.address.area,
                                        "countryCd": 'IND'
                                    },
                                    {
                                        "addressTypeCd": "COMMUNICATION",
                                        "addressLine1Lang1": this.proposal.address.house_no,
                                        "addressLine2Lang1": this.proposal.address.area,
                                        "stateCd": this.stateName.toUpperCase(),
                                        "cityCd": this.proposal.address.city,
                                        "pinCode": this.proposal.address.pincode,
                                        "areaCd": this.proposal.address.area,
                                        "countryCd": 'IND'
                                    }
                                ],
                                "partyContactDOList": [
                                    {
                                        "contactTypeCd": "MOBILE",
                                        "contactNum": parseInt(this.proposal.contactNumber),
                                        "stdCode": "+91"
                                    }
                                ],
                                "partyEmailDOList": [
                                    {
                                        "emailTypeCd": "PERSONAL",
                                        "emailAddress": this.proposal.emailId
                                    }
                                ]
                            }
                        }),
                        "quotationPremium": Math.round(this.plandetails.premium.premium_with_gst),
                        "baseAgentId": constant.religare_agentId,
                        "sumInsuredValue": this.plandetails.coverage.si_display,
                        "baseProductId": this.plandetails.plan_code,
                        "productName": this.plandetails.plan_name.toUpperCase(),
                        "productFamilyId": "HEALTH",
                        "businessTypeCd": "NEWBUSINESS",
                        "coverType": this.cover_type.replace("-", "").toUpperCase(),
                        "eldestMemberAge": ageRangeString,
                        "policyAdditionalFieldsDOList": [
                            {
                                "fieldAgree": "YES",
                                "fieldTc": "YES",
                                "fieldAlerts": "YES",
                                "field1": "Partner_Trinity",
                                "field10": this.proposal.nominee.first_name + ' ' + this.proposal.nominee.last_name,
                                "field12": this.proposal.nominee.relationship_with_proposer.toUpperCase()
                            }
                        ],
                        "sumInsured": this.plandetails.coverage.si_code,
                        "term": this.plandetails.premium_term,
                        "isPremiumCalculation": 'YES'
                    }
                }
            }
        } else {
            alert('Invalid Plan Code');
            return;
        }

        let proposerQuentions = this.proposal.insured_member.find(m => m.relationship_with_proposer == 'SELF');
        console.log(proposerQuentions);


        let proposerheight = this.proposal.height.ft + '.' + this.proposal.height.inch;
        data['intPolicyDataIO']['policy']['partyDOList'].push({
            "guid": guidPrimary,
            "firstName": this.proposal.first_name,
            "lastName": this.proposal.last_name,
            "roleCd": "PROPOSER",
            "birthDt": `${this.proposal.dob.dd}/${this.proposal.dob.mm}/${this.proposal.dob.yy}`,
            "genderCd": this.proposal.gender,
            "titleCd": (this.proposal.gender === 'MALE') ? 'MR' : 'MS',
            "relationCd": "SELF",
            "height": this.util.convertheightTocm(parseFloat(proposerheight)),
            "weight": this.proposal.weight,
            "partyQuestionDOList": proposerQuentions.partyQuestionDOList,
            "partyIdentityDOList": panObj,
            "partyAddressDOList": [
                {
                    "addressTypeCd": "PERMANENT",
                    "addressLine1Lang1": this.proposal.address.house_no,
                    "addressLine2Lang1": this.proposal.address.landmark,
                    "stateCd": this.proposal.address.state.toUpperCase(),
                    "cityCd": this.proposal.address.city,
                    "pinCode": this.proposal.address.pincode,
                    "areaCd": this.proposal.address.area,
                    "countryCd": "IND"
                },
                {
                    "addressTypeCd": "COMMUNICATION",
                    "addressLine1Lang1": this.proposal.address.house_no,
                    "addressLine2Lang1": this.proposal.address.landmark,
                    "stateCd": this.proposal.address.state.toUpperCase(),
                    "cityCd": this.proposal.address.city,
                    "pinCode": this.proposal.address.pincode,
                    "areaCd": this.proposal.address.area,
                    "countryCd": 'IND'
                }
            ],
            "partyContactDOList": [
                {
                    "contactTypeCd": "MOBILE",
                    "contactNum": parseInt(this.proposal.contactNumber),
                    "stdCode": "+91"
                }
            ],
            "partyEmailDOList": [{
                "emailTypeCd": "PERSONAL",
                "emailAddress": this.proposal.emailId,
            }]
        })

        const body = {
            type: 'POST',
            url: constant.religare_endpoint + "/relinterfacerestful/religare/restful/createPolicy",
            headers: constant.religare_header,
            data: data
        }

        if (error) {
            return;
        }
        this.carebody = body;
        this.ngxLoader.start()
        const url = `/tpRoute/care`;
        this.commonService.post(url, body).subscribe((res: any) => {
            console.log("Religare Success : ", res);
            this.responsejson = res;
            //return
            if (res.data.responseData.status === '1') {
                let policy = res.data.intPolicyDataIO.policy;
                //==================Save ProposalNumber==============================

                this.savePolicy(policy.proposalNum, 'proposalNumber');
                this.toastr.success("Your Proposal Has Been Created Successfully!", "Success");

                //==================CARE PG REDIRECT====================
                this.carepg = {
                    returnURL: constant.hosting_endpoint + '/userPlanTransactionRoute/careResponseAfterPolicyPurchase',
                    proposalNum: policy.proposalNum,
                };
                setTimeout(() => {
                    $("#carepgform").submit();
                }, 100);
                //=========================================================

            } else {
                this.ngxLoader.stop();
                this.otp = '';
                this.btndisabled = true;
                this.util.errorDialog(res.data.intPolicyDataIO.errorLists[0]['errActualMessage'] || res.data.intPolicyDataIO.errorLists[0]['errDescription']);
            }
            this.btnText = 'Buy Now';
            this.btndisabled = false;
            //======Religare Success Response===========

        }, err => {
            this.util.errorDialog("There is an error occured while creating your policy :(.Please try after sometime")
            console.log("Religare Error : ", err)
            this.btndisabled = false;
            this.btnText = 'Buy Now';
        })
    }

    async aditya() {
        if (!this.proposal.occupation) {
            alert("Occupation is undefined");
            return false;
        }
        if (!this.plandetails.premium.prem_type_details) {
            alert('Premium Type Construct Is Not Found');
            return;
        }

        let postData = {
            "ClientCreation": {
                "salutation": (this.proposal.gender == 'MALE') ? "Mr" : 'Ms',
                "firstName": this.proposal.first_name,
                "middleName": this.proposal.middle_name,
                "lastName": this.proposal.last_name,
                "dateofBirth": `${this.proposal.dob.dd}/${this.proposal.dob.mm}/${this.proposal.dob.yy}`,
                "gender": (this.proposal.gender == 'MALE') ? 'M' : 'F',
                "educationalQualification": "",
                "pinCode": this.proposal.address.pincode,
                "uidNo": "",
                "maritalStatus": this.proposal.marital_status,
                "nationality": "Indian",
                "occupation": this.proposal.occupation,
                "primaryEmailID": this.proposal.emailId,
                "contactMobileNo": this.proposal.contactNumber,
                "stdLandlineNo": "",
                "panNo": this.proposal.pan,
                "passportNumber": "",
                "contactPerson": "",
                "annualIncome": this.proposal.annual_income,
                "remarks": "",
                "startDate": moment().add(1, 'day').format('DD/MM/YYYY'),
                "endDate": moment().add(this.plandetails.premium_term, 'year').format('DD/MM/YYYY'),
                "IdProof": "",
                "residenceProof": "",
                "ageProof": "",
                "others": "",
                "homeAddressLine1": this.proposal.address.house_no,
                "homeAddressLine2": this.proposal.address.area,
                "homeAddressLine3": "",
                "homePinCode": this.proposal.address.pincode,
                "homeArea": this.proposal.address.area,
                "homeContactMobileNo": this.proposal.contactNumber,
                "homeContactMobileNo2": "",
                "homeSTDLandlineNo": "",
                "homeSTDLandlineNo2": "",
                "homeFaxNo": "",
                "sameAsHomeAddress": 1,
                "mailingAddressLine1": this.proposal.address.house_no,
                "mailingAddressLine2": this.proposal.address.area,
                "mailingAddressLine3": "",
                "mailingPinCode": this.proposal.address.pincode,
                "mailingArea": this.proposal.address.area,
                "mailingContactMobileNo": this.proposal.contactNumber,
                "mailingContactMobileNo2": "",
                "mailingSTDLandlineNo": "",
                "mailingSTDLandlineNo2": "",
                "mailingFaxNo": "",
                "bankAccountType": "",
                "bankAccountNo": "",
                "ifscCode": "",
                "GSTIN": "",
                "GSTRegistrationStatus": "Consumers",
                "IsEIAavailable": "",
                "ApplyEIA": "",
                "EIAAccountNo": "",
                "EIAWith": "",
                "AccountType": "",
                "AddressProof": "",
                "DOBProof": "",
                "IdentityProof": "",
                "UIDAcknowledgementNo": "",
                "DCNnumber": ""
            },
            "PolicyCreationRequest": {
                "Quotation_Number": "",
                "Product_Code": this.plandetails.product_code,
                "Plan_Code": this.plandetails.plan_code,
                "SumInsured_Type": this.plandetails.coverage.si_code_name,
                "Policy_Tanure": this.plandetails.premium_term,
                "Member_Type_Code": this.plandetails.premium.prem_type_details.premium_type_code,
                "intermediaryCode": constant.IntermediaryCode,
                "AutoRenewal": "N",
                "intermediaryBranchCode": "",
                "agentSignatureDate": "",
                "Customer_Signature_Date": "",
                "businessSourceChannel": "",
                "leadID": "",
                "Source_Name": "Trinity Insurance",
                "BusinessType": "NEW BUSINESS",
                "familyDoctor": {
                    "fullName": "",
                    "qualification": "",
                    "emailId": "",
                    "RegistrationNumber": "",
                    "addressLine1": "",
                    "addressLine2": "",
                    "pinCode": "",
                    "contact_number": ""
                },
                "SPID": "",
                "RefCode1": "",
                "RefCode2": "",
                "TrackerRefCode": "",
                "EmployeeNumber": null,
                "EmployeeDiscount": "",
                "QuoteDate": moment().format('DD/MM/YYYY'),
                "IsPayment": 0,
                "goGreen": 0,
                "TCN": ""
            },
            "ReceiptCreation": {}
        }
        let memberObj = [];
        this.proposal.insured_member.forEach((el, i) => {
            console.log(el)
            let height = parseFloat(el.height.ft + '.' + el.height.inch) * 30.48;
            let partyQuestionDOList = [];
            let optionalCover = [];
            if (this.plandetails.plan_slug == 'activ-assure-diamond-with-unlimited-reload') {
                optionalCover = [{
                    "optionalCoverName": "Unlimited Reload of Sum Insured",
                    "optionalCoverValue": "1"
                }];
            } else if (this.plandetails.plan_slug == 'activ-assure-diamond-with-super-ncb') {
                optionalCover = [{
                    "optionalCoverName": "Super NCB",
                    "optionalCoverValue": "1"
                }];
            } else if (this.plandetails.plan_slug == 'activ-assure-diamond-with-super-ncb-unlimited-reload') {
                optionalCover = [{
                    "optionalCoverName": "Super NCB",
                    "optionalCoverValue": "1"
                }, {
                    "optionalCoverName": "Unlimited Reload of Sum Insured",
                    "optionalCoverValue": "1"
                }];
            }

            if (el.has_ped) {
                el.medical_questions.forEach(med => {
                    if (med.response == 'YES') {
                        partyQuestionDOList.push({
                            "QuestionCode": med.question_code,
                            "Answer": "1",
                            "Remarks": med.additional_info
                        })
                    } else if (med.response == 'NO') {
                        partyQuestionDOList.push({
                            "QuestionCode": med.question_code,
                            "Answer": "0",
                            "Remarks": ''
                        })
                    }
                });
            }

            memberObj.push({
                "MemberNo": i + 1,
                "Salutation": (el.gender === 'MALE') ? 'Mr' : 'Mrs',
                "First_Name": el.first_name,
                "Middle_Name": el.middle_name,
                "Last_Name": el.last_name,
                "Gender": (el.gender === 'MALE') ? 'M' : 'F',
                "DateOfBirth": `${el.date_of_birth.dd}/${el.date_of_birth.mm}/${el.date_of_birth.yy}`,
                "Relation_Code": el.relationship_with_proposer,
                "Marital_Status": el.marital_status,
                "height": Math.round(height),
                "weight": el.weight,
                "occupation": el.occupation,
                "PrimaryMember": (el.relationship_with_user == 'self') ? 'Y' : 'N',
                "optionalCovers": optionalCover,
                "productComponents": [
                    {
                        "productComponentName": "SumInsured",
                        "productComponentValue": parseInt(this.plandetails.coverage.sum_insured)
                    }
                ],
                "exactDiagnosis": "",
                "dateOfDiagnosis": "",
                "lastDateConsultation": "",
                "detailsOfTreatmentGiven": "",
                "doctorName": "",
                "hospitalName": "",
                "phoneNumberHosital": "",
                "labReport": "",
                "dischargeCardSummary": "",
                "personalHabitDetail": el.lifestyle.map(ls => {
                    return {
                        "numberOfYears": ls.numberOfYears || 0,
                        "count": ls.consumes || 0,
                        "type": ls.lifestyle_name
                    }
                }),
                "Nominee_First_Name": this.proposal.nominee.first_name,
                "Nominee_Last_Name": this.proposal.nominee.last_name,
                "Nominee_Contact_Number": this.proposal.nominee.mobileno,
                "Nominee_Home_Address": "",
                "Nominee_Relationship_Code": this.proposal.nominee.relationship_with_proposer,
                "MemberPED": [],
                "MemberQuestionDetails": partyQuestionDOList,
                "PreviousInsuranceDetails": []
            })
        });

        postData['MemObj'] = {
            'Member': memberObj
        }

        console.log("postData : ", postData);
        localStorage.setItem('abhiproposalObj', JSON.stringify(postData));
        let endpoint;
        if (this.plandetails.product_code == 6212) {
            // Activ Health
            endpoint = '/ABHICL_FullQuoteNSTP/Service1.svc/GenericFullQuote'
        } else if (this.plandetails.product_code == 4226 || this.plandetails.product_code == 4227) {
            // Activ Assure
            endpoint = '/ABHICL_NB/Service1.svc/FQ_ActiveAssure'
        } else if (this.plandetails.product_code == 5221) {
            // Activ Care
            endpoint = '/ABHICL_NB/Service1.svc/ActiveCare'
        } else {
            alert('Invalid Product Code');
            return;
        }

        let authToken = await this.createABHIToken();

        const body = {
            type: 'POST',
            url: constant.aditya_endpoint + endpoint,
            headers: {
                authorization: authToken.access_token
            },
            data: postData
        }

        this.carebody = body;
        //console.log(this.carebody)
        //console.log("Aditya Body : ", body)
        const url = `/tpRoute/care`;
        this.ngxLoader.start();
        this.commonService.post(url, body).subscribe((res: any) => {
            //const parser = new DOMParser();
            //const xml = parser.parseFromString(res.data, 'text/xml');
            //const resobj: any = this.ngxXml2jsonService.xmlToJson(xml);
            console.log("ABHI success : ", res);
            this.ngxLoader.stop();
            if (res.data.PolCreationRespons.quoteNumber == '') {
                this.util.errorDialog("Unable To Generate QuoteNumber", "ABHI Error");
                return;
            }
            if (res.data.ReceiptCreationResponse.errorNumber == 0 && res.data.PolCreationRespons.stpflag == 'STP') {
                const resp = res.data.PolCreationRespons;
                if (resp.premiumDetails[0]['Premium'][0]['GrossPremium'] == 0 || resp.premiumDetails[0]['Premium'][0]['FinalPremium'] == 0) {
                    this.toastr.error("Please check Plan Code or Product Code", "Critical Error");
                    this.btndisabled = false;
                    this.btnText = 'Buy Now';
                    return;
                }
                // save savePolicy
                //================================================

                this.savePolicy(resp.quoteNumber, 'QuoteNumber');


                //==============================================
                this.toastr.success("Your Quote has been created successfully!", "Success");
                //================ABHI PG===================
                this.abhi = {
                    Email: this.proposal.emailId,
                    PhoneNo: this.proposal.contactNumber,
                    SourceCode: constant.sourceCode,
                    OrderAmount: resp.premiumDetails[0]['Premium'][0]['GrossPremium'],
                    Currency: 'INR',
                    secSignature: constant.secSignature,
                    ReturnURL: constant.api_endpoint + '/userPlanTransactionRoute/responseAfterPolicyPurchase',
                    QuoteId: resp.quoteNumber,
                    SubCode: '',
                    GrossPremium: resp.premiumDetails[0]['Premium'][0]['GrossPremium'],
                    FinalPremium: resp.premiumDetails[0]['Premium'][0]['FinalPremium'],
                    SourceTxnId: resp.quoteNumber
                };
                console.log(this.abhi)
                setTimeout(() => {
                    $("#abhipgform").submit();
                }, 100);

            } else if (res.data.ReceiptCreationResponse.errorNumber == 0 && res.data.PolCreationRespons.stpflag == 'NSTP') {
                //this.toastr.warning("Your Policy Can Not Be Completed", "NSTP");
                this.router.navigate(['nstp'], { queryParams: { plan_id: this.plan_id, premium_id: this.premium_id } });
            } else {
                this.util.errorDialog(res.data.ReceiptCreationResponse.errorMessage)
            }
            this.btnText = 'Buy Now';
            this.btndisabled = false;
            //======Religare Success Response===========

        }, err => {
            this.ngxLoader.stop();
            this.util.errorDialog("Your request can not be processed now.Please try after sometime!")
            console.log("Aditya Error : ", err)
            this.btndisabled = false;
            this.btnText = 'Buy Now';
        })
    }

    hdfc() {
        let nstpFlag = false;
        let hdfc_state_code = this.stateList.find(s => s.state_id == this.proposal.address.state_id);
        let hdfc_city_code = this.cityList.find(s => s.id == this.proposal.address.city_id);
        let nomineeRelCode = this.relationShip.find(rel => rel.relation_name == this.proposal.nominee.relationship_with_proposer);
        if (!nomineeRelCode) {
            alert('There is a problem with this nominee relation.Try another relation');
            return;
        }
        let nomineeTitleCode;
        if (this.proposal.nominee.relationship_with_proposer == 'Father' || this.proposal.nominee.relationship_with_proposer == 'Father-in-law' || this.proposal.nominee.relationship_with_proposer == 'Brother' || this.proposal.nominee.relationship_with_proposer == 'Brother-in-law' || this.proposal.nominee.relationship_with_proposer == 'Son' || this.proposal.nominee.relationship_with_proposer == 'Grandson' || this.proposal.nominee.relationship_with_proposer == 'Grandfather' || this.proposal.nominee.relationship_with_proposer == 'Uncle' || this.proposal.nominee.relationship_with_proposer == 'Nephew' || this.proposal.nominee.relationship_with_proposer == 'Husband') {
            nomineeTitleCode = 'MR';
        } else {
            nomineeTitleCode = 'MRS';
        }
        let stateCode, cityCode;
        if (hdfc_state_code) {
            stateCode = hdfc_state_code.hdfc_code
        } else {
            alert('State Code Not Found');
            return;
        }
        if (hdfc_city_code) {
            cityCode = hdfc_city_code.hdfc_code
        }
        // Step1 : Premium Calculation=================
        let soapXML = `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <soap:Body>
            <ComputePremium xmlns="http://www.apollomunichinsurance.com/B2BService">
                <premiumCalculatorRequest>
                <Clients xmlns="http://schemas.datacontract.org/2004/07/PremiumCalculatorLibrary">
                    <Client xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">
                        <Address>
                            <Address>
                                <AddressLine1>${this.proposal.address.house_no}</AddressLine1>
                                <AddressLine2>${this.proposal.address.area}</AddressLine2>
                                <AddressLine3>${this.proposal.address.landmark}</AddressLine3>
                                <CountryCode>IN</CountryCode>
                                <District xsi:nil="true"/>
                                <StateCode>${stateCode}</StateCode>
                                <TownCode>${cityCode}</TownCode>
                            </Address>
                        </Address>
                        <Age>${this.util.calculateAge(this.proposal.dob.mm + '/' + this.proposal.dob.dd + '/' + this.proposal.dob.yy)}</Age>
                        <ClientCode>PolicyHolder</ClientCode>
                        <ContactInformation xsi:nil="true"/>
                        <Product>
                            <Product>
                                <ClientCode>PolicyHolder</ClientCode>
                                <ProductCode>${this.plandetails.product_code}</ProductCode>
                                <ProductGroup>1</ProductGroup>
                                <ProductLine>9</ProductLine>
                                <ProductType>1</ProductType>
                                <ProductVersion>1</ProductVersion>
                                <SACCode>1</SACCode>
                                <SumAssured>${this.plandetails.coverage.sum_insured}</SumAssured>
                            </Product>
                        </Product>
                    </Client>
                </Clients>
                <Partner xmlns="http://schemas.datacontract.org/2004/07/PremiumCalculatorLibrary">
                    <PartnerCode xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">${constant.hdfc.PartnerCode}</PartnerCode>
                    <Password xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">${constant.hdfc.Password}</Password>
                    <UserName xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">${constant.hdfc.UserName}</UserName>
                </Partner>
                </premiumCalculatorRequest>
            </ComputePremium>
        </soap:Body>
    </soap:Envelope>`;

        const body = {
            type: 'POST',
            url: constant.hdfc.premium_calc_endpoint,
            headers: {
                'Content-Type': 'text/xml',
                'SOAPAction': constant.hdfc.premium_calc_soap_action
            },
            data: soapXML
        }
        this.ngxLoader.start();
        const url = `/tpRoute/care`;
        this.commonService.post(url, body).subscribe((res: any) => {
            console.log("==========Premium Calculation Success=============")
            this.toastr.success("Premium Calculation Success");
            const parser = new DOMParser();
            const xml = parser.parseFromString(res.data, 'text/xml');
            const obj = this.ngxXml2jsonService.xmlToJson(xml);
            //console.log(obj['s:Envelope']['s:Body']['ComputePremiumResponse']['ComputePremiumResult']['a:Client']['a:Product']['a:Product']);
            const products = obj['s:Envelope']['s:Body']['ComputePremiumResponse']['ComputePremiumResult']['a:Client']['a:Product']['a:Product']
            const totalPremimAmt = obj['s:Envelope']['s:Body']['ComputePremiumResponse']['ComputePremiumResult']['a:Client']['a:TotalPremium'];

            //xxxxxxxxxxxxxx Proposal Creation xxxxxxxxxxxxxxxxxxxxx
            let memObj = ``;
            this.proposal.insured_member.forEach((el, i) => {
                let height = parseFloat(el.height.ft + '.' + el.height.inch) * 30.48;
                let wineGlass = el.lifestyle.find(ls => ls.lifestyle_name == 'Alcohol')['consumes'];
                let smoke = el.lifestyle.find(ls => ls.lifestyle_name == 'Smoke')['consumes'];
                let tobacco = el.lifestyle.find(ls => ls.lifestyle_name == 'Tobacco')['consumes'];
                let age = this.util.calculateAge(`${el.date_of_birth.mm}/${el.date_of_birth.dd}/${el.date_of_birth.yy}`)

                //BMI check
                let BMI = this.CheckBMI(height, el['weight']);
                console.log("BMI : ", BMI);
                if (age > 0 && age <= 15) {
                    if (BMI >= 12 && BMI <= 39) {
                        //STP Case
                        nstpFlag = false;
                        console.log('HDFC STP...')
                    }
                    else {
                        nstpFlag = true;
                        return;
                        // NSTP Case (PPC case, if NSTP not allowed)
                    }
                }


                memObj += `<Client xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">
                <Address>
                   <Address>
                      <AddressLine1>${this.proposal.address.house_no}</AddressLine1>
                      <AddressLine2>${this.proposal.address.area}</AddressLine2>
                      <AddressLine3>${this.proposal.address.landmark}</AddressLine3>
                      <CountryCode>IN</CountryCode>
                      <District xsi:nil="true"/>
                      <PinCode>${this.proposal.address.pincode}</PinCode>
                      <StateCode>${stateCode}</StateCode>
                      <TownCode>${cityCode}</TownCode>
                   </Address>
                </Address>
                <Age>${age}</Age>
                <AnnualIncome>${this.proposal.annual_income}</AnnualIncome>
                <BirthDate>${el.date_of_birth.yy}-${el.date_of_birth.mm}-${el.date_of_birth.dd}</BirthDate>
                <ClientCode>PolicyHolder</ClientCode>
                <ContactInformation>
                   <ContactNumber>
                      <ContactNumber>
                         <Number>${el.contactNumber}</Number>
                         <Type>7</Type>
                      </ContactNumber>
                   </ContactNumber>
                   <Email>${el.emailId}</Email>
                </ContactInformation>
                <Dependants xsi:nil="true"/>
                <FamilySize>1</FamilySize>
                <FirstName>${el.first_name}</FirstName>
                <GenderCode>${(this.proposal.gender === 'MALE') ? '1' : '2'}</GenderCode>
                <GstinNumber></GstinNumber>
                <Height>${Math.round(height)}</Height>
                <IDProofNumber>${el.IDProofType}</IDProofNumber>
                <IDProofTypeCode>${el.IDProofNumber}</IDProofTypeCode>
                <LastName>${el.last_name}</LastName>
                <LifeStyleHabits>
                   <BeerBottle>0</BeerBottle>
                   <LiquorPeg>0</LiquorPeg>
                   <Pouches>${tobacco || 0}</Pouches>
                   <Smoking>${smoke || 0}</Smoking>
                   <WineGlass>${wineGlass || 0}</WineGlass>
                </LifeStyleHabits>
                <MaritalStatusCode>${(el.marital_status === 'Single') ? '2' : '1'}</MaritalStatusCode>
                <MiddleName>${el.middle_name}</MiddleName>
                <NationalityCode>IN</NationalityCode>
                <OccuptionCode>${el.occupation}</OccuptionCode>
                <PreviousInsurer xsi:nil="true"/>
                <Product>
                   <Product>
                      <BasePremiumAmount>${products['a:BasePremiumAmount']}</BasePremiumAmount>
                      <ClientCode>${products['a:ClientCode']}</ClientCode>
                      <DiscountAmount>${products['a:DiscountAmount']}</DiscountAmount>
                      <GrossPremiumAmount>${products['a:GrossPremiumAmount']}</GrossPremiumAmount>
                      <ProductCode>${products['a:ProductCode']}</ProductCode>
                      <ProductGroup>${products['a:ProductGroup']}</ProductGroup>
                      <ProductLine>${products['a:ProductLine']}</ProductLine>
                      <ProductType>${products['a:ProductType']}</ProductType>
                      <ProductVersion>${products['a:ProductVersion']}</ProductVersion>
                      <SACCode>${products['a:SACCode']}</SACCode>
                      <SumAssured>${products['a:SumAssured']}</SumAssured>
                      <TaxAmount>${products['a:TaxAmount']}</TaxAmount>
                   </Product>
                </Product>
                <ProfessionCode xsi:nil="true"/>
                <RelationshipCode>${el.relationship_with_proposer}</RelationshipCode>
                <TitleCode>${(el.gender === 'MALE') ? 'MR' : 'MRS'}</TitleCode>
                <Weight>${el.weight}</Weight>
             </Client>`
            });

            let nomineestatecode = this.stateList.find(s => s.state_id == this.proposal.nominee.state);
            const propbody = `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
           <soap:Body>
              <ProposalCapture xmlns="http://www.apollomunichinsurance.com/B2BService">
                 <ProposalCaptureServiceRequest>
                    <Action xmlns="http://schemas.datacontract.org/2004/07/ProposalCaptureServiceLibrary">Create</Action>
                    <Partner xmlns="http://schemas.datacontract.org/2004/07/ProposalCaptureServiceLibrary">
                       <PartnerCode xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">${constant.hdfc.PartnerCode}</PartnerCode>
                       <Password xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">${constant.hdfc.Password}</Password>
                       <UserName xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">${constant.hdfc.UserName}</UserName>
                    </Partner>
                    <Prospect xmlns="http://schemas.datacontract.org/2004/07/ProposalCaptureServiceLibrary">
                       <Application xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">
                          <CrossSellCommonCode xsi:nil="true"/>
                          <Namefor80D>${this.proposal.first_name + ' ' + this.proposal.middle_name + ' ' + this.proposal.last_name}</Namefor80D>
                          <NomineeAddress>
                          <AddressLine1>${this.proposal.nominee.addressline1}</AddressLine1>
                          <AddressLine2>${this.proposal.nominee.addressline2}</AddressLine2>
                          <AddressLine3></AddressLine3>
                             <CountryCode>IN</CountryCode>
                             <District xsi:nil="true"/>
                             <PinCode>${this.proposal.nominee.pincode}</PinCode>
                             <StateCode>${(nomineestatecode) ? nomineestatecode.hdfc_code : ''}</StateCode>
                             <TownCode>${this.proposal.nominee.city}</TownCode>
                          </NomineeAddress>
                          <NomineeName>${this.proposal.nominee.first_name + ' ' + this.proposal.nominee.last_name}</NomineeName>
                          <NomineeTitleCode>${nomineeTitleCode}</NomineeTitleCode>
                          <Proposer>
                             <Address>
                                <Address>
                                <AddressLine1>${this.proposal.address.house_no}</AddressLine1>
                                <AddressLine2>${this.proposal.address.area}</AddressLine2>
                                <AddressLine3>${this.proposal.address.landmark}</AddressLine3>
                                   <CountryCode>IN</CountryCode>
                                   <District xsi:nil="true"/>
                                   <PinCode>${this.proposal.address.pincode}</PinCode>
                                   <StateCode>${stateCode}</StateCode>
                                   <TownCode>${cityCode}</TownCode>
                                </Address>
                             </Address>
                             <BirthDate>${this.proposal.dob.yy}-${this.proposal.dob.mm}-${this.proposal.dob.dd}</BirthDate>
                             <ClientCode xsi:nil="true"/>
                             <ContactInformation>
                                <ContactNumber>
                                   <ContactNumber>
                                      <Number>${this.proposal.contactNumber}</Number>
                                      <Type>7</Type>
                                   </ContactNumber>
                                </ContactNumber>
                                <Email>${this.proposal.emailId}</Email>
                             </ContactInformation>
                             <Dependants xsi:nil="true"/>
                             <FirstName>${this.proposal.first_name}</FirstName>
                             <GenderCode>${(this.proposal.gender === 'MALE') ? '1' : '2'}</GenderCode>
                             <GstinNumber></GstinNumber>
                             <IDProofNumber></IDProofNumber>
                             <IDProofTypeCode></IDProofTypeCode>
                             <LastName>${this.proposal.last_name}</LastName>
                             <LifeStyleHabits xsi:nil="true"/>
                             <MaritalStatusCode>${(this.proposal.marital_status === 'Single') ? '2' : '1'}</MaritalStatusCode>
                             <MiddleName>${this.proposal.middle_name}</MiddleName>
                             <NationalityCode>IN</NationalityCode>
                             <PreviousInsurer xsi:nil="true"/>
                             <Product xsi:nil="true"/>
                             <RelationshipCode>1</RelationshipCode>
                          </Proposer>
                          <RelationToNomineeCode>${nomineeRelCode.relation_code}</RelationToNomineeCode>
                          <RuralFlag>0</RuralFlag>
                          <TPANameCode>FHPL</TPANameCode>
                       </Application>
                       <BrandCode xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">ApolloMunich</BrandCode>
                       ${memObj}
                       <MedicalInformations xsi:nil="true" xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects"/>
                       <TotalPremiumAmount xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">${Math.round(totalPremimAmt)}</TotalPremiumAmount>
                    </Prospect>
                 </ProposalCaptureServiceRequest>
              </ProposalCapture>
           </soap:Body>
        </soap:Envelope>`;

            if (nstpFlag) {
                this.router.navigate(['nstp'], { queryParams: { plan_id: this.plan_id, premium_id: this.premium_id } });
                return;
            }


            //console.log(propbody)
            const bodyObj = {
                type: 'POST',
                url: constant.hdfc.proposal_create_endpoint,
                headers: {
                    'Content-Type': 'text/xml',
                    'SOAPAction': constant.hdfc.proposal_create_action
                },
                data: propbody
            }

            const url = `/tpRoute/care`;
            this.commonService.post(url, bodyObj).subscribe((res: any) => {
                this.toastr.success("Proposal Created Successfully", "Success");
                this.ngxLoader.stop();
                const parser = new DOMParser();
                const xml = parser.parseFromString(res.data, 'text/xml');
                const obj = this.ngxXml2jsonService.xmlToJson(xml);
                let proposalNum = obj['s:Envelope']['s:Body']['ProposalCaptureResponse']['ProposalCaptureResult'];
                //alert(proposalNum)
                // -----------------HDFC Save Policy----------------
                this.savePolicy(proposalNum, 'proposalNumber');

                //xxxxxxxxxx  payment gateway redirect xxxxxxxxxxxxxxxxxxxxxxxxxx

                let pgbody = {
                    type: 'POST',
                    url: constant.hdfc.payment_gateway,
                    headers: {
                        'Content-Type': 'text/xml',
                        'SOAPAction': constant.hdfc.payment_gateway_soap_action
                    },
                    data: `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
                    <soap:Body>
                       <PaymentDetails xmlns="http://www.apollomunichinsurance.com/B2BService">
                          <paymentGatewayServiceRequest>
                             <PGDetail xmlns="http://schemas.datacontract.org/2004/07/PaymentGatewayServiceLibrary">
                                <CrossSellCommonCode xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects"/>
                                <IPAddress xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">127.0.0.1</IPAddress>
                                <MerchantRefNo xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">AlphaNumeric</MerchantRefNo>
                                <PaymentId xsi:nil="true" xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects"/>
                                <PaymentUrl xsi:nil="true" xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects"/>
                                <ProposalId xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">${proposalNum}</ProposalId>
                                <ReturnUrl xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">${constant.api_endpoint + '/userPlanTransactionRoute/hdfcResponseAfterPolicyPurchase'}</ReturnUrl>
                                <UDF1 xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">UDF1</UDF1>
                                <UDF2 xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">UDF2</UDF2>
                                <UDF3 xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">UDF3</UDF3>
                                <UDF4 xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">UDF4</UDF4>
                                <UDF5 xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">UDF5</UDF5>
                             </PGDetail>
                             <Partner xmlns="http://schemas.datacontract.org/2004/07/PaymentGatewayServiceLibrary">
                             <PartnerCode xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">${constant.hdfc.PartnerCode}</PartnerCode>
                             <Password xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">${constant.hdfc.Password}</Password>
                             <UserName xmlns="http://schemas.datacontract.org/2004/07/ServiceObjects">${constant.hdfc.UserName}</UserName>
                             </Partner>
                          </paymentGatewayServiceRequest>
                       </PaymentDetails>
                    </soap:Body>
                 </soap:Envelope>`
                }

                const url = `/tpRoute/care`;
                this.commonService.post(url, pgbody).subscribe((res: any) => {
                    console.log("PG response : ", res)
                    this.toastr.success("Redirecting...");
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(res.data, 'text/xml');
                    const obj = this.ngxXml2jsonService.xmlToJson(xml);
                    console.log(obj)
                    let PaymentUrl = obj['s:Envelope']['s:Body']['PaymentDetailsResponse']['PaymentDetailsResult']['a:PaymentUrl'];
                    window.open(`${PaymentUrl}`, "_self");
                }, err => {
                    this.toastr.error("Unable to get payment url", "Error");
                    console.log(err)
                })


            }, err => {
                console.log(err)
                this.ngxLoader.stop()
                this.toastr.error("Proposal not created", "Error")
            })


        }, err => {
            console.log("==========Premium Calculation Error=============")
            console.log(err)
            this.ngxLoader.stop();
            this.toastr.error("Premium Calculation Error", "Error")
        })
    }

    createABHIToken(): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            const url = `/tpRoute/care`;
            const body = {
                type: 'POST',
                url: constant.aditya_endpoint + '/ABHICL_OAuth/Service1.svc/accessToken',
                headers: {},
                data: {
                    "Metadata": {
                        "Sender": {
                            "LogicalID": "PolicyMall",
                            "TaskID": "Quote",
                            "ReferenceID": "10001",
                            "CreationDateTime": moment().format('DD/MM/YYYY HH:mm:ss A'),
                            "TODID": this.util.randomString(25)
                        }
                    },
                    "client_id": constant.abhi_clientid,
                    "client_secret": constant.abhi_client_secret,
                    "grant_type": constant.abhi_grant_type
                }
            }
            this.carebody = body;
            //return;
            this.commonService.post(url, body).subscribe((res: any) => {
                this.toastr.success("Token Generated Successfully");
                console.log("Create Token : ", res)
                resolve(res.data)
            }, error => {
                this.toastr.error("ABHI Token Generation Failed..", "Error");
                this.btndisabled = false;
                this.btnText = 'Buy Now';
                reject(error)
            })
        });
        return promise;
    }

    selectNomineeAge(e) {
        if (e.target.value < 18) {
            this.appointee = true;
        } else {
            this.appointee = false;
        }
    }

    savePolicy(IdTypeVal: string, IdTypeName?) {
        let body = {
            "user_id": this.userid,
            "session_id": localStorage.getItem("session_id"),
            "company_id": this.company_id,
            "plan_id": this.plan_id,
            "premium_id": this.premium_id,
            "proposal_id_name": IdTypeName,
            "proposal_id_value": IdTypeVal,
            "si_id": this.plandetails.coverage.si_id,
            "si_amount": parseInt(this.plandetails.coverage.sum_insured),
            "company_name": this.plandetails.company_master.company_name,
            "plan_name": this.plandetails.plan_name,
            "construct": this.plandetails.premium.premium_type_display_slug,
            "purchase_date": moment().format('YYYY-MM-DD'),
            "payment_status": "pending",
            "payment_status_reason": "pending",
            "transaction_id": "",
            "premium_amount": this.plandetails.OneyearFinalPremium,
            "response_data": {
                "amount": this.plandetails.premium.premium_price,
                "serviceTax": this.plandetails.premium.gst_amount,
                "totalPremium": this.plandetails.OneyearFinalPremium,
            }
        }
        console.log(body)
        const url = `/userPlanTransactionRoute/add`;
        this.commonService.post(url, body).subscribe(res => {
            console.log(res)
        }, err => {
            console.log("Error", err);

        })
    }

    declarationspopup(e, template: TemplateRef<any>) {
        if (e.target.checked) {
            this.btndisabled = false;
            //this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
        } else {
            this.btndisabled = true;
        }
    }

    openTnc(template) {
        this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
    }

    savenShare(template: TemplateRef<any>, section: string) {
        this.section = section;
        this.modalRef2 = this.modalService.show(template, { class: 'common-popup' });
    }

    nomineerelchange(e) {
        const rel = e.target.value;
        this.proposal.nominee.relationship_with_proposer = rel;
        this.proposal.nominee.relationship_with_proposer_value = rel;
    }

    submitSavenShare() {
        var regex = constant.emailvalidateregex;
        var regexcontactNo = constant.mobilevalidateregex;
        if (this.savenshareObj.emailId == '') {
            this.toastr.error("Please enter your valid email", "Error");
        } else if (!regex.test(this.savenshareObj.emailId)) {
            this.toastr.error("Please enter a valid email address", "Error");
        } else if (!regexcontactNo.test(this.savenshareObj.contactNumber)) {
            this.toastr.error('Please enter a valid 10 digit mobile number', "Error");
            return false;
        } else {
            this.snsBtn = 'Saving data...';
            this.snsdisabled = true;
            const userId = this.userid;
            if (this.section === 'proposer') {
                const url = `/proposalFormRoute/add_user_details/${userId}`;
                const occupation = this.occupation.find((occ) => occ.occupation_code == this.proposal.occupation);
                const postData = {
                    "session_id": this.session_id,
                    "session_url": this.fullURL + '&step=one',
                    "first_name": this.proposal.first_name,
                    "plan_id": this.plan_id,
                    "last_name": this.proposal.last_name,
                    "date_of_birth": this.proposal.dob.yy + '-' + this.proposal.dob.mm + '-' + this.proposal.dob.dd,
                    "marital_status": this.proposal.marital_status,
                    "gender": this.proposal.gender,
                    "height": this.proposal.height.ft + '.' + this.proposal.height.inch,
                    "annual_income": this.proposal.annual_income,
                    "weight": this.proposal.weight,
                    "occupation": (occupation) ? occupation.oc_id : '',
                    "pan_card_no": this.proposal.pan,
                    // "politically_exposed": "",
                    // "medical_practioner_id": "",
                    // "medical_council": "",
                    // "workplace_address": "",
                    "emailId": this.proposal.emailId,
                    "share_email_id": this.savenshareObj.emailId,
                    "email_text": this.fullURL + '&step=one',
                    "contactNumber": this.proposal.contactNumber,
                    "sms_text": this.fullURL + '&step=one',
                    "address": {
                        "house_no": this.proposal.address.house_no,
                        "area": this.proposal.address.area,
                        "landmark": this.proposal.address.landmark,
                        "pincode": this.proposal.address.pincode,
                        "city_id": this.proposal.address.city_id,
                        "state_id": this.proposal.address.state_id,
                        "nationality": this.proposal.address.nationality,
                    }
                };
                console.log(postData)
                this.proposalpageSMS(this.fullURL + '&step=one');
                this.commonService.post(url, postData).subscribe(res => {
                    console.log(res)
                    this.toastr.success("Your data has been shared to EmailId and Mobile No provided", "Success");
                    this.snsBtn = 'Save & Share';
                    this.snsdisabled = false;
                    this.modalRef2.hide();
                }, err => {
                    const errorMessage = err && err.message || 'Something goes wrong';
                    this.toastr.error(errorMessage, 'Error');
                    this.snsBtn = 'Save & Share';
                    this.snsdisabled = false;
                })
            } else if (this.section === 'insuredmembers') {
                // =================INSURED MEMBERS===========
                const url = `/proposalFormRoute/add_insured_members/${userId}?plan_id=${this.plan_id}&session_id=${this.session_id}`;
                const postBody = this.proposal.insured_member.map((el) => {
                    const occupation = this.occupation.find((occ) => occ.occupation_code == el.occupation);
                    return {
                        "session_url": this.fullURL + '&step=two',
                        "sms_text": this.fullURL + '&step=two',
                        "sms_contact_no": this.savenshareObj.contactNumber,
                        "share_email_id": this.savenshareObj.emailId,
                        "relationship_with_user": el.relationship_with_user,
                        "relation_code": el.relationship_with_proposer,
                        "first_name": el.first_name,
                        "middle_name": el.middle_name,
                        "last_name": el.last_name,
                        "date_of_birth": `${el.date_of_birth.yy}-${el.date_of_birth.mm}-${el.date_of_birth.dd}`,
                        "marital_status": el.marital_status,
                        "gender": el.gender,
                        "height": el.height.ft + '.' + el.height.inch,
                        "weight": el.weight,
                        "aadhar_number": "",
                        "pan_card_no": "",
                        "contactNumber": "",
                        "emailId": "",
                        "medical_qa": [],
                        "occupation_id": (occupation) ? occupation.oc_id : '',
                        "medical_history": [],
                        "lifestyle": el.lifestyle.filter(el => el.checked).map(v => {
                            return {
                                lifestyle_id: v.lifestyle_id,
                                lifestyle_type: v.lifestyle_name,
                                number_of_years: v.numberOfYears,
                                consumption_per_day: v.consumes
                            }
                        })
                    }
                })
                console.log("Insured member : ", postBody)
                
                this.proposalpageSMS(this.fullURL + '&step=two');
                this.commonService.post(url, postBody).subscribe(res => {
                    console.log(res)
                    this.toastr.success("Your data has been shared to EmailId and Mobile No provided", 'Success');
                    this.snsBtn = 'Save & Share';
                    this.snsdisabled = false;
                    this.modalRef2.hide();
                }, err => {
                    const errorMessage = err && err.message || 'Something goes wrong';
                    this.toastr.error(errorMessage, 'Error');
                    this.snsBtn = 'Save & Share';
                    this.snsdisabled = false;
                })
            } else if (this.section === 'nominee') {
                const url = `/proposalFormRoute/add_nominee/${userId}?plan_id=${this.plan_id}&session_id=${this.session_id}`;
                const body = {
                    "session_url": this.fullURL + '&step=three',
                    "sms_text": this.fullURL + '&step=three',
                    "sms_contact_no": this.savenshareObj.contactNumber,
                    "share_email_id": this.savenshareObj.emailId,
                    "first_name": this.proposal.nominee.first_name,
                    "last_name": this.proposal.nominee.last_name,
                    "age": parseInt(this.proposal.nominee.age),
                    "date_of_birth": 0,
                    "relationship_with_proposer": this.proposal.nominee.relationship_with_proposer
                }
                if (parseInt(this.proposal.nominee.age) < 18) {
                    body['appointee_data'] = [{
                        "first_name": this.proposal.appointee.appointeeName,
                        "last_name": this.proposal.appointee.appointeeName,
                        "age": (this.proposal.appointee.appointeeAge) ? parseInt(this.proposal.appointee.appointeeAge) : 0,
                        "relationship_with_proposer": this.proposal.appointee.appointeeRelationship
                    }]
                } else {
                    body['appointee_data'] = "";
                }
                this.proposalpageSMS(this.fullURL + '&step=three');
                this.commonService.post(url, body).subscribe(res => {
                    console.log(res)
                    this.toastr.success("Your data has been shared to EmailId and Mobile No provided", 'Success');
                    this.snsBtn = 'Save & Share';
                    this.snsdisabled = false;
                    this.modalRef2.hide();
                }, err => {
                    const errorMessage = err && err.message || 'Something goes wrong';
                    this.toastr.error(errorMessage, 'Error');
                    this.snsBtn = 'Save & Share';
                    this.snsdisabled = false;
                })
            } else if (this.section === 'medical') {
                //=======Medical History-----
                const url = `/proposalFormRoute/add_insured_members/${userId}?plan_id=${this.plan_id}&session_id=${this.session_id}`;
                const postBody = this.proposal.insured_member.map((el) => {
                    const occupation = this.occupation.find((occ) => occ.occupation_code == el.occupation);
                    return {
                        "session_url": this.fullURL + '&step=four',
                        "sms_text": this.fullURL + '&step=four',
                        "sms_contact_no": this.savenshareObj.contactNumber,
                        "share_email_id": this.savenshareObj.emailId,
                        "relationship_with_user": el.relationship_with_user,
                        "first_name": el.first_name,
                        "middle_name": el.middle_name,
                        "last_name": el.first_name,
                        "date_of_birth": `${el.date_of_birth.yy}-${el.date_of_birth.mm}-${el.date_of_birth.dd}`,
                        "marital_status": el.marital_status,
                        "gender": el.gender,
                        "height": el.height.ft + '.' + el.height.inch,
                        "weight": el.weight,
                        "aadhar_number": "",
                        "pan_card_no": "",
                        "contactNumber": "",
                        "emailId": "",
                        "occupation_id": (occupation) ? occupation.oc_id : '',
                        "has_ped": el.has_ped,
                        "medical_history": el.medical_history.filter(el => el.formvisible).map(m => {
                            return {
                                medical_history_id: m.medical_history_id,
                                recovery_status: m.current_status,
                                symptom_start_date: (m.symptom_start_date.mm && m.symptom_start_date.yy) ? m.symptom_start_date.yy + '-' + m.symptom_start_date.mm + '-01' : 0,
                                health_declined: m.health_declined
                            }
                        }),
                        medical_qa: el.medical_questions.map(qus => {
                            return {
                                plan_ques_map_id: qus.pqm_id,
                                question_code: qus.question_code,
                                answer: qus[qus['question_code']]
                            }
                        }),
                        "lifestyle": el.lifestyle.filter(el => el.checked).map(v => {
                            return {
                                lifestyle_id: v.lifestyle_id,
                                consumption_per_day: v.consumes
                            }
                        })
                    }
                })
                console.log("Medical History : ", postBody);
                this.proposalpageSMS(this.fullURL + '&step=four');
                this.commonService.post(url, postBody).subscribe(res => {
                    console.log(res)
                    this.toastr.success("Your data has been shared to EmailId and Mobile No provided", "Success");
                    this.snsBtn = 'Save & Share';
                    this.snsdisabled = false;
                    this.modalRef2.hide();
                }, err => {
                    const errorMessage = err && err.message || 'Something goes wrong';
                    this.toastr.error(errorMessage, 'Error');
                    this.snsBtn = 'Save & Share';
                    this.snsdisabled = false;
                })
            } else if (this.section === 'buylater') {
                this.previewSMS()
                this.buyLater()
            }
        }
    }

    proposalpageSMS(url:string) {
        const shortenURL = this.commonService.createbitlyshortlink(JSON.stringify({ "long_url": url + '&step=five', "domain": "bit.ly" })).subscribe(res => {
            console.log("SMS RES : ", res)
            let link = res.link
            const body = {
                "contactNumber": this.proposal.contactNumber,
                "clickLink": link
            };
            const url = `/smsRoute/proposal_form_page`;
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

    buyLater() {
        let postData = {
            "sms_contact_no": this.savenshareObj.contactNumber,
            "sms_text": this.fullURL + '&step=five',
            "user_id": this.userid,
            "session_url": this.fullURL + '&step=five',
            "session_id": this.session_id,
            "plan_id": this.plan_id
        }
        const url = `/proposalFormRoute/buy_later`;
        this.proposalpageSMS(this.fullURL + '&step=five');
        this.commonService.post(url, postData).subscribe(res => {
            console.log(res)
            this.toastr.success("Your data has been shared to EmailId and Mobile No provided", 'Success');
            this.snsBtn = 'Save & Share';
            this.snsdisabled = false;
        }, err => {
            const errorMessage = err && err.message || 'Something goes wrong';
            this.toastr.error(errorMessage, 'Error');
            this.snsBtn = 'Save & Share';
            this.snsdisabled = false;
        })
    }

    calculateAgeofInsuredMember(e, index) {
        var d = new Date();
        let currentYear = d.getFullYear();
        let diff = currentYear - parseInt(e.target.value);
        if (diff < 18) {
            this.proposal.insured_member[index]['marital_status_flag'] = false;
            this.proposal.insured_member[index]['marital_status'] = 'Single';
        } else {
            this.proposal.insured_member[index]['marital_status_flag'] = true;
        }
    }

    validateOTP() {
        if (!this.otp) {
            this.toastr.error("Please enter the OTP sent to your mobile", "Error");
            return;
        }
        const url = `/loginSignupRoute/login_with_otp`;
        let body = {
            "contactNumber": this.proposal.contactNumber,
            "login_otp": this.otp,
            "userType": "customer"
        }
        this.commonService.post(url, body).subscribe((response) => {
            if (response.error.errorCode === 200) {
                if (response.data.length > 0) {
                    this.modalRef.hide();
                    //this.toastr.success("OTP validated successfully", "Success");
                    this.proposalSubmit()
                } else {
                    this.toastr.error("Invalid OTP", "Error");
                }
            }
        }, (error) => {
            //console.log("error ts: ", error);
            //this.otppopup.hide();
            let msg = error.error.error.errorMessage || 'Something went wrong';
            this.toastr.error(msg, "Error");
        });
    }

    proposalSubmit() {
        this.btnText = 'Please wait...';
        this.btndisabled = true;
        if (this.company_special_id == '2') {
            //STAR = 2
            this.star()
        } else if (this.company_special_id == '1') {
            //RELIGARE = 1
            this.religare()
        } else if (this.company_special_id == '3') {
            //Aditya Birla
            this.aditya()
        } else {
            this.btnText = 'Buy Now';
            this.hdfc()
        }
    }

    getCitybyPincodeforStar(pincode, cityid) {
        this.cityList = [];
        const url = `/tpRoute/care`;
        const postBody = {
            type: 'GET',
            url: constant.star_endpoint + `/api/policy/city/details?APIKEY=${constant.APIKEY}&SECRETKEY=${constant.SECRETKEY}&pincode=${pincode}`,
            header: {},
            data: null
        }
        this.commonService.post(url, postBody).subscribe(res => {
            console.log(res)
            if (res.data.city.length > 0) {
                this.cityList = res.data.city.map(e => {
                    return {
                        id: e.city_id,
                        city_name: e.city_name
                    }
                })
                this.proposal.address.city_id = cityid;
                this.getAreabyCityforStar(cityid);
            } else {
                this.toastr.error('No City Available In This Pincode', "WARNING");
            }
        }, err => {
            this.ngxLoader.stop()
            this.toastr.error('Something went wrong', "Error");
        })
    }

    getAreabyCityforStar(cityId) {
        this.areaList = [];
        const url = `/tpRoute/care`;
        const postBody = {
            type: 'GET',
            url: constant.star_endpoint + `/api/policy/address/details?APIKEY=${constant.APIKEY}&SECRETKEY=${constant.SECRETKEY}&pincode=${this.proposal.address.pincode}&city_id=${cityId}`,
            header: {},
            data: null
        }
        this.commonService.post(url, postBody).subscribe(res => {
            console.log(res)
            this.ngxLoader.stop()
            if (res.data.area.length > 0) {
                this.areaList = res.data.area;
                //this.proposal.address.area = areaId
            } else {
                this.toastr.error('No Area Available In This City', "WARNING");
            }
        }, err => {
            this.ngxLoader.stop()
            this.toastr.error('Something went wrong', "Error");
        })
    }

    onPincodeSelect(event: TypeaheadMatch) {
        if (this.company_special_id == '2' && event.item != '') {
            this.ngxLoader.start()
            const url = `/tpRoute/care`;
            const postBody = {
                type: 'GET',
                url: constant.star_endpoint + `/api/policy/city/details?APIKEY=${constant.APIKEY}&SECRETKEY=${constant.SECRETKEY}&pincode=${event.item}`,
                header: {},
                data: null
            }
            this.commonService.post(url, postBody).subscribe(res => {
                console.log(res)
                this.ngxLoader.stop()
                if (res.data.city.length > 0) {
                    this.cityList = res.data.city.map(e => {
                        return {
                            id: e.city_id,
                            city_name: e.city_name
                        }
                    })
                } else {
                    this.toastr.error('No City Available In This Pincode', "WARNING");
                }
            }, err => {
                this.ngxLoader.stop()
                this.toastr.error('Something went wrong', "Error");
            })
        }
    }

    getAreaID() {
        if (this.company_special_id == '2') {
            this.ngxLoader.start()
            const url = `/tpRoute/care`;
            const postBody = {
                type: 'GET',
                url: constant.star_endpoint + `/api/policy/address/details?APIKEY=${constant.APIKEY}&SECRETKEY=${constant.SECRETKEY}&pincode=${this.proposal.address.pincode}&city_id=${this.proposal.address.city_id}`,
                header: {},
                data: null
            }
            this.commonService.post(url, postBody).subscribe(res => {
                console.log(res)
                this.ngxLoader.stop()
                if (res.data.area.length > 0) {
                    this.areaList = res.data.area
                } else {
                    this.toastr.error('No Area Available In This City', "WARNING");
                }
            }, err => {
                this.ngxLoader.stop()
                this.toastr.error('Something went wrong', "Error");
            })
        }
    }

    changeMaritalStatus() {
        if (this.proposal.marital_status === 'Single') {
            this.nomineeRelations = this.nomineeRelations.filter(nom => nom.value !== 'Spouse');
        } else {
            this.getNomineeRelations();
        }
    }


    requestOtp(resend?) {
        var regexcontactNo = constant.mobilevalidateregex;
        if (!regexcontactNo.test(this.proposal.contactNumber)) {
            this.toastr.error('Please enter a valid 10 digit mobile number', "Error");
            return false;
        } else {
            const url = `/loginSignupRoute/request_login_otp`;
            let body = {
                "contactNumber": this.proposal.contactNumber,
                "userType": "customer",
                "policy_purchase": 'true'
            }
            this.commonService.post(url, body).subscribe((response) => {
                if (response.error.errorCode === 200) {
                    console.log(response)
                    if (response.data.length > 0) {
                        this.toastr.success("OTP has been sent to your mobile no", "Success");
                        if (!resend) {
                            this.modalRef = this.modalService.show(this.otppopup, { class: 'common-popup', backdrop: true, ignoreBackdropClick: true });
                        }
                        //this.OTPpopup()
                    } else {
                        alert('There is some error');
                    }
                }
            }, (error) => {
                console.log("error ts: ", error);
                this.toastr.error(error.error.error.errorMessage || 'Please try after sometime', "Error");
            });
        }
    }

    getMedicalQuestionarries() {
        let promise = new Promise((resolve, reject) => {
            const url = `/planRoute/listPlanQuestion?page=0&order_by=2&search=&plan_id=${this.plan_id}`;
            this.commonService.get(url).subscribe((response) => {
                if (response.error.errorCode === 200) {

                    console.log("Questionarries : ", response);
                    const medical_questions = response.data.rows.map(el => {
                        return {
                            pqm_id: el.pqm_id,
                            question_code: el.question_code,
                            existing_since_code: el.question_existingsince_code,
                            question_title: el.question_title,
                            question_desc: el.question_desc,
                            criticalIllness: 'false',
                            isPersonalAccidentApplicable: '',
                            illness: '',
                            ManualLabour: '',
                            WinterSports: '',
                            diabetes: {
                                diabetesMellitus: '',
                                insulinProblem: '',
                                insulinFrom: '',
                                bloodSugar: '',
                                serumCreatinine: '',
                                hba1c: ''
                            },
                        }
                    });
                    this.countmedicalQus = medical_questions.length;
                    resolve(medical_questions)
                }
            }, (error) => {
                console.log("error ts: ", error);
                reject(error)
            });
        })
        return promise;
    }

    welcomeFormFillingSMS() {
        const shortenURL = this.commonService.createbitlyshortlink(JSON.stringify({ "long_url": this.fullURL + '&step=one', "domain": "bit.ly" })).subscribe(res => {
            console.log("SMS RES : ", res)
            let link = res.link
            const body = {
                "contactNumber": this.proposal.contactNumber,
                "clickLink": link
            };
            const url = `/smsRoute/welcome_form_filling`;
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

    CheckBMI(height, weight) {
        let BMI = 0;
        let calcheight = (height / 100) * (height / 100);
        BMI = weight / calcheight;
        return BMI;
    }

    // abandoned 
    getQuestionarries() {
        this.ngxLoader.start();
        const url = `/planRoute/listPlanQuestion?page=0&order_by=2&search=&plan_id=${this.plan_id}`;
        this.commonService.get(url).subscribe((response) => {
            if (response.error.errorCode === 200) {
                this.ngxLoader.stop();
                console.log("Questionarries : ", response);
                this.proposal.insured_member = this.proposal.insured_member.map(mem => {
                    mem['medical_questions'] = response.data.rows.map(el => {
                        return {
                            pqm_id: el.pqm_id,
                            question_code: el.question_code,
                            question_title: el.question_title,
                            question_desc: el.question_desc,
                            criticalIllness: 'false',
                            isPersonalAccidentApplicable: '',
                            illness: '',
                            ManualLabour: '',
                            WinterSports: '',
                            diabetes: {
                                diabetesMellitus: '',
                                insulinProblem: '',
                                insulinFrom: '',
                                bloodSugar: '',
                                serumCreatinine: '',
                                hba1c: ''
                            },
                        }
                    });
                    return mem
                })

                console.log("Insured Member : ", this.proposal.insured_member)

            }
        }, (error) => {
            console.log("error ts: ", error);
            let msg = error.error.error.errorMessage || 'Something went wrong';
            this.toastr.error(msg, "Error");
        });
    }
    // abandoned 
    buyLater1() {
        let postData = {
            plan_details: {
                plan_id: this.plan_id,
                premium_id: this.premium_id
            },
            user_details: {
                first_name: this.proposal.first_name,
                middle_name: this.proposal.middle_name,
                last_name: this.proposal.last_name,
                date_of_birth: this.proposal.dob.yy + '-' + this.proposal.dob.mm + '-' + this.proposal.dob.dd,
                marital_status: this.proposal.marital_status,
                gender: this.proposal.gender,
                height: this.proposal.height.ft + '.' + this.proposal.height.inch,
                weight: this.proposal.weight,
                occupation: this.proposal.occupation,
                pan_card_no: this.proposal.pan,
                politically_exposed: '',
                medical_practioner_id: '',
                medical_council: '',
                workplace_address: "",
                emailId: this.proposal.emailId,
                contactNumber: this.proposal.contactNumber,
                address: this.proposal.address,
            },
            nominee: {
                first_name: this.proposal.nominee.first_name,
                last_name: this.proposal.nominee.last_name,
                relationship_with_proposer: this.proposal.nominee.relationship_with_proposer,
                //date_of_birth: this.proposal.nominee.date_of_birth.yy + '-' + this.proposal.nominee.date_of_birth.mm + '-' + this.proposal.nominee.date_of_birth.dd,
            },
            relationships: this.proposal.insured_member.map(rel => {
                return {
                    relationship_with_user: rel.relationship_with_proposer,
                    first_name: rel.first_name,
                    last_name: rel.last_name,
                    date_of_birth: rel.date_of_birth.yy + '-' + rel.date_of_birth.mm + '-' + rel.date_of_birth.dd,
                    height: rel.height.ft + '.' + rel.height.inch,
                    marital_status: rel.marital_status,
                    weight: rel.weight,
                    gender: rel.gender,
                    aadhar_number: '',
                    pan_card_no: rel.pan,
                    contactNumber: '',
                    emailId: '',
                    has_ped: rel.has_ped,
                    medical_history: [],
                    lifestyle: rel.lifestyle.filter(el => {
                        return el.lifestyle_id
                    })
                }
            }).map(filtered => {
                if (!filtered.has_ped) {
                    delete filtered.medical_history
                    delete filtered.has_ped
                }
                return filtered
            })
        }

        console.log(postData)
        const url = `/proposalFormRoute/add`;
        this.commonService.post(url, postData).subscribe(res => {
            console.log(res)
            this.toastr.success("Saved successfully", 'Success');
            this.snsBtn = 'Save & Share';
            this.snsdisabled = false;
        }, err => {
            const errorMessage = err && err.message || 'Something goes wrong';
            this.toastr.error(errorMessage, 'Error');
            this.snsBtn = 'Save & Share';
            this.snsdisabled = false;
        })
    }

    // abandoned 
    OTPpopup() {
        var _self = this;
        $.confirm({
            title: 'Please enter the OTP sent to your mobile!',
            content: '' +
                '<form action="" class="formName">' +
                '<div class="form-group">' +
                '<label>Enter OTP here</label>' +
                '<input type="text" placeholder="Enter OTP" class="otp form-control" required />' +
                '</div>' +
                '</form>',
            buttons: {
                formSubmit: {
                    text: 'Submit',
                    btnClass: 'btn-blue',
                    action: function () {
                        var otp = this.$content.find('.otp').val();
                        if (!otp) {
                            $.alert('Please provide OTP');
                            return false;
                        } else {
                            //_self.validateOTP(otp)
                        }
                        //_selt.proposalSubmit()
                    }
                },
                resend: function () {
                    _self.requestOtp()
                },
            },
            onContentReady: function () {
                // bind to events
                var jc = this;
                this.$content.find('form').on('submit', function (e) {
                    // if the user submits the form by pressing enter in the field.
                    e.preventDefault();
                    jc.$$formSubmit.trigger('click'); // reference the button and click it
                });
            }
        });
    }
}
