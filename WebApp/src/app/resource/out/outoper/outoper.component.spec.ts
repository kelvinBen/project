import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutoperComponent } from './outoper.component';

describe('OutoperComponent', () => {
  let component: OutoperComponent;
  let fixture: ComponentFixture<OutoperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutoperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutoperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
