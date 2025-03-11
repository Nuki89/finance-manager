import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { cryptoBtc } from '@ng-icons/cryptocurrency-icons';
import { bootstrapEye, bootstrapEyeSlash, bootstrapExclamationDiamond } from '@ng-icons/bootstrap-icons';
import { AuthService } from '../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgIcon],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  viewProviders : [provideIcons({ cryptoBtc, bootstrapEye, bootstrapEyeSlash, bootstrapExclamationDiamond })]
})
export class RegisterComponent {
  public showPassword: boolean = false;
  public isInvalid: boolean = false;
  public username: string = '';
  public password: string = '';
  public password2: string = '';
  public email: string = '';
  public title = "Coiny"

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  public onSubmit() {
    console.log(this.email, this.username, this.password, this.password2)
    this.authService.register(this.email, this.username, this.password, this.password2).subscribe(
      () => {
        this.isInvalid = false;
        this.router.navigate(['/login']);
      },
      error => {
        this.isInvalid = true;
        console.error('Register failed:', error);
      }
    );
  }

  public togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

}
