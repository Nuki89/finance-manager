import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

// import { CanActivateFn } from '@angular/router';
// import { inject } from '@angular/core';
// import { AuthService } from './auth.service';
// import { Router } from '@angular/router';

// export const authGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService);
//   const router = inject(Router); 

//   if (authService.isLoggedIn()) {
//     return true;
//   } else {
//     router.navigate(['/login']); 
//     return false; 
//   }
// };


