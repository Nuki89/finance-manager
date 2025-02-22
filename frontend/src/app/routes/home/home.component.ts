import { CommonModule } from '@angular/common';
import { Component, Inject, Input, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PieChartComponent } from '../../shared/ui/charts/pie-chart.component';
import { BarChartComponent } from '../../shared/ui/charts/bar-chart.component';
import { ReportService } from '../../shared/services/api/report.service';
import { IncomeService } from '../../shared/services/api/income.service';
import { ExpenseService } from '../../shared/services/api/expense.service';
import { ToggleViewService } from '../../shared/services/shared/toggle-view.service';
import { Subscription } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeLoading03 } from '@ng-icons/huge-icons';
import { IncomeSummaryComponent } from './components/income-summary/income-summary.component';
import { ExpenseSummaryComponent } from './components/expense-summary/expense-summary.component';
import { ActionButtonComponent } from '../../shared/ui/components/action-button/action-button.component';
import { IncomeFormComponent } from '../transactions/incomes/income-form/income-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseFormComponent } from '../transactions/expenses/expense-form/expense-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, PieChartComponent, BarChartComponent, NgIcon, IncomeSummaryComponent, ExpenseSummaryComponent, ActionButtonComponent, IncomeFormComponent, ExpenseFormComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  viewProviders : [provideIcons({ hugeLoading03 })]
})
export class HomeComponent {
  @ViewChild(IncomeSummaryComponent) incomeSummaryComponent!: IncomeSummaryComponent;
  @ViewChild(ExpenseSummaryComponent) expenseSummaryComponent!: ExpenseSummaryComponent;
  private viewSubscription!: Subscription;
  loading: boolean = true;
  balance: any;
  currentBalance: number = 0;
  totalIncome: number = 0;
  totalExpense: number = 0;
  totalSaving: number = 0;

  selectedView: string = 'month';

  spendingCategories: { name: string; value: number }[] = [];
  incomeSources: { name: string; value: number }[] = [];

  selectedSource: any = null; 
  incomes: any[] = [];
  @Input() sources: any[] = []; 
  selectedSourceObj: any | null = null;

  constructor(
    private reportService: ReportService,
    private incomeService: IncomeService,
    private expenseService: ExpenseService,
    private toggleViewService: ToggleViewService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.balanceInfo();

    this.viewSubscription = this.toggleViewService.viewMode$.subscribe(view => {
      this.selectedView = view;
      this.loadAllData();
    });

  }
  
  balanceInfo() {
    this.reportService.getBalance().subscribe((data: any) => {
      this.balance = data;  
      this.currentBalance = data.available_balance;    
      this.totalSaving = data.total_savings;
    });

  }

  loadAllData(): void {
    this.loading = true;
  
    Promise.all([this.fetchIncomeData(), this.fetchExpenseData()])
      .then(() => {
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
  }

  fetchIncomeData(): Promise<void> {
    return new Promise((resolve, reject) => {
      const sourceDataFetcher =
        this.selectedView === 'Yearly'
          ? this.incomeService.getYearlySourceSummary()
          : this.incomeService.getLastMonthSourceSummary();
  
      sourceDataFetcher.subscribe(
        (data: any) => {
          this.incomeSources = [...data.map((item: any) => ({
            name: item.source__name,
            value: item.total_amount
          }))];
  
          console.log("Updated Income Sources:", this.incomeSources);
          resolve(); 
        },
        (error) => {
          console.error(`Error fetching ${this.selectedView} income sources:`, error);
          this.incomeSources = [];
          reject();
        }
      );
    });
  }
  
  fetchExpenseData(): Promise<void> {
    return new Promise((resolve, reject) => {
      const categoryDataFetcher =
        this.selectedView === 'Yearly'
          ? this.expenseService.getYearlyCategorySummary()
          : this.expenseService.getLastMonthCategorySummary();
  
      categoryDataFetcher.subscribe(
        (data: any) => {
          this.spendingCategories = [...data.map((item: any) => ({
            name: item.category__name,
            value: item.total_amount
          }))];
  
          console.log("Updated Spending Categories:", this.spendingCategories);
          resolve(); 
        },
        (error) => {
          console.error(`Error fetching ${this.selectedView} spending categories:`, error);
          this.spendingCategories = [];
          reject();
        }
      );
    });
  }

  incomeVsExpense = {
    labels: [
      'January', 'February', 'March', 'April', 
      'May', 'June', 'July', 'August', 
      'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Income',
        data: [5000, 4500, 5200, 4800],
        backgroundColor: '#3b82f6',
      },
      {
        label: 'Expense',
        data: [3200, 3000, 3500, 3300],
        backgroundColor: '#ef4444',
      },
    ],
  };

  recentTransactions = [
    { name: 'Groceries', amount: -120 },
    { name: 'Salary', amount: 3000 },
    { name: 'Subscription', amount: -15 },
  ];

  openAddIncomeModal() {
    const dialogRef = this.dialog.open(IncomeFormComponent, {
      width: '800px',
      data: {
        selectedSource: null,
        title: 'Add New Income',
      },
    });

    dialogRef.afterClosed().subscribe((onAddIncome) => {
      console.log('Dialog closed:', onAddIncome);
      if (onAddIncome) {
        this.loadAllData();
        this.incomeSummaryComponent.fetchIncomeData();
      }
    });
  }

  openAddExpenseModal() {
    const dialogRef = this.dialog.open(ExpenseFormComponent, {
      width: '800px',
      data: {
        selectedSource: null,
        title: 'Add New Expense',
      },
    });

    dialogRef.afterClosed().subscribe((onAddExpense) => {
      console.log('Dialog closed:', onAddExpense);
      if (onAddExpense) {
        this.loadAllData();
        this.expenseSummaryComponent.fetchExpenseData();
      }
    });
  }

  addExpense() {
    console.log('Add Expense clicked');
  }

  createSavingsGoal() {
    console.log('Create Savings Goal clicked');
  }
}
