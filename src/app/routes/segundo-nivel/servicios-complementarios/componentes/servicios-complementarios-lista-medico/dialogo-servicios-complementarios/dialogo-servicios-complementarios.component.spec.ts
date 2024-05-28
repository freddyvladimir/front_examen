import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoServiciosComplementariosComponent } from './dialogo-servicios-complementarios.component';

describe('DialogoServiciosComplementariosComponent', () => {
  let component: DialogoServiciosComplementariosComponent;
  let fixture: ComponentFixture<DialogoServiciosComplementariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoServiciosComplementariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoServiciosComplementariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
