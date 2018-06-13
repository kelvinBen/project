import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SunshineComponent } from './sunshine.component';

describe('SunshineComponent', () => {
  let component: SunshineComponent;
  let fixture: ComponentFixture<SunshineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SunshineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SunshineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
