import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EMonitorComponent } from './e-monitor.component';

describe('EMonitorComponent', () => {
  let component: EMonitorComponent;
  let fixture: ComponentFixture<EMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
