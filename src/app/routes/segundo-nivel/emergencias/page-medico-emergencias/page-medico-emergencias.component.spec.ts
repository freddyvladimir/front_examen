import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageMedicoEmergenciasComponent } from './page-medico-emergencias.component';

describe('PageMedicoEmergenciasComponent', () => {
  let component: PageMedicoEmergenciasComponent;
  let fixture: ComponentFixture<PageMedicoEmergenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageMedicoEmergenciasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageMedicoEmergenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
