import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFileoperComponent } from './admin-fileoper.component';

describe('AdminFileoperComponent', () => {
  let component: AdminFileoperComponent;
  let fixture: ComponentFixture<AdminFileoperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFileoperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFileoperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
