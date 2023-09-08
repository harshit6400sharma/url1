import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SatisfiedClientComponent } from './satisfied-client.component';

describe('SatisfiedClientComponent', () => {
  let component: SatisfiedClientComponent;
  let fixture: ComponentFixture<SatisfiedClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SatisfiedClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SatisfiedClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
