import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyCompareComponent } from './policy-compare.component';

describe('PolicyCompareComponent', () => {
  let component: PolicyCompareComponent;
  let fixture: ComponentFixture<PolicyCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
