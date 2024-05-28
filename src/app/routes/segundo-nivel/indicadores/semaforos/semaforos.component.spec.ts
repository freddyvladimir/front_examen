import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemaforosComponent } from './semaforos.component';

describe('SemaforosComponent', () => {
  let component: SemaforosComponent;
  let fixture: ComponentFixture<SemaforosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SemaforosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SemaforosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
