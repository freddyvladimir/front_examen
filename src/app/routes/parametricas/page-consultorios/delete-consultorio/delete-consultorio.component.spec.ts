import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConsultorioComponent } from './delete-consultorio.component';

describe('DeleteConsultorioComponent', () => {
  let component: DeleteConsultorioComponent;
  let fixture: ComponentFixture<DeleteConsultorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteConsultorioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteConsultorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
