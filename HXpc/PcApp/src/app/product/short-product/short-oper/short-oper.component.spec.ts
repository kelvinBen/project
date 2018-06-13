import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortOperComponent } from './short-oper.component';

describe('ShortOperComponent', () => {
  let component: ShortOperComponent;
  let fixture: ComponentFixture<ShortOperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortOperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortOperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
