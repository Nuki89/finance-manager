import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  title: string = "Coiny";
  firstName: string = 'Nuki';
  lastName: string = 'Pipika';
  email: string = 'nuki@gmail.com';

  constructor(
    private authService: AuthService,
  ) {}

  onLogout(): void {
    this.authService.logout()
    console.log('Logout successful');
  }

  // onLogout(): void {
  //   this.authService.logout().subscribe(() => {
  //     console.log('Logout successful');
  //   });
  // }

}
