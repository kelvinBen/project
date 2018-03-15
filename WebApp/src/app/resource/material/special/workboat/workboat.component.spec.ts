import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkboatComponent } from './workboat.component';

describe('WorkboatComponent', () => {
  let component: WorkboatComponent;
  let fixture: ComponentFixture<WorkboatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkboatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkboatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
