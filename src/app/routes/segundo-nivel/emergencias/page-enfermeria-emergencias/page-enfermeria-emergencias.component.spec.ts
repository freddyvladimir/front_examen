import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageEnfermeriaEmergenciasComponent } from './page-enfermeria-emergencias.component';

describe('PageEnfermeriaEmergenciasComponent', () => {
  let component: PageEnfermeriaEmergenciasComponent;
  let fixture: ComponentFixture<PageEnfermeriaEmergenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageEnfermeriaEmergenciasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageEnfermeriaEmergenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
