import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReligarePaymentComponent } from './religare-payment.component';

describe('ReligarePaymentComponent', () => {
  let component: ReligarePaymentComponent;
  let fixture: ComponentFixture<ReligarePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReligarePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReligarePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
