import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePorHospitalComponent } from './page-por-hospital.component';

describe('PagePorHospitalComponent', () => {
  let component: PagePorHospitalComponent;
  let fixture: ComponentFixture<PagePorHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagePorHospitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagePorHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
