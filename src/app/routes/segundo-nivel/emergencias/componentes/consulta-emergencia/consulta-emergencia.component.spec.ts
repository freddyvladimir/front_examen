import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaEmergenciaComponent } from './consulta-emergencia.component';

describe('ConsultaEmergenciaComponent', () => {
  let component: ConsultaEmergenciaComponent;
  let fixture: ComponentFixture<ConsultaEmergenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaEmergenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaEmergenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
