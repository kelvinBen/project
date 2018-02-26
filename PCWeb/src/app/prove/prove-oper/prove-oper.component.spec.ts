import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveOperComponent } from './prove-oper.component';

describe('ProveOperComponent', () => {
  let component: ProveOperComponent;
  let fixture: ComponentFixture<ProveOperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProveOperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveOperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
