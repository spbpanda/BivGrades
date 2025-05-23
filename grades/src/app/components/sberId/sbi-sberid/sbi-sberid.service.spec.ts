import { TestBed } from '@angular/core/testing';

import { SbiSberidService } from './sbi-sberid.service';

describe('SbiSberidService', () => {
  let service: SbiSberidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SbiSberidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
