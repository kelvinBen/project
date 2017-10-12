import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadarDetectionComponent } from './radar-detection.component';

describe('RadarDetectionComponent', () => {
  let component: RadarDetectionComponent;
  let fixture: ComponentFixture<RadarDetectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadarDetectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadarDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
