import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleoperComponent } from './roleoper.component';

describe('RoleoperComponent', () => {
  let component: RoleoperComponent;
  let fixture: ComponentFixture<RoleoperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleoperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleoperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
