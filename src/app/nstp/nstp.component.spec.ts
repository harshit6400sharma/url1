import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NstpComponent } from './nstp.component';

describe('NstpComponent', () => {
  let component: NstpComponent;
  let fixture: ComponentFixture<NstpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NstpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NstpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
