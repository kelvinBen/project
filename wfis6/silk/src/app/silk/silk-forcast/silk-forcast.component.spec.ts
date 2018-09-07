import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SilkForcastComponent } from './silk-forcast.component';

describe('SilkForcastComponent', () => {
  let component: SilkForcastComponent;
  let fixture: ComponentFixture<SilkForcastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SilkForcastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SilkForcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
