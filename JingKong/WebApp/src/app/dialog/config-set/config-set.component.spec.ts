import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigSetComponent } from './config-set.component';

describe('ConfigSetComponent', () => {
  let component: ConfigSetComponent;
  let fixture: ComponentFixture<ConfigSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
