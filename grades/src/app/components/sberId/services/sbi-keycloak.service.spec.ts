import { TestBed } from '@angular/core/testing';

import { SbiKeycloakService } from './sbi-keycloak.service';

describe('SbiKeycloakService', () => {
  let service: SbiKeycloakService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SbiKeycloakService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
