import { TestBed, inject } from '@angular/core/testing';

import { DbServiceService } from './db-service.service';

describe('DbServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DbServiceService]
    });
  });

  it('should ...', inject([DbServiceService], (service: DbServiceService) => {
    expect(service).toBeTruthy();
  }));
});
