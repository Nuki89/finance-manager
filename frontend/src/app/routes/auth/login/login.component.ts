import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()">
      <label for="username">Username:</label>
      <input type="text" [(ngModel)]="username" name="username" required />

      <label for="password">Password:</label>
      <input type="password" [(ngModel)]="password" name="password" required />

      <button type="submit">Login</button>
    </form>
  `
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(
    private authService: AuthService,
  ) {}

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe(
      () => {
        console.log('Login successful');
      },
      error => {
        console.error('Login failed:', error);
      }
    );
  }
}