import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  canActivate(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  // canActivate(): boolean {
  //   const isLoggedIn = this.authService.isLoggedIn();
  //   if (isLoggedIn) {
  //     return true;
  //   } else {
  //     this.router.navigate(['/login']);
  //     return false;
  //   }
  // }

  
}
