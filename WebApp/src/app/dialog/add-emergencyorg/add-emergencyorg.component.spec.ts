import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmergencyorgComponent } from './add-emergencyorg.component';

describe('AddEmergencyorgComponent', () => {
  let component: AddEmergencyorgComponent;
  let fixture: ComponentFixture<AddEmergencyorgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmergencyorgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmergencyorgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
