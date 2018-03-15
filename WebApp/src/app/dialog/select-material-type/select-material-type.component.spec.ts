import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMaterialTypeComponent } from './select-material-type.component';

describe('SelectMaterialTypeComponent', () => {
  let component: SelectMaterialTypeComponent;
  let fixture: ComponentFixture<SelectMaterialTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectMaterialTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMaterialTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
