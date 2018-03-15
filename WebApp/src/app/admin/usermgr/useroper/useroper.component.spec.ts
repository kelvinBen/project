import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UseroperComponent } from './useroper.component';

describe('UseroperComponent', () => {
  let component: UseroperComponent;
  let fixture: ComponentFixture<UseroperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseroperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseroperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
