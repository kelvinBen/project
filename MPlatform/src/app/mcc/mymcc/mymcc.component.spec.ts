import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MymccComponent } from './mymcc.component';

describe('MymccComponent', () => {
  let component: MymccComponent;
  let fixture: ComponentFixture<MymccComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MymccComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MymccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
