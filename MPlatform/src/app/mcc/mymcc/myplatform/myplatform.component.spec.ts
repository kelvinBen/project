import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyplatformComponent } from './myplatform.component';

describe('MyplatformComponent', () => {
  let component: MyplatformComponent;
  let fixture: ComponentFixture<MyplatformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyplatformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyplatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
