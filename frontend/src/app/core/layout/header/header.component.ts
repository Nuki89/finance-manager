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
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DarkModeComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  viewProviders : [provideIcons({ hugeSettings01 })]
})
export class HeaderComponent {
  public title: string = "Coiny";
  public username: string = '';
  public email: string = '';
  public currentView: 'Monthly' | 'Yearly';
  public showParticles = false;
  public isDarkMode: boolean = false;
  
  private destroy$ = new Subject<void>();
  private profile: any;

  constructor(
    private authService: AuthService,
    private darkService: DarkModeService,
    private toggleParticlesService: ToggleParticlesService,
    private toggleViewService: ToggleViewService,
    private toastr: ToastrService
  ) {
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
    this.getFetchProfie();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public toggleView(): void {
    this.toggleViewService.toggleView();
  }

  public toggleParticles() {
    this.toggleParticlesService.toggleParticles();
  }

  public onLogout(): void {
    this.authService.logout()
  }

  private subscribeToDarkMode(): void {
    this.darkService.darkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDark: boolean) => {
        this.isDarkMode = isDark;
      }
    );
  }

  private getFetchProfie(): void {
    this.authService.getProfile()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        this.profile = data;
        this.email = this.profile.email;
        this.username = this.profile.username;
      },
      error: (error) => {
        this.toastr.error('Failed to load savings. Please try again.');
        console.error('Error fetching savings:', error);
      }
    })
  }

}
