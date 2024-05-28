import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogReservaFichasComponent } from './dialog-reserva-fichas.component';

describe('DialogReservaFichasComponent', () => {
  let component: DialogReservaFichasComponent;
  let fixture: ComponentFixture<DialogReservaFichasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogReservaFichasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogReservaFichasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
