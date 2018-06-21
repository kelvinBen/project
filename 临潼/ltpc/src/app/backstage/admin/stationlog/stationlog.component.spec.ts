import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationlogComponent } from './stationlog.component';

describe('StationlogComponent', () => {
  let component: StationlogComponent;
  let fixture: ComponentFixture<StationlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
