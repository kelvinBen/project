import { TestBed, inject } from '@angular/core/testing';

import { EsriloadService } from './esriload.service';

describe('EsriloadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EsriloadService]
    });
  });

  it('should be created', inject([EsriloadService], (service: EsriloadService) => {
    expect(service).toBeTruthy();
  }));
});
