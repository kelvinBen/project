import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipeComponent } from './shipe.component';

describe('ShipeComponent', () => {
  let component: ShipeComponent;
  let fixture: ComponentFixture<ShipeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
