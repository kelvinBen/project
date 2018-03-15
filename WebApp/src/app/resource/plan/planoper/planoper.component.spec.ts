import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanoperComponent } from './planoper.component';

describe('PlanoperComponent', () => {
  let component: PlanoperComponent;
  let fixture: ComponentFixture<PlanoperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanoperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanoperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
