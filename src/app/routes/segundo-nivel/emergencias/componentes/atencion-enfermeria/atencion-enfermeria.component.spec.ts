import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtencionEnfermeriaComponent } from './atencion-enfermeria.component';

describe('AtencionEnfermeriaComponent', () => {
  let component: AtencionEnfermeriaComponent;
  let fixture: ComponentFixture<AtencionEnfermeriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtencionEnfermeriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtencionEnfermeriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
