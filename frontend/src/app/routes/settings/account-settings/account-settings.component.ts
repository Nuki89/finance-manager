import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapCamera } from '@ng-icons/bootstrap-icons';


@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon],
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css'],
  viewProviders : [provideIcons({ bootstrapCamera })]
})
export class AccountSettingsComponent {
  public name: string = '';
  public surname: string = '';
  public username: string = '';
  public email: string = '';

  public profile: any = [];
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getFetchProfie();
  }

  private getFetchProfie(): void {
      this.authService.getProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.profile = data;
          console.log('Profile:', this.profile);
          this.name = this.profile.name;
          this.surname = this.profile.surname;
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
