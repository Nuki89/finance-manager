import { Component } from '@angular/core';
import { IncomeService } from '../../../../shared/services/api/income.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToggleViewService } from '../../../../shared/services/shared/toggle-view.service';

@Component({
  selector: 'app-income-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './income-summary.component.html',
  styleUrl: './income-summary.component.css'
})
export class IncomeSummaryComponent {
  public incomeSources: { name: string; value: number }[] = [];
  public selectedView: string = 'Month';
  public formattedIncome: string = '';
  
  private totalIncome: number = 0;
  private viewSubscription: any;
  private loading: boolean = true;

  constructor(
    private incomeService: IncomeService, 
    private toggleViewService: ToggleViewService
  ) {}

  ngOnInit() {
    this.viewSubscription = this.toggleViewService.viewMode$.subscribe(view => {
      this.selectedView = view;
      this.fetchIncomeData();
    });

  }

  fetchIncomeData(): void {
    this.loading = true; 

    const totalIncomeFetcher =
      this.selectedView === 'Yearly'
        ? this.incomeService.getLastYearIncome()
        : this.incomeService.getLastMonthIncome();

    totalIncomeFetcher.subscribe(
      (data: any) => {
        this.totalIncome = parseFloat(
          data.reduce((sum: any, item: { total_amount: any }) => sum + item.total_amount, 0).toFixed(2)
        );
        this.formattedIncome = this.totalIncome.toLocaleString('de-DE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        this.checkLoadingComplete();
      },
      (error) => {
        console.error(`Error fetching ${this.selectedView} total income:`, error);
        this.totalIncome = 0;
        this.checkLoadingComplete();
      }
    );
  }

  checkLoadingComplete(): void {
    if (this.incomeSources.length > 0 || this.totalIncome !== 0) {
      this.loading = false;
    }
  }

}
