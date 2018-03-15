import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeiyouComponent } from './weiyou.component';

describe('WeiyouComponent', () => {
  let component: WeiyouComponent;
  let fixture: ComponentFixture<WeiyouComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeiyouComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeiyouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
