import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageReprogramacionComponent } from './page-reprogramacion.component';

describe('PageReprogramacionComponent', () => {
  let component: PageReprogramacionComponent;
  let fixture: ComponentFixture<PageReprogramacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageReprogramacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageReprogramacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
