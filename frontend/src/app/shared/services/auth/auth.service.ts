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


// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { Observable, of, throwError } from 'rxjs';
// import { catchError, finalize, map, tap } from 'rxjs/operators';
// import { apiEndpoints } from '../../../../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private loginUrl = apiEndpoints.loginUrl;
//   private logoutUrl = apiEndpoints.logoutUrl;

//   constructor(private http: HttpClient, private router: Router) {}

//   login(username: string, password: string): Observable<any> {
//     return this.http.post(this.loginUrl, { username, password }, { withCredentials: true }).pipe(
//       tap((response: any) => {
//         if (response.access) {
//           localStorage.setItem('access_token', response.access);
//         }
//       }),
//       catchError((error: HttpErrorResponse) => {
//         console.error('Login failed:', error);
//         return of(error);
//       })
//     );
//   }
  
//   getAccessToken(): string | null {
//     return localStorage.getItem('access_token'); 
//   }

//   getToken(): string | null {
//     return localStorage.getItem('auth_token'); 
//   }

//   logout(): Observable<any> {
//     return this.http.post(this.logoutUrl, {}, { withCredentials: true }).pipe(
//       tap(() => {
//         localStorage.removeItem('access_token');
//       }),
//       catchError((error: HttpErrorResponse) => {
//         console.error('Logout failed:', error);
//         return of(error);
//       }),
//       finalize(() => {
//         this.router.navigate(['/login']);  
//       })
//     );
//   }

//   isAuthenticated(): boolean {
//     return !!this.getAccessToken();  
//   }
  
//   isLoggedIn(): Observable<boolean> {
//     return this.http.get<boolean>(apiEndpoints.isLoggedInUrl, { withCredentials: true })
//       .pipe(
//         map(response => {
//           return true;
//         }),
//         catchError(() => {
//           return of(false);
//         })
//       );
//   }

// }
