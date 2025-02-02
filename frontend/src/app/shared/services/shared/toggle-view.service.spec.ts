import { TestBed } from '@angular/core/testing';

import { ToggleViewService } from './toggle-view.service';

describe('ToggleViewService', () => {
  let service: ToggleViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToggleViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
