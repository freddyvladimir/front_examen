import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAtencionHospitalComponent } from './dialog-atencion-hospital.component';

describe('DialogAtencionHospitalComponent', () => {
  let component: DialogAtencionHospitalComponent;
  let fixture: ComponentFixture<DialogAtencionHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAtencionHospitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAtencionHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
