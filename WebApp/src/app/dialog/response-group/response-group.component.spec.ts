import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseGroupComponent } from './response-group.component';

describe('ResponseGroupComponent', () => {
  let component: ResponseGroupComponent;
  let fixture: ComponentFixture<ResponseGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponseGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
