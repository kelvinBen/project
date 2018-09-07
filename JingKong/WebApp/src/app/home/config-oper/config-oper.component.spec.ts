import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigOperComponent } from './config-oper.component';

describe('ConfigOperComponent', () => {
  let component: ConfigOperComponent;
  let fixture: ComponentFixture<ConfigOperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigOperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigOperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
