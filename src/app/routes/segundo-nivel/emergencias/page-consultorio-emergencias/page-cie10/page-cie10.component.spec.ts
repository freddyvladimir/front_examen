import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCie10Component } from './page-cie10.component';

describe('PageCie10Component', () => {
  let component: PageCie10Component;
  let fixture: ComponentFixture<PageCie10Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageCie10Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCie10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
