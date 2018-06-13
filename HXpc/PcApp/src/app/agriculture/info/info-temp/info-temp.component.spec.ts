import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoTempComponent } from './info-temp.component';

describe('InfoTempComponent', () => {
  let component: InfoTempComponent;
  let fixture: ComponentFixture<InfoTempComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoTempComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
