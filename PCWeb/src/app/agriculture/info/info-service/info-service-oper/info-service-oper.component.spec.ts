import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoServiceOperComponent } from './info-service-oper.component';

describe('InfoServiceOperComponent', () => {
  let component: InfoServiceOperComponent;
  let fixture: ComponentFixture<InfoServiceOperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoServiceOperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoServiceOperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
