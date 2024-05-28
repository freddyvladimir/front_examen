import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialigAtencionComponent } from './dialig-atencion.component';

describe('DialigAtencionComponent', () => {
  let component: DialigAtencionComponent;
  let fixture: ComponentFixture<DialigAtencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialigAtencionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialigAtencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
