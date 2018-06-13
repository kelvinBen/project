import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XanewsComponent } from './xanews.component';

describe('XanewsComponent', () => {
  let component: XanewsComponent;
  let fixture: ComponentFixture<XanewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XanewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XanewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
