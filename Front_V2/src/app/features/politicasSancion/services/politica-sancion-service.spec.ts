import { TestBed } from '@angular/core/testing';

import { PoliticaSancionService } from './politica-sancion-service';

describe('PoliticaSancionService', () => {
  let service: PoliticaSancionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoliticaSancionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
