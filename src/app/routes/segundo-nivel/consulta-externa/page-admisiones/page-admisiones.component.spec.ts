import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAdmisionesComponent } from './page-admisiones.component';

describe('PageAdmisionesComponent', () => {
  let component: PageAdmisionesComponent;
  let fixture: ComponentFixture<PageAdmisionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageAdmisionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageAdmisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
