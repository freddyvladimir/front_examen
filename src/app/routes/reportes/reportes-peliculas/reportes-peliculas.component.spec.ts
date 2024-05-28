import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesPeliculasComponent } from './reportes-peliculas.component';

describe('ReportesPeliculasComponent', () => {
  let component: ReportesPeliculasComponent;
  let fixture: ComponentFixture<ReportesPeliculasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesPeliculasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesPeliculasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
