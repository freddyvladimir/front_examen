import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFromFichasComponent } from './dialog-from-fichas.component';

describe('DialogFromFichasComponent', () => {
  let component: DialogFromFichasComponent;
  let fixture: ComponentFixture<DialogFromFichasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFromFichasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFromFichasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
