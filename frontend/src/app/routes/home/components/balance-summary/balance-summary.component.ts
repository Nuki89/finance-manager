import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-balance-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './balance-summary.component.html',
  styleUrl: './balance-summary.component.css'
})
export class BalanceSummaryComponent {
  @Input() currentBalance: number = 0;
  @Input() last_updated: string = '';
  
  ngOnInit() {
    console.log('Current locale:', Intl.DateTimeFormat().resolvedOptions().locale);
  }

  get formattedBalance(): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(this.currentBalance);
  }
  
}
