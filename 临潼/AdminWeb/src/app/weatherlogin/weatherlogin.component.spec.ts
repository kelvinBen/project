import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherloginComponent } from './weatherlogin.component';

describe('WeatherloginComponent', () => {
  let component: WeatherloginComponent;
  let fixture: ComponentFixture<WeatherloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
