import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminnewsaddComponent } from './adminnewsadd.component';

describe('AdminnewsaddComponent', () => {
  let component: AdminnewsaddComponent;
  let fixture: ComponentFixture<AdminnewsaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminnewsaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminnewsaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
