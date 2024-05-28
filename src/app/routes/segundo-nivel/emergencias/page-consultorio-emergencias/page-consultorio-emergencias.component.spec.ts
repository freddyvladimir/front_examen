import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageConsultorioEmergenciasComponent } from './page-consultorio-emergencias.component';

describe('PageConsultorioEmergenciasComponent', () => {
  let component: PageConsultorioEmergenciasComponent;
  let fixture: ComponentFixture<PageConsultorioEmergenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageConsultorioEmergenciasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageConsultorioEmergenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
