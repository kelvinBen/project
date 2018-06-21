import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherdataComponent } from './weatherdata.component';

describe('WeatherdataComponent', () => {
  let component: WeatherdataComponent;
  let fixture: ComponentFixture<WeatherdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
