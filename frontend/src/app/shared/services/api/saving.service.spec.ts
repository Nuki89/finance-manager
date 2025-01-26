import { TestBed } from '@angular/core/testing';

import { SavingService } from './saving.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SavingService', () => {
  let service: SavingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [SavingService],
    });
    service = TestBed.inject(SavingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
