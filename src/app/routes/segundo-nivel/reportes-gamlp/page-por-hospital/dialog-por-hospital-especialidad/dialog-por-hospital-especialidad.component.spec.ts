import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPorHospitalEspecialidadComponent } from './dialog-por-hospital-especialidad.component';

describe('DialogPorHospitalEspecialidadComponent', () => {
  let component: DialogPorHospitalEspecialidadComponent;
  let fixture: ComponentFixture<DialogPorHospitalEspecialidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPorHospitalEspecialidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPorHospitalEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
