import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaEmergenciasComponent } from './reserva-emergencias.component';

describe('ReservaEmergenciasComponent', () => {
  let component: ReservaEmergenciasComponent;
  let fixture: ComponentFixture<ReservaEmergenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservaEmergenciasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservaEmergenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
