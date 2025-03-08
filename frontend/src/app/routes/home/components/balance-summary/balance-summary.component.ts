import { CommonModule } from '@angular/common';
import { Component, DestroyRef } from '@angular/core';
import { ReportService } from '../../../../shared/services/api/report.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SharedDataService } from '../../../../shared/services/shared/shared-data.service';

@Component({
  selector: 'app-balance-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './balance-summary.component.html',
  styleUrl: './balance-summary.component.css'
})
export class BalanceSummaryComponent {
  public balance: any;
  public currentBalance: number = 0;

  constructor(
    private reportService: ReportService,
    private sharedDataService: SharedDataService,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit() {
    this.balanceInfo();

    this.sharedDataService.balanceChanged$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.balanceInfo();
    });
  }

  private balanceInfo() {
    this.reportService.getBalance()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: any) => {
          this.balance = data;  
          this.currentBalance = data.available_balance;    
        },
        error: (err) => {
          console.error('Failed to fetch balance:', err);
          this.balance = { available_balance: 0, total_savings: 0 };  
        }
      });
  }

}
