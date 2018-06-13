import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RainOperationComponent } from './rain-operation.component';

describe('RainOperationComponent', () => {
  let component: RainOperationComponent;
  let fixture: ComponentFixture<RainOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RainOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RainOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
