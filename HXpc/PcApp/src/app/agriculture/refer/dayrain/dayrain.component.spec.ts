import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayrainComponent } from './dayrain.component';

describe('DayrainComponent', () => {
  let component: DayrainComponent;
  let fixture: ComponentFixture<DayrainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayrainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
