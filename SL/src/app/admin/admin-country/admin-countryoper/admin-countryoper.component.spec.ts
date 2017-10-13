import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCountryoperComponent } from './admin-countryoper.component';

describe('AdminCountryoperComponent', () => {
  let component: AdminCountryoperComponent;
  let fixture: ComponentFixture<AdminCountryoperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCountryoperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCountryoperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
