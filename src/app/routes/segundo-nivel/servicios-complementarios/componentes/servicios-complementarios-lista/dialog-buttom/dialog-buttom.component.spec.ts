import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogButtomComponent } from './dialog-buttom.component';

describe('DialogButtomComponent', () => {
  let component: DialogButtomComponent;
  let fixture: ComponentFixture<DialogButtomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogButtomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogButtomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
