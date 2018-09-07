import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOperComponent } from './admin-oper.component';

describe('AdminOperComponent', () => {
  let component: AdminOperComponent;
  let fixture: ComponentFixture<AdminOperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
