import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XiaooilComponent } from './xiaooil.component';

describe('XiaooilComponent', () => {
  let component: XiaooilComponent;
  let fixture: ComponentFixture<XiaooilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XiaooilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XiaooilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
