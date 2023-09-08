import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListedPlansComponent } from './listed-plans.component';

describe('ListedPlansComponent', () => {
  let component: ListedPlansComponent;
  let fixture: ComponentFixture<ListedPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListedPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListedPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
