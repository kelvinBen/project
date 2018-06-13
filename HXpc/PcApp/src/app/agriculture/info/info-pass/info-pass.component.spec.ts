import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPassComponent } from './info-pass.component';

describe('InfoPassComponent', () => {
  let component: InfoPassComponent;
  let fixture: ComponentFixture<InfoPassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoPassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
