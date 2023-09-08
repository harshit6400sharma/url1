import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwowheelProposalComponent } from './twowheel-proposal.component';

describe('TwowheelProposalComponent', () => {
  let component: TwowheelProposalComponent;
  let fixture: ComponentFixture<TwowheelProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwowheelProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwowheelProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
