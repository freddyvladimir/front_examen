import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDuplicadosComponent } from './page-duplicados.component';

describe('PageDuplicadosComponent', () => {
  let component: PageDuplicadosComponent;
  let fixture: ComponentFixture<PageDuplicadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageDuplicadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDuplicadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
