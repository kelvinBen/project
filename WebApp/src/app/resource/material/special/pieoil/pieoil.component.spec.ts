import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieoilComponent } from './pieoil.component';

describe('PieoilComponent', () => {
  let component: PieoilComponent;
  let fixture: ComponentFixture<PieoilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieoilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieoilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
