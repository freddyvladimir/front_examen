import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosPacientesComponent } from './datos-pacientes.component';

describe('DatosPacientesComponent', () => {
  let component: DatosPacientesComponent;
  let fixture: ComponentFixture<DatosPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosPacientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
