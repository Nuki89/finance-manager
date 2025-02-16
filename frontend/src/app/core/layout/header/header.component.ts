import { NgIcon, provideIcons } from '@ng-icons/core';
import { ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { hugeSettings01 } from '@ng-icons/huge-icons';
import { ToggleViewService } from '../../../shared/services/shared/toggle-view.service';
import { AppComponent } from '../../../app.component';
import { MainLayoutComponent } from '../main-layout/main-layout.component';

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
  showParticles = false;

  constructor(
    private appComponent: AppComponent,
    private mainLayoutComponent: MainLayoutComponent,
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

  toggleView(): void {
    this.toggleViewService.toggleView();
  }

  // toggleParticles() {
  //   this.appComponent.toggleParticles();
  //   this.showParticles = !this.showParticles;
  //   console.log(this.showParticles);
  // }

  toggleParticles() {
    this.mainLayoutComponent.toggleParticles();
    this.showParticles = !this.showParticles;
  }

}
