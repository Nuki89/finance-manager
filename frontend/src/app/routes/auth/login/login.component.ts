import { NgIcon, provideIcons } from '@ng-icons/core';
import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { cryptoBtc } from '@ng-icons/cryptocurrency-icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon],
  templateUrl: './login.component.html',
  viewProviders : [provideIcons({ cryptoBtc })]
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