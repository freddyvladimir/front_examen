import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageMedicoEspecialistaComponent } from './page-medico-especialista.component';

describe('PageMedicoEspecialistaComponent', () => {
  let component: PageMedicoEspecialistaComponent;
  let fixture: ComponentFixture<PageMedicoEspecialistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageMedicoEspecialistaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageMedicoEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
