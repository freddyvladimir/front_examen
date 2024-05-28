import { TestBed } from '@angular/core/testing';

import { ServiciosComplementariosService } from './servicios-complementarios.service';

describe('ServiciosComplementariosService', () => {
  let service: ServiciosComplementariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosComplementariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
