import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCajasComponent } from './page-cajas.component';

describe('PageCajasComponent', () => {
  let component: PageCajasComponent;
  let fixture: ComponentFixture<PageCajasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageCajasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
