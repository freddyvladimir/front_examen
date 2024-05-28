import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMedicamentosComponent } from './dialog-medicamentos.component';

describe('DialogMedicamentosComponent', () => {
  let component: DialogMedicamentosComponent;
  let fixture: ComponentFixture<DialogMedicamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMedicamentosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMedicamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
