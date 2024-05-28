import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogReasignarMaquinaComponent } from './dialog-reasignar-maquina.component';

describe('DialogReasignarMaquinaComponent', () => {
  let component: DialogReasignarMaquinaComponent;
  let fixture: ComponentFixture<DialogReasignarMaquinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogReasignarMaquinaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogReasignarMaquinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
