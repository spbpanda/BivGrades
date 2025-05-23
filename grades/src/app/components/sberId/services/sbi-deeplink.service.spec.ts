import { TestBed } from '@angular/core/testing';

import { SbiDeeplinkService } from './sbi-deeplink.service';

describe('SbiDeeplinkService', () => {
  let service: SbiDeeplinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SbiDeeplinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
