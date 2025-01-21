import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { authGuard } from './auth.guard';



describe('AuthGuard', () => {
  let guard: authGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule], // Import necessary modules
      providers: [AuthService], // Provide AuthService
    });

    guard = TestBed.inject(authGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
