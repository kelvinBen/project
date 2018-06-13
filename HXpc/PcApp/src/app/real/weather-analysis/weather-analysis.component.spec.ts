import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherAnalysisComponent } from './weather-analysis.component';

describe('WeatherAnalysisComponent', () => {
  let component: WeatherAnalysisComponent;
  let fixture: ComponentFixture<WeatherAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
