import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperComponent } from './oper.component';

describe('OperComponent', () => {
  let component: OperComponent;
  let fixture: ComponentFixture<OperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
