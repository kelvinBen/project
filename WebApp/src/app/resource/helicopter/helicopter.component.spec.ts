import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelicopterComponent } from './helicopter.component';

describe('HelicopterComponent', () => {
  let component: HelicopterComponent;
  let fixture: ComponentFixture<HelicopterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelicopterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelicopterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
