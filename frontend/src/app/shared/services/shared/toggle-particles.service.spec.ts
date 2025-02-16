import { TestBed } from '@angular/core/testing';

import { ToggleParticlesService } from './toggle-particles.service';

describe('ToggleParticlesService', () => {
  let service: ToggleParticlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToggleParticlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
