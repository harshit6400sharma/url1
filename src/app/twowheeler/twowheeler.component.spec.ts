import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwowheelerComponent } from './twowheeler.component';

describe('TwowheelerComponent', () => {
  let component: TwowheelerComponent;
  let fixture: ComponentFixture<TwowheelerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwowheelerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwowheelerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
