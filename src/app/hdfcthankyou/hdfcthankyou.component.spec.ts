import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HdfcthankyouComponent } from './hdfcthankyou.component';

describe('HdfcthankyouComponent', () => {
  let component: HdfcthankyouComponent;
  let fixture: ComponentFixture<HdfcthankyouComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HdfcthankyouComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HdfcthankyouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
