import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalAndAdminPoliciesComponent } from './legal-and-admin-policies.component';

describe('LegalAndAdminPoliciesComponent', () => {
  let component: LegalAndAdminPoliciesComponent;
  let fixture: ComponentFixture<LegalAndAdminPoliciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalAndAdminPoliciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalAndAdminPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
