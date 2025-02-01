import { NgIcon, provideIcons } from '@ng-icons/core';
import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { cryptoBtc } from '@ng-icons/cryptocurrency-icons';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon, RouterModule],
  templateUrl: './login.component.html',
  viewProviders : [provideIcons({ cryptoBtc })]
})
export class LoginComponent {
  title = "Coiny"
  username = '';
  password = '';
  isInvalid: boolean = false;

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
        this.isInvalid = true;
        console.log(this.isInvalid);
        // this.toastr.success('You have successfully logged in.','Login successful');
      },
      error => {
        this.isInvalid = false;
        console.log(this.isInvalid);
        this.toastr.error('Please check your username or password.', 'Login Failed');
      }
    );
  }

}