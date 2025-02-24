import { CommonModule } from '@angular/common';
import { Component, inject} from '@angular/core';
import { DarkModeService } from '../../../services/shared/dark-mode.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroSun, heroMoon } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-dark-mode',
  standalone: true,
  providers: [provideIcons({ heroSun, heroMoon })],
  imports: [CommonModule, NgIcon],
  template: `
    <button (click)="toggleTheme()" class="inline-flex items-center focus:outline-none">
      <ng-icon 
        [name]="(darkService.darkMode$ | async) ? 'heroMoon' : 'heroSun'"
        title="Toggle dark mode" 
        [ngClass]="{ 'text-fuchsia-600': darkService.darkMode$ | async }"
        class="mr-4 text-xl">
      </ng-icon>
    </button>
  `,
  styles: ``
})
export class DarkModeComponent {

  public darkService = inject(DarkModeService);
  
  isDarkMode = false;
  heroMoon = heroMoon;
  heroSun = heroSun;

  toggleTheme() {
    this.darkService.toggleDarkMode();
  }
}
