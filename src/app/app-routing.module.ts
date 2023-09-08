import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { CareerComponent } from './career/career.component';
import { CommercialComponent } from './commercial/commercial.component';
import { ComplaintHandlingComponent } from './complaint-handling/complaint-handling.component';
import { ComplaintComponent } from './complaint/complaint.component';
import { ContactComponent } from './contact/contact.component';
import { CorporateComponent } from './corporate/corporate.component';
import { FailedComponent } from './failed/failed.component';
import { FourwheelerComponent } from './fourwheeler/fourwheeler.component';
import { HdfcthankyouComponent } from './hdfcthankyou/hdfcthankyou.component';
import { HealthComponent } from './health/health.component';
import { HomeComponent } from './home/home.component';
//import { LegalAndAdminPoliciesComponent } from './legal-and-admin-policies/legal-and-admin-policies.component';
import { ListedPlansComponent } from './listed-plans/listed-plans.component';
import { NstpComponent } from './nstp/nstp.component';
import { PagenotfountComponent } from './pagenotfount/pagenotfount.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PolicyCompareComponent } from './policy-compare/policy-compare.component';
import { PolicypurchasedComponent } from './policypurchased/policypurchased.component';
import { PrivecypolicyComponent } from './privecypolicy/privecypolicy.component';
import { ProposalComponent } from './proposal/proposal.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { QuotesComponent } from './quotes/quotes.component';
import { ReligarePaymentComponent } from './religare-payment/religare-payment.component';
import { SupportComponent } from './support/support.component';
import { TermComponent } from './term/term.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { TravelComponent } from './travel/travel.component';
import { TwowheelProposalComponent } from './twowheel-proposal/twowheel-proposal.component';
import { HealthQuoteComponent } from './health-quote/health-quote.component';

import { TwowheelerComponent } from './twowheeler/twowheeler.component';
import { UserprofileComponent } from './userprofile/userprofile.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  //{ path: 'about', component: AboutComponent, data: { title: 'About Title' } },
  { path: 'about', component: AboutComponent },
  { path: 'health', component: HealthComponent},
  { path: 'health-quote', component: HealthQuoteComponent},
  { path: 'health-insurance', component: HealthComponent },
  { path: 'two-wheeler', component: TwowheelerComponent },
  { path: 'two-wheeler-proposal', component: TwowheelProposalComponent },
  { path: 'two-wheeler-insurance', component: TwowheelerComponent },
  { path: 'four-wheeler', component: FourwheelerComponent },
  { path: 'four-wheeler-insurance', component: FourwheelerComponent },
  { path: 'commercial-vehicle', component: CommercialComponent },
  { path: 'commercial-vehicle-insurance', component: CommercialComponent },
  { path: 'corporate', component: CorporateComponent },
  { path: 'corporate-insurance', component: CorporateComponent },
  { path: 'travel', component: TravelComponent },
  { path: 'travel-insurance', component: TravelComponent },
  { path: 'term', component: TermComponent },
  { path: 'term-insurance', component: TermComponent },
  { path: 'quotes', component: QuotesComponent },
  { path: 'proposal', component: ProposalComponent },
  { path: 'compare', component: PolicyCompareComponent },
  { path: 'career', component: CareerComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'care/payment-success', component: ReligarePaymentComponent },
  { path: 'star/payment-success', component: PaymentSuccessComponent },
  { path: 'hdfc/payment-success', component: HdfcthankyouComponent },
  { path: 'purchase', component: PurchaseComponent },
  { path: 'abhi/thankyou', component: ThankyouComponent },
  { path: 'legal-and-admin-policies', component: PrivecypolicyComponent },
  { path: 'terms_and_conditions', component: PrivecypolicyComponent },
  { path: 'privacy_policy', component: PrivecypolicyComponent },
  { path: 'complaint', component: ComplaintComponent },
  { path: 'not-found', component: PagenotfountComponent },
  { path: 'failed', component: FailedComponent },
  { path: 'listed-plans', component: ListedPlansComponent },
  { path: 'userprofile/dashboard', component: UserprofileComponent },
  { path: 'userprofile/policy_searches', component: UserprofileComponent },
  { path: 'userprofile/policy_purchased', component: PolicypurchasedComponent },
  { path: 'complaint-handling-process', component: ComplaintHandlingComponent },
  { path: 'nstp', component: NstpComponent },
  { path: 'support', component: SupportComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
