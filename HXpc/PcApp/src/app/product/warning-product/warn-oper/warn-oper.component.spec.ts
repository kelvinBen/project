import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarnOperComponent } from './warn-oper.component';

describe('WarnOperComponent', () => {
  let component: WarnOperComponent;
  let fixture: ComponentFixture<WarnOperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarnOperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarnOperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
