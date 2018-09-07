import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipeOperComponent } from './shipe-oper.component';

describe('ShipeOperComponent', () => {
  let component: ShipeOperComponent;
  let fixture: ComponentFixture<ShipeOperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipeOperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipeOperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
