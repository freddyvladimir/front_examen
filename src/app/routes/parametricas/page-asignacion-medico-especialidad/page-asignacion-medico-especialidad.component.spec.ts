import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAsignacionMedicoEspecialidadComponent } from './page-asignacion-medico-especialidad.component';

describe('PageAsignacionMedicoEspecialidadComponent', () => {
  let component: PageAsignacionMedicoEspecialidadComponent;
  let fixture: ComponentFixture<PageAsignacionMedicoEspecialidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageAsignacionMedicoEspecialidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageAsignacionMedicoEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
