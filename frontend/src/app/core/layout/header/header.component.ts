import { NgIcon, provideIcons } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { hugeSettings01 } from '@ng-icons/huge-icons';
import { ToggleViewService } from '../../../shared/services/shared/toggle-view.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  viewProviders : [provideIcons({ hugeSettings01 })]
})
export class HeaderComponent {
  title: string = "Coiny";
  firstName: string = 'Nuki';
  lastName: string = 'Pipika';
  email: string = 'nuki@gmail.com';
  currentView: 'Monthly' | 'Yearly';

  constructor(
    private authService: AuthService,
    private toggleViewService: ToggleViewService) {
      this.currentView = this.toggleViewService.getCurrentView();
      this.toggleViewService.viewMode$.subscribe(view => {
      this.currentView = view;
    });
  }

  onLogout(): void {
    this.authService.logout()
    console.log('Logout successful');
  }

  ngAfterViewInit(): void {
    const button = document.getElementById('user-menu-button');
    const dropdown = document.getElementById('user-dropdown');

    if (button && dropdown) {
      button.addEventListener('click', () => {
        if (dropdown.classList.contains('hidden')) {
          dropdown.classList.remove('hidden');
          dropdown.classList.add('relative'); 
        } else {
          dropdown.classList.add('hidden');
          dropdown.classList.remove('relative');
        }
      });
    }
  }

  toggleView(): void {
    this.toggleViewService.toggleView();
  }

  // onLogout(): void {
  //   this.authService.logout().subscribe(() => {
  //     console.log('Logout successful');
  //   });
  // }

}
