import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsermgrComponent } from './usermgr.component';

describe('UsermgrComponent', () => {
  let component: UsermgrComponent;
  let fixture: ComponentFixture<UsermgrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsermgrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsermgrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
