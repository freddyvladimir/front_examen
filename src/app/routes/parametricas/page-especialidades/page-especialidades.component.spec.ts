import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageEspecialidadesComponent } from './page-especialidades.component';

describe('PageEspecialidadesComponent', () => {
  let component: PageEspecialidadesComponent;
  let fixture: ComponentFixture<PageEspecialidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageEspecialidadesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageEspecialidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
