import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationlogaddComponent } from './stationlogadd.component';

describe('StationlogaddComponent', () => {
  let component: StationlogaddComponent;
  let fixture: ComponentFixture<StationlogaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationlogaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationlogaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
