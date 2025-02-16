import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './shared/services/auth/auth.service';
import { ParticlesBackgroundComponent } from "./shared/ui/components/particles-background/particles-background.component";

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

  constructor(
    private authService: AuthService,
    private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showParticles = event.url.includes('/login') || event.url.includes('/main');
      }
    });
  }

  ngOnInit(): void {
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
  
  
}
