import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentOperComponent } from './content-oper.component';

describe('ContentOperComponent', () => {
  let component: ContentOperComponent;
  let fixture: ComponentFixture<ContentOperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentOperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentOperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
