import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosComplementariosListaComponent } from './servicios-complementarios-lista.component';

describe('ServiciosComplementariosListaComponent', () => {
  let component: ServiciosComplementariosListaComponent;
  let fixture: ComponentFixture<ServiciosComplementariosListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiciosComplementariosListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciosComplementariosListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
