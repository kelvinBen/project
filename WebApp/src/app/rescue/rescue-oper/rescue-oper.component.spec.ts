import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RescueOperComponent } from './rescue-oper.component';

describe('RescueOperComponent', () => {
  let component: RescueOperComponent;
  let fixture: ComponentFixture<RescueOperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RescueOperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RescueOperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
