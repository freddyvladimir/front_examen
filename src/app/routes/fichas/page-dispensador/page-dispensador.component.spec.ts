import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDispensadorComponent } from './page-dispensador.component';

describe('PageDispensadorComponent', () => {
  let component: PageDispensadorComponent;
  let fixture: ComponentFixture<PageDispensadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageDispensadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDispensadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
