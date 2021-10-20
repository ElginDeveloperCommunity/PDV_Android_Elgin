import { TestBed } from '@angular/core/testing';

import { ShipayService } from './shipay.service';

describe('ShipayService', () => {
  let service: ShipayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShipayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
