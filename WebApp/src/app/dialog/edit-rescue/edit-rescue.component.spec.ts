import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRescueComponent } from './edit-rescue.component';

describe('EditRescueComponent', () => {
  let component: EditRescueComponent;
  let fixture: ComponentFixture<EditRescueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRescueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRescueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
