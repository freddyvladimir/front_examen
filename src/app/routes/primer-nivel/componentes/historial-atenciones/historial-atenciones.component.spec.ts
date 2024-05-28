import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialAtencionesComponent } from './historial-atenciones.component';

describe('HistorialAtencionesComponent', () => {
  let component: HistorialAtencionesComponent;
  let fixture: ComponentFixture<HistorialAtencionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialAtencionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialAtencionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
