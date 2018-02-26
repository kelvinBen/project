import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgrindexComponent } from './agrindex.component';

describe('AgrindexComponent', () => {
  let component: AgrindexComponent;
  let fixture: ComponentFixture<AgrindexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgrindexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgrindexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
