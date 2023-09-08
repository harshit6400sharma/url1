import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Ng5SliderModule } from 'ng5-slider';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { HealthComponent } from './health/health.component';
import { QuotesComponent } from './quotes/quotes.component';
import { TwowheelerComponent } from './twowheeler/twowheeler.component';
import { FourwheelerComponent } from './fourwheeler/fourwheeler.component';
import { TravelComponent } from './travel/travel.component';
import { CorporateComponent } from './corporate/corporate.component';
import { TermComponent } from './term/term.component';
import { CommercialComponent } from './commercial/commercial.component';
import { ProposalComponent } from './proposal/proposal.component';
import { SatisfiedClientComponent } from './satisfied-client/satisfied-client.component';
import { PolicyCompareComponent } from './policy-compare/policy-compare.component';
import { DatePipe } from '@angular/common';
import { ReligarePaymentComponent } from './religare-payment/religare-payment.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { CareerComponent } from './career/career.component';
import { ContactComponent } from './contact/contact.component';
import { LegalAndAdminPoliciesComponent } from './legal-and-admin-policies/legal-and-admin-policies.component';
import { ComplaintComponent } from './complaint/complaint.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { PagenotfountComponent } from './pagenotfount/pagenotfount.component';
import { FailedComponent } from './failed/failed.component';
import { ComplaintHandlingComponent } from './complaint-handling/complaint-handling.component';
import { PartnersComponent } from './partners/partners.component';
import { ListedPlansComponent } from './listed-plans/listed-plans.component';
import { PrivecypolicyComponent } from './privecypolicy/privecypolicy.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { SupportComponent } from './support/support.component';
import { UsermenuComponent } from './usermenu/usermenu.component';
import { PolicypurchasedComponent } from './policypurchased/policypurchased.component';
import { NstpComponent } from './nstp/nstp.component';
import { CallusComponent } from './callus/callus.component';
import { EmpSpeakComponent } from './emp-speak/emp-speak.component';
import { HdfcthankyouComponent } from './hdfcthankyou/hdfcthankyou.component';
import { TwowheelProposalComponent } from './twowheel-proposal/twowheel-proposal.component';
import { HealthQuoteComponent } from './health-quote/health-quote.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    HealthComponent,
    QuotesComponent,
    TwowheelerComponent,
    FourwheelerComponent,
    TravelComponent,
    CorporateComponent,
    TermComponent,
    CommercialComponent,
    ProposalComponent,
    SatisfiedClientComponent,
    PolicyCompareComponent,
    ReligarePaymentComponent,
    PaymentSuccessComponent,
    CareerComponent,
    ContactComponent,
    LegalAndAdminPoliciesComponent,
    ComplaintComponent,
    PurchaseComponent,
    PagenotfountComponent,
    FailedComponent,
    ComplaintHandlingComponent,
    PartnersComponent,
    ListedPlansComponent,
    PrivecypolicyComponent,
    ThankyouComponent,
    UserprofileComponent,
    SupportComponent,
    UsermenuComponent,
    PolicypurchasedComponent,
    NstpComponent,
    CallusComponent,
    EmpSpeakComponent,
    HdfcthankyouComponent,
    TwowheelProposalComponent,
    HealthQuoteComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    Ng5SliderModule,
    HttpClientModule,
    TypeaheadModule.forRoot(),
    TabsModule.forRoot(),
    CollapseModule.forRoot(),
    TooltipModule.forRoot(),
    AccordionModule.forRoot(),
    ModalModule.forRoot(),

    BsDatepickerModule.forRoot(),
    NgxUiLoaderModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }),
  ],
  providers: [DatePipe,Title],
  bootstrap: [AppComponent],
  entryComponents:[
    LegalAndAdminPoliciesComponent
  ]
})
export class AppModule { }
