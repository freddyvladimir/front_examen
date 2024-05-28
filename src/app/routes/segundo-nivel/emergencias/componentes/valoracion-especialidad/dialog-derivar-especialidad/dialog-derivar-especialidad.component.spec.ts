import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDerivarEspecialidadComponent } from './dialog-derivar-especialidad.component';

describe('DialogDerivarEspecialidadComponent', () => {
  let component: DialogDerivarEspecialidadComponent;
  let fixture: ComponentFixture<DialogDerivarEspecialidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDerivarEspecialidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDerivarEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
