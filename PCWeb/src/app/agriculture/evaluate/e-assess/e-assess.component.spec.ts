import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EAssessComponent } from './e-assess.component';

describe('EAssessComponent', () => {
  let component: EAssessComponent;
  let fixture: ComponentFixture<EAssessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EAssessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EAssessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
