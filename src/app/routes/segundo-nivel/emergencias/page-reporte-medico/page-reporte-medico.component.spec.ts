import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageReporteMedicoComponent } from './page-reporte-medico.component';

describe('PageReporteMedicoComponent', () => {
  let component: PageReporteMedicoComponent;
  let fixture: ComponentFixture<PageReporteMedicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageReporteMedicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageReporteMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
