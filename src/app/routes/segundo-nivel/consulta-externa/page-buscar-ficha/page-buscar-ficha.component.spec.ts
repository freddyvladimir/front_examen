import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBuscarFichaComponent } from './page-buscar-ficha.component';

describe('PageBuscarFichaComponent', () => {
  let component: PageBuscarFichaComponent;
  let fixture: ComponentFixture<PageBuscarFichaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageBuscarFichaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageBuscarFichaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
