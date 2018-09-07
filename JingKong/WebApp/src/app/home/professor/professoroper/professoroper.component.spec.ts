import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessoroperComponent } from './professoroper.component';

describe('ProfessoroperComponent', () => {
  let component: ProfessoroperComponent;
  let fixture: ComponentFixture<ProfessoroperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfessoroperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessoroperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
