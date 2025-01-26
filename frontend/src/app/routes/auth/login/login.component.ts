import { NgIcon, provideIcons } from '@ng-icons/core';
import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { cryptoBtc } from '@ng-icons/cryptocurrency-icons';
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // if (this.authService.isLoggedIn()) {
    //   this.authService.redirectToHome();
    // }
  }


  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe(
      () => {
        this.toastr.success('You have successfully logged in.','Login successful');
      },
      error => {
        this.toastr.error('Please check your username or password.', 'Login Failed');
      }
    );
  }

}