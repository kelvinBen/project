import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainoperComponent } from './trainoper.component';

describe('TrainoperComponent', () => {
  let component: TrainoperComponent;
  let fixture: ComponentFixture<TrainoperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainoperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainoperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
