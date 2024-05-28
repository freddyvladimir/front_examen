import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMedicoEspecialidadComponent } from './dialog-medico-especialidad.component';

describe('DialogMedicoEspecialidadComponent', () => {
  let component: DialogMedicoEspecialidadComponent;
  let fixture: ComponentFixture<DialogMedicoEspecialidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMedicoEspecialidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMedicoEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
