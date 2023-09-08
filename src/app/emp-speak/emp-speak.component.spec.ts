import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpSpeakComponent } from './emp-speak.component';

describe('EmpSpeakComponent', () => {
  let component: EmpSpeakComponent;
  let fixture: ComponentFixture<EmpSpeakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpSpeakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpSpeakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
