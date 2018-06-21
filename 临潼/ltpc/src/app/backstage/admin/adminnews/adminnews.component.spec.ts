import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminnewsComponent } from './adminnews.component';

describe('AdminnewsComponent', () => {
  let component: AdminnewsComponent;
  let fixture: ComponentFixture<AdminnewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminnewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminnewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
