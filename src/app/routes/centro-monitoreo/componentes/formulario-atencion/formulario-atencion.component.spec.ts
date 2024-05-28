import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioAtencionComponent } from './formulario-atencion.component';

describe('FormularioAtencionComponent', () => {
  let component: FormularioAtencionComponent;
  let fixture: ComponentFixture<FormularioAtencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioAtencionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioAtencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
