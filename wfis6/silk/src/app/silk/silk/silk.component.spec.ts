import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SilkComponent } from './silk.component';

describe('SilkComponent', () => {
  let component: SilkComponent;
  let fixture: ComponentFixture<SilkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SilkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SilkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
