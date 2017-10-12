import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HDetectionComponent } from './h-detection.component';

describe('HDetectionComponent', () => {
  let component: HDetectionComponent;
  let fixture: ComponentFixture<HDetectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HDetectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
