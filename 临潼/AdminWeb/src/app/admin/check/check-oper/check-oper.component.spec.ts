import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOperComponent } from './check-oper.component';

describe('CheckOperComponent', () => {
  let component: CheckOperComponent;
  let fixture: ComponentFixture<CheckOperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckOperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckOperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
