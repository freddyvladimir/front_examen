import { TestBed } from '@angular/core/testing';

import { ReportesGamlpService } from './reportes-gamlp.service';

describe('ReportesGamlpService', () => {
  let service: ReportesGamlpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportesGamlpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
