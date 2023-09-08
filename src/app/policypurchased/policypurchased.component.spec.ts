import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicypurchasedComponent } from './policypurchased.component';

describe('PolicypurchasedComponent', () => {
  let component: PolicypurchasedComponent;
  let fixture: ComponentFixture<PolicypurchasedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicypurchasedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicypurchasedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
