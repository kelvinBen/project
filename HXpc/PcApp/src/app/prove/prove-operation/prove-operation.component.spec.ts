import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveOperationComponent } from './prove-operation.component';

describe('ProveOperationComponent', () => {
  let component: ProveOperationComponent;
  let fixture: ComponentFixture<ProveOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProveOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
