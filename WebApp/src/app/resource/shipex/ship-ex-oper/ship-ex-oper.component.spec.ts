import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipExOperComponent } from './ship-ex-oper.component';

describe('ShipExOperComponent', () => {
  let component: ShipExOperComponent;
  let fixture: ComponentFixture<ShipExOperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipExOperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipExOperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
