import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageReporteRadiologiaComponent } from './page-reporte-radiologia.component';

describe('PageReporteRadiologiaComponent', () => {
  let component: PageReporteRadiologiaComponent;
  let fixture: ComponentFixture<PageReporteRadiologiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageReporteRadiologiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageReporteRadiologiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
