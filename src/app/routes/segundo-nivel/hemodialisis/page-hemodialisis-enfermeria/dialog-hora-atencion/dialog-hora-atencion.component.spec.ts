import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHoraAtencionComponent } from './dialog-hora-atencion.component';

describe('DialogHoraAtencionComponent', () => {
  let component: DialogHoraAtencionComponent;
  let fixture: ComponentFixture<DialogHoraAtencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogHoraAtencionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogHoraAtencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
