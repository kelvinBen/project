import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThunderDetectionComponent } from './thunder-detection.component';

describe('ThunderDetectionComponent', () => {
  let component: ThunderDetectionComponent;
  let fixture: ComponentFixture<ThunderDetectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThunderDetectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThunderDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
