import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HDayComponent } from './h-day.component';

describe('HDayComponent', () => {
  let component: HDayComponent;
  let fixture: ComponentFixture<HDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
