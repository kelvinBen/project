import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaporationComponent } from './evaporation.component';

describe('EvaporationComponent', () => {
  let component: EvaporationComponent;
  let fixture: ComponentFixture<EvaporationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaporationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaporationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
