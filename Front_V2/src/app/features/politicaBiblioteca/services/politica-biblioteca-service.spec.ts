import { TestBed } from '@angular/core/testing';

import { PoliticaBibliotecaService } from './politica-biblioteca-service';

describe('PoliticaBibliotecaService', () => {
  let service: PoliticaBibliotecaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoliticaBibliotecaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
