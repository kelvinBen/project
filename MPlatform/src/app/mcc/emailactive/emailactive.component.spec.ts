import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailactiveComponent } from './emailactive.component';

describe('EmailactiveComponent', () => {
  let component: EmailactiveComponent;
  let fixture: ComponentFixture<EmailactiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailactiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
