import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminlogviewComponent } from './adminlogview.component';

describe('AdminlogviewComponent', () => {
  let component: AdminlogviewComponent;
  let fixture: ComponentFixture<AdminlogviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminlogviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminlogviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
