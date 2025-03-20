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
  @Input() currentBalance: string = '';
  @Input() last_updated: string = '';

}
