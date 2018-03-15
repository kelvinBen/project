import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupoperComponent } from './groupoper.component';

describe('GroupoperComponent', () => {
  let component: GroupoperComponent;
  let fixture: ComponentFixture<GroupoperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupoperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupoperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
