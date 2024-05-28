import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEvolucionOrdenesMedicasComponent } from './dialog-evolucion-ordenes-medicas.component';

describe('DialogEvolucionOrdenesMedicasComponent', () => {
  let component: DialogEvolucionOrdenesMedicasComponent;
  let fixture: ComponentFixture<DialogEvolucionOrdenesMedicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEvolucionOrdenesMedicasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEvolucionOrdenesMedicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
