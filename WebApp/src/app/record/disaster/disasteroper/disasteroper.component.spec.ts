import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisasteroperComponent } from './disasteroper.component';

describe('DisasteroperComponent', () => {
  let component: DisasteroperComponent;
  let fixture: ComponentFixture<DisasteroperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisasteroperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisasteroperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
