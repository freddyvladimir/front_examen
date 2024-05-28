import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageServicioEmergenciasComponent } from './page-servicio-emergencias.component';

describe('PageServicioEmergenciasComponent', () => {
  let component: PageServicioEmergenciasComponent;
  let fixture: ComponentFixture<PageServicioEmergenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageServicioEmergenciasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageServicioEmergenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
