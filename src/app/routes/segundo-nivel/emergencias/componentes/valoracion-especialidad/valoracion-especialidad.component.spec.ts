import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValoracionEspecialidadComponent } from './valoracion-especialidad.component';

describe('ValoracionEspecialidadComponent', () => {
  let component: ValoracionEspecialidadComponent;
  let fixture: ComponentFixture<ValoracionEspecialidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValoracionEspecialidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValoracionEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
