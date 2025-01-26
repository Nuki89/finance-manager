import { TestBed } from '@angular/core/testing';

import { ExpenseService } from './expense.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ExpenseService', () => {
  let service: ExpenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExpenseService],
    });
    service = TestBed.inject(ExpenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
