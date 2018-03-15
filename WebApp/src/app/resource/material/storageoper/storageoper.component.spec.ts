import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageoperComponent } from './storageoper.component';

describe('StorageoperComponent', () => {
  let component: StorageoperComponent;
  let fixture: ComponentFixture<StorageoperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageoperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageoperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
