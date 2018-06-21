import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminstationaddComponent } from './adminstationadd.component';

describe('AdminstationaddComponent', () => {
  let component: AdminstationaddComponent;
  let fixture: ComponentFixture<AdminstationaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminstationaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminstationaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
