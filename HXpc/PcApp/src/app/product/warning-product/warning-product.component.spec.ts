import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningProductComponent } from './warning-product.component';

describe('WarningProductComponent', () => {
  let component: WarningProductComponent;
  let fixture: ComponentFixture<WarningProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
