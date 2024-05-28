import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientesRegistradosComponent } from './pacientes-registrados.component';

describe('PacientesRegistradosComponent', () => {
  let component: PacientesRegistradosComponent;
  let fixture: ComponentFixture<PacientesRegistradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PacientesRegistradosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PacientesRegistradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
