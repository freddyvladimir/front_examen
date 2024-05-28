import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLaboratoriosComponent } from './dialog-laboratorios.component';

describe('DialogLaboratoriosComponent', () => {
  let component: DialogLaboratoriosComponent;
  let fixture: ComponentFixture<DialogLaboratoriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogLaboratoriosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLaboratoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
