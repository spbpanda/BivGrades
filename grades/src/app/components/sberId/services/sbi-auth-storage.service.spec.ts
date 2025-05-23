import { TestBed } from '@angular/core/testing';

import { SbiAuthStorageService } from './sbi-auth-storage.service';

describe('SbiAuthStorageService', () => {
  let service: SbiAuthStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SbiAuthStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
