import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input } from '@angular/core';
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
  @Input() currentBalance: string = '';
  @Input() last_updated: string = '';

}
