import { Component } from '@angular/core';
import { ExpenseService } from '../../../../shared/services/api/expense.service';
import { ToggleViewService } from '../../../../shared/services/shared/toggle-view.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expense-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expense-summary.component.html',
  styleUrls: ['./expense-summary.component.css']
})
export class ExpenseSummaryComponent {
  public formattedExpense: string = '';
  public selectedView: string = 'month';
  
  private totalExpense: number = 0;
  private viewSubscription: any;
  private loading: boolean = true;

  constructor(
    private expenseService: ExpenseService,
    private toggleViewService: ToggleViewService
  ) {}

  ngOnInit() {
    this.viewSubscription = this.toggleViewService.viewMode$.subscribe(view => {
      this.selectedView = view;
      this.fetchExpenseData();
    });
  }

  public fetchExpenseData(): void {
    this.loading = true; 

    const totalExpenseFetcher =
      this.selectedView === 'Yearly'
        ? this.expenseService.getLastYearExpense()
        : this.expenseService.getLastMonthExpense();

    totalExpenseFetcher.subscribe(
      (data: any) => {
        this.totalExpense = data.reduce((sum: any, item: { total_amount: any }) => sum + item.total_amount, 0);
        this.formattedExpense = this.totalExpense.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
        this.checkLoadingComplete();
      },
      (error) => {
        console.error(`Error fetching ${this.selectedView} total income:`, error);
        this.totalExpense = 0;
        this.checkLoadingComplete();
      }
    );
  }

  private checkLoadingComplete(): void {
    if (this.totalExpense !== 0) {
      this.loading = false;
    }
  }

}
