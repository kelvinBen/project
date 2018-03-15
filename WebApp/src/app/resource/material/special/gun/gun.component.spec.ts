import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GunComponent } from './gun.component';

describe('GunComponent', () => {
  let component: GunComponent;
  let fixture: ComponentFixture<GunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
