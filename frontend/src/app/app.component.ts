import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
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
  
}
