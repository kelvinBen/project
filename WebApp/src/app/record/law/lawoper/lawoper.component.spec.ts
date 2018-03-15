import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LawoperComponent } from './lawoper.component';

describe('LawoperComponent', () => {
  let component: LawoperComponent;
  let fixture: ComponentFixture<LawoperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LawoperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LawoperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
