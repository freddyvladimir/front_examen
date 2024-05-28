import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHojaReferenciaComponent } from './page-hoja-referencia.component';

describe('PageHojaReferenciaComponent', () => {
  let component: PageHojaReferenciaComponent;
  let fixture: ComponentFixture<PageHojaReferenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageHojaReferenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageHojaReferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
