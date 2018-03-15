import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelicopterOperComponent } from './helicopter-oper.component';

describe('HelicopterOperComponent', () => {
  let component: HelicopterOperComponent;
  let fixture: ComponentFixture<HelicopterOperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelicopterOperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelicopterOperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
