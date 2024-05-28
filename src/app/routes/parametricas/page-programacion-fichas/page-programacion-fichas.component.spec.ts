import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageProgramacionFichasComponent } from './page-programacion-fichas.component';

describe('PageProgramacionFichasComponent', () => {
  let component: PageProgramacionFichasComponent;
  let fixture: ComponentFixture<PageProgramacionFichasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageProgramacionFichasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageProgramacionFichasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
