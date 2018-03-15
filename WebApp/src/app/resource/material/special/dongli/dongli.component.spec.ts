import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DongliComponent } from './dongli.component';

describe('DongliComponent', () => {
  let component: DongliComponent;
  let fixture: ComponentFixture<DongliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DongliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DongliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
