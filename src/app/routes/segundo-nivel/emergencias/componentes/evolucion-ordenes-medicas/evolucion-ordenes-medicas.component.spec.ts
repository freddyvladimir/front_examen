import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolucionOrdenesMedicasComponent } from './evolucion-ordenes-medicas.component';

describe('EvolucionOrdenesMedicasComponent', () => {
  let component: EvolucionOrdenesMedicasComponent;
  let fixture: ComponentFixture<EvolucionOrdenesMedicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvolucionOrdenesMedicasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvolucionOrdenesMedicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
