import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHemodialisisEnfermeriaComponent } from './page-hemodialisis-enfermeria.component';

describe('PageHemodialisisEnfermeriaComponent', () => {
  let component: PageHemodialisisEnfermeriaComponent;
  let fixture: ComponentFixture<PageHemodialisisEnfermeriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageHemodialisisEnfermeriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageHemodialisisEnfermeriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
