import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFileComponent } from './admin-file.component';

describe('AdminFileComponent', () => {
  let component: AdminFileComponent;
  let fixture: ComponentFixture<AdminFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
