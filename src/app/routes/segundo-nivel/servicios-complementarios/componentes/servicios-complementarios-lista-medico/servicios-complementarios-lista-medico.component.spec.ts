import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosComplementariosListaMedicoComponent } from './servicios-complementarios-lista-medico.component';

describe('ServiciosComplementariosListaMedicoComponent', () => {
  let component: ServiciosComplementariosListaMedicoComponent;
  let fixture: ComponentFixture<ServiciosComplementariosListaMedicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiciosComplementariosListaMedicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciosComplementariosListaMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
