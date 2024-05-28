import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateConsultorioComponent } from './create-consultorio.component';

describe('CreateConsultorioComponent', () => {
  let component: CreateConsultorioComponent;
  let fixture: ComponentFixture<CreateConsultorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateConsultorioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateConsultorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
