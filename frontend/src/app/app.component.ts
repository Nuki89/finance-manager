import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './shared/services/auth/auth.service';
import { ParticlesBackgroundComponent } from "./shared/ui/components/particles-background/particles-background.component";
import { DarkModeService } from './shared/services/shared/dark-mode.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    ParticlesBackgroundComponent
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'finance-manager';
  showParticles = false;
  themeClass: string = 'light-background';
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private darkService: DarkModeService,
    private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showParticles = event.url.includes('/login') || event.url.includes('/main');
      }
    });
  }

  ngOnInit(): void {
    this.subscribeToDarkMode();
    // REMOVED SO NOW STAYS ON THE SAME PAGE WHEN RELOADED
    // this.loading = true;
    // if (this.authService.isLoggedIn()) {
    //   this.router.navigate(['home']);
    // } else {
    //   this.router.navigate(['/login']);
    // }
    // this.loading = false;

    if (typeof window !== 'undefined') {
      import('flowbite').then(({ initFlowbite }) => {
        initFlowbite();
      });
    }
    
  }

  toggleParticles() {
    this.showParticles = !this.showParticles;
  }
  
  subscribeToDarkMode(): void {
    this.darkService.darkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDark: boolean) => {
        this.themeClass = isDark ? 'dark-background' : 'light-background';
      }
    );
  }
  
}
