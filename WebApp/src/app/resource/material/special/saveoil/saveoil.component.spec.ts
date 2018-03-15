import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveoilComponent } from './saveoil.component';

describe('SaveoilComponent', () => {
  let component: SaveoilComponent;
  let fixture: ComponentFixture<SaveoilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveoilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveoilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
