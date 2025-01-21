import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './shared/services/auth/auth.service';
import { HeaderComponent } from "./core/layout/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'finance-manager';
  loading = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loading = true;
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['home']);
    } else {
      this.router.navigate(['/login']);
    }
    this.loading = false;
  }

  // ngOnInit(): void {
  //   this.loading = true;
  
  //   if (this.authService.isLoggedIn()) {
  //     this.router.navigate(['home']).then(() => {
  //       this.loading = false; 
  //     });
  //   } else {
  //     this.router.navigate(['/login']).then(() => {
  //       this.loading = false; 
  //     });
  //   }

  //   if (typeof window !== 'undefined') {
  //     import('flowbite').then(({ initFlowbite }) => {
  //       initFlowbite();
  //     });
  //   }

  // }
  
}
