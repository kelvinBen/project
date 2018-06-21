import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOperComponent } from './work-oper.component';

describe('WorkOperComponent', () => {
  let component: WorkOperComponent;
  let fixture: ComponentFixture<WorkOperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkOperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
