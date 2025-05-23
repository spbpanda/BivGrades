import { TestBed } from '@angular/core/testing';

import { SbiAuthService } from './sbi-auth.service';

describe('SbiAuthService', () => {
  let service: SbiAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SbiAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
