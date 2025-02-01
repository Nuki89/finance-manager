import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { cryptoBtc } from '@ng-icons/cryptocurrency-icons';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgIcon],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  viewProviders : [provideIcons({ cryptoBtc })]
})
export class RegisterComponent {
  title = "Coiny"
}
