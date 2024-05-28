import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionHemodialisisComponent } from './asignacion-hemodialisis.component';

describe('AsignacionHemodialisisComponent', () => {
  let component: AsignacionHemodialisisComponent;
  let fixture: ComponentFixture<AsignacionHemodialisisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignacionHemodialisisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionHemodialisisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
