import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConsultorioComponent } from './edit-consultorio.component';

describe('EditConsultorioComponent', () => {
  let component: EditConsultorioComponent;
  let fixture: ComponentFixture<EditConsultorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditConsultorioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConsultorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
