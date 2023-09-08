import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FourwheelerComponent } from './fourwheeler.component';

describe('FourwheelerComponent', () => {
  let component: FourwheelerComponent;
  let fixture: ComponentFixture<FourwheelerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FourwheelerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FourwheelerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
