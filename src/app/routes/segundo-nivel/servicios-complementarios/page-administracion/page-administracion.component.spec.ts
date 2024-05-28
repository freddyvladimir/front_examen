import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAdministracionComponent } from './page-administracion.component';

describe('PageAdministracionComponent', () => {
  let component: PageAdministracionComponent;
  let fixture: ComponentFixture<PageAdministracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageAdministracionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageAdministracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
