import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { Saving } from '../../../shared/models/saving.model';
import { Subject, takeUntil } from 'rxjs';
import { SavingService } from '../../../shared/services/api/saving.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SavingFormComponent } from './saving-form/saving-form.component';
import { SharedTableComponent } from '../../../shared/ui/components/shared-table/shared-table.component';

@Component({
  selector: 'app-savings',
  standalone: true,
  imports: [CommonModule, SavingFormComponent, SharedTableComponent],
  templateUrl: './savings.component.html',
  styleUrls: ['./savings.component.css']
})
export class SavingsComponent {
  public savings: Saving[] = [];
  public savingsCategorySummary: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private savingService: SavingService,
    private dialog: MatDialog,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.fetchSavings();
    this.fetchSummary();
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

  private fetchSummary(): void {
    this.savingService.getSummaryByCategory()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        this.savingsCategorySummary = data as any[];
        console.log('Summary:', this.savingsCategorySummary);
      },
      error: (error) => {
        this.toastr.error('Failed to load savings. Please try again.');
        console.error('Error fetching savings:', error);
      }
    })
  }

}
