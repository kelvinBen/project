import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminstationComponent } from './adminstation.component';

describe('AdminstationComponent', () => {
  let component: AdminstationComponent;
  let fixture: ComponentFixture<AdminstationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminstationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminstationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
