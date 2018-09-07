import { TestBed, inject } from '@angular/core/testing';

import { CustomEsriService } from './custom-esri.service';

describe('CustomEsriService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomEsriService]
    });
  });

  it('should be created', inject([CustomEsriService], (service: CustomEsriService) => {
    expect(service).toBeTruthy();
  }));
});
