import { TestBed } from '@angular/core/testing';

import { CrudTrackingService } from './crud-tracking-service';

describe('CrudTrackingService', () => {
  let service: CrudTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
