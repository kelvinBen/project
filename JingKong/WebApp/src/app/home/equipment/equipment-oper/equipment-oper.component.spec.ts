import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentOperComponent } from './equipment-oper.component';

describe('EquipmentOperComponent', () => {
  let component: EquipmentOperComponent;
  let fixture: ComponentFixture<EquipmentOperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentOperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentOperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
