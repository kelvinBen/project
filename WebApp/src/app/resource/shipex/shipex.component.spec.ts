import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipexComponent } from './shipex.component';

describe('ShipexComponent', () => {
  let component: ShipexComponent;
  let fixture: ComponentFixture<ShipexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
