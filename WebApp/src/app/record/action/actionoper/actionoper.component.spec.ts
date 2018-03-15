import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionoperComponent } from './actionoper.component';

describe('ActionoperComponent', () => {
  let component: ActionoperComponent;
  let fixture: ComponentFixture<ActionoperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionoperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionoperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
