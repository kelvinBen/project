import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialPersonComponent } from './material-person.component';

describe('MaterialPersonComponent', () => {
  let component: MaterialPersonComponent;
  let fixture: ComponentFixture<MaterialPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
