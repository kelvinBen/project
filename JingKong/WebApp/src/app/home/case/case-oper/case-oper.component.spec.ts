import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseOperComponent } from './case-oper.component';

describe('CaseOperComponent', () => {
  let component: CaseOperComponent;
  let fixture: ComponentFixture<CaseOperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseOperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseOperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
