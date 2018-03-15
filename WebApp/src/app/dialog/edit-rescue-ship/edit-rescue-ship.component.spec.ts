import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRescueShipComponent } from './edit-rescue-ship.component';

describe('EditRescueShipComponent', () => {
  let component: EditRescueShipComponent;
  let fixture: ComponentFixture<EditRescueShipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRescueShipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRescueShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
