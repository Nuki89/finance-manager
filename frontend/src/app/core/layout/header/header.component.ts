import { NgIcon, provideIcons } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { hugeSettings01 } from '@ng-icons/huge-icons';
import { ToggleViewService } from '../../../shared/services/shared/toggle-view.service';
import { ToggleParticlesService } from '../../../shared/services/shared/toggle-particles.service';
import { DarkModeComponent } from "../../../shared/ui/components/dark-mode/dark-mode.component";
import { DarkModeService } from '../../../shared/services/shared/dark-mode.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DarkModeComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  viewProviders : [provideIcons({ hugeSettings01 })]
})
export class HeaderComponent {
  title: string = "Coiny";
  firstName: string = 'Nuki';
  lastName: string = 'Pipika';
  email: string = 'nuki@gmail.com';
  currentView: 'Monthly' | 'Yearly';
  showParticles = false;
  private destroy$ = new Subject<void>();
  isDarkMode: boolean = false;

  constructor(
    private authService: AuthService,
    private darkService: DarkModeService,
    private toggleParticlesService: ToggleParticlesService,
    private toggleViewService: ToggleViewService) {
      this.currentView = this.toggleViewService.getCurrentView();
      this.toggleViewService.viewMode$.subscribe(view => {
      this.currentView = view;
    });
    
  }

  ngOnInit(): void {
    this.toggleParticlesService.showParticles$.subscribe(state => {
      this.showParticles = state;
    });
    this.subscribeToDarkMode();
  }

  subscribeToDarkMode(): void {
    this.darkService.darkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDark: boolean) => {
        this.isDarkMode = isDark;
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLogout(): void {
    this.authService.logout()
    console.log('Logout successful');
  }

  toggleView(): void {
    this.toggleViewService.toggleView();
  }

  toggleParticles() {
    this.toggleParticlesService.toggleParticles();
  }

}
