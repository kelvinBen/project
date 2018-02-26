import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HTenComponent } from './h-ten.component';

describe('HTenComponent', () => {
  let component: HTenComponent;
  let fixture: ComponentFixture<HTenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HTenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HTenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
