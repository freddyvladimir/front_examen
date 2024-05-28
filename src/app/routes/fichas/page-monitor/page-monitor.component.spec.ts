import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageMonitorComponent } from './page-monitor.component';

describe('PageMonitorComponent', () => {
  let component: PageMonitorComponent;
  let fixture: ComponentFixture<PageMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageMonitorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
