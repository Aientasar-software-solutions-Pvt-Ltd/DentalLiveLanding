import { TestBed } from '@angular/core/testing';

import { UtilityServiceV2Service } from './utility-service-v2.service';

describe('UtilityServiceV2Service', () => {
  let service: UtilityServiceV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilityServiceV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
