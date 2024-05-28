import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageConsultorioComponent } from './page-consultorio.component';

describe('PageConsultorioComponent', () => {
  let component: PageConsultorioComponent;
  let fixture: ComponentFixture<PageConsultorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageConsultorioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageConsultorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
