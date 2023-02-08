import { TestBed } from '@angular/core/testing';

import { CrudOperationsService } from './crud-operations.service';

describe('CrudOperationsService', () => {
  let service: CrudOperationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudOperationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
