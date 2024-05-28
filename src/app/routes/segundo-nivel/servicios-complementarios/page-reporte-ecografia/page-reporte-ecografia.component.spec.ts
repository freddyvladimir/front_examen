import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageReporteEcografiaComponent } from './page-reporte-ecografia.component';

describe('PageReporteEcografiaComponent', () => {
  let component: PageReporteEcografiaComponent;
  let fixture: ComponentFixture<PageReporteEcografiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageReporteEcografiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageReporteEcografiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
