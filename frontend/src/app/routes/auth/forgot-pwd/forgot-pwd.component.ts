import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { cryptoBtc } from '@ng-icons/cryptocurrency-icons';

@Component({
  selector: 'app-forgot-pwd',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgIcon],
  templateUrl: './forgot-pwd.component.html',
  styleUrls: ['./forgot-pwd.component.css'],
  providers: [provideIcons({ cryptoBtc })]
})
export class ForgotPwdComponent {
  public title = "Coiny"
}
