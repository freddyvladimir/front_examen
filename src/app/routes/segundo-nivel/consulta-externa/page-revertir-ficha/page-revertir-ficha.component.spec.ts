import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRevertirFichaComponent } from './page-revertir-ficha.component';

describe('PageRevertirFichaComponent', () => {
  let component: PageRevertirFichaComponent;
  let fixture: ComponentFixture<PageRevertirFichaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageRevertirFichaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageRevertirFichaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
