import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageConsultoriosComponent } from './page-consultorios.component';

describe('PageConsultoriosComponent', () => {
  let component: PageConsultoriosComponent;
  let fixture: ComponentFixture<PageConsultoriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageConsultoriosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageConsultoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
