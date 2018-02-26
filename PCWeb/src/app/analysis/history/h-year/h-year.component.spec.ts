import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HYearComponent } from './h-year.component';

describe('HYearComponent', () => {
  let component: HYearComponent;
  let fixture: ComponentFixture<HYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
