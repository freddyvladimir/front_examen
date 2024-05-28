import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAdvertenciaComponent } from './dialog-advertencia.component';

describe('DialogAdvertenciaComponent', () => {
  let component: DialogAdvertenciaComponent;
  let fixture: ComponentFixture<DialogAdvertenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAdvertenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAdvertenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
