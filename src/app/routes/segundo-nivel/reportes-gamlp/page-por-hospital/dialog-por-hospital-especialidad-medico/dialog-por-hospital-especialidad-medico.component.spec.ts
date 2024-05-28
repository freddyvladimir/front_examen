import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPorHospitalEspecialidadMedicoComponent } from './dialog-por-hospital-especialidad-medico.component';

describe('DialogPorHospitalEspecialidadMedicoComponent', () => {
  let component: DialogPorHospitalEspecialidadMedicoComponent;
  let fixture: ComponentFixture<DialogPorHospitalEspecialidadMedicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPorHospitalEspecialidadMedicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPorHospitalEspecialidadMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
