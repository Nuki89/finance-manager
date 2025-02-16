import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { ParticlesBackgroundComponent } from '../../../shared/ui/components/particles-background/particles-background.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, HeaderComponent, ParticlesBackgroundComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      import('flowbite').then(({ initFlowbite }) => {
        initFlowbite();
      });
    }
    
  }
  
}
