import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MDetectionComponent } from './m-detection.component';

describe('MDetectionComponent', () => {
  let component: MDetectionComponent;
  let fixture: ComponentFixture<MDetectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MDetectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
