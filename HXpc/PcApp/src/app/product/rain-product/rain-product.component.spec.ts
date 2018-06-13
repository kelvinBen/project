import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RainProductComponent } from './rain-product.component';

describe('RainProductComponent', () => {
  let component: RainProductComponent;
  let fixture: ComponentFixture<RainProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RainProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RainProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
