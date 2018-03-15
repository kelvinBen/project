import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsoperComponent } from './goodsoper.component';

describe('GoodsoperComponent', () => {
  let component: GoodsoperComponent;
  let fixture: ComponentFixture<GoodsoperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsoperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsoperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
