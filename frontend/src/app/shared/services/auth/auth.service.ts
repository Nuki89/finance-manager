import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { apiEndpoints } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenUrl = apiEndpoints.tokenUrl;
  private tokenKey = 'authToken';
  private isAuthenticated = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getToken(): string | null {
    if (!this.isBrowser()) {
      return null; 
    }
    return sessionStorage.getItem(this.tokenKey); 
  }

  isLoggedIn(): boolean {
    if (this.isAuthenticated) {
      return true;
    }
    // if (!this.isBrowser()) {
    //   return false; 
    // }
    const token = sessionStorage.getItem(this.tokenKey);
    this.isAuthenticated = !!token;
    return this.isAuthenticated;
  }

  private saveToken(token: string): void {
    if (this.isBrowser()) {
      sessionStorage.setItem(this.tokenKey, token);
    }
    this.isAuthenticated = true;
  }

  logout(): void {
    if (this.isBrowser()) {
      sessionStorage.removeItem(this.tokenKey);
    }
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }

  login(username: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.http.post(this.tokenUrl, { username, password }).subscribe(
        (response: any) => {
          const token = response.access; 
          this.saveToken(token);
          this.router.navigate(['home']);
          observer.next(response);
          observer.complete();
        },
        error => {
          console.error('Login failed:', error);
          observer.error(error);
        }
      );
    });
  }
}
