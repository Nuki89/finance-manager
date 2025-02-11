import { NgIcon, provideIcons } from '@ng-icons/core';
import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { cryptoBtc } from '@ng-icons/cryptocurrency-icons';
import { bootstrapEye, bootstrapEyeSlash, bootstrapExclamationDiamond } from '@ng-icons/bootstrap-icons';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon, RouterModule],
  templateUrl: './login.component.html',
  viewProviders : [provideIcons({ cryptoBtc, bootstrapEye, bootstrapEyeSlash, bootstrapExclamationDiamond })]
})
export class LoginComponent {
  title = "Coiny"
  username = '';
  password = '';
  isInvalid: boolean = false;
  isRemembered: boolean = false;

  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  ngOnInit(): void {
    // if (this.authService.isLoggedIn()) {
    //   this.authService.redirectToHome();
    // }
  }

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe(
      () => {
        this.isInvalid = false;
        console.log('Remember me:', this.isRemembered);
      },
      error => {
        this.isInvalid = true;
      }
    );
  }

}