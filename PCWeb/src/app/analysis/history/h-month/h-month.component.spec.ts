import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HMonthComponent } from './h-month.component';

describe('HMonthComponent', () => {
  let component: HMonthComponent;
  let fixture: ComponentFixture<HMonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HMonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
