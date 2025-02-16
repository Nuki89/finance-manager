import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { ParticlesBackgroundComponent } from '../../../shared/ui/components/particles-background/particles-background.component';
import { CommonModule } from '@angular/common';
import { ToggleParticlesService } from '../../../shared/services/shared/toggle-particles.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, ParticlesBackgroundComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  showParticles = false;

  constructor(private toggleParticlesService: ToggleParticlesService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      import('flowbite').then(({ initFlowbite }) => {
        initFlowbite();
      });
    }

    this.toggleParticlesService.showParticles$.subscribe(state => {
      this.showParticles = state;
    });

  }

  toggleParticles() {
    this.toggleParticlesService.toggleParticles();
  }
  
}
