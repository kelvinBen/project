import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoDryComponent } from './info-dry.component';

describe('InfoDryComponent', () => {
  let component: InfoDryComponent;
  let fixture: ComponentFixture<InfoDryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoDryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoDryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
