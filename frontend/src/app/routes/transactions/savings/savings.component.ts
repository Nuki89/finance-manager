import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { Saving } from '../../../shared/models/saving.model';
import { Subject, takeUntil } from 'rxjs';
import { SavingService } from '../../../shared/services/api/saving.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-savings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './savings.component.html',
  styleUrls: ['./savings.component.css']
})
export class SavingsComponent {
  public savings: Saving[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private savingService: SavingService,
    private dialog: MatDialog,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.fetchSavings();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private fetchSavings(): void {
    this.savingService.getSaving()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        this.savings = data;
        console.log('Savings:', this.savings);
      },
      error: (error) => {
        this.toastr.error('Failed to load savings. Please try again.');
        console.error('Error fetching savings:', error);
      }
    })
  }

}
