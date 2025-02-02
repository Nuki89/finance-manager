import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PieChartComponent } from '../../shared/ui/charts/pie-chart.component';
import { BarChartComponent } from '../../shared/ui/charts/bar-chart.component';
import { ReportService } from '../../shared/services/api/report.service';
import { IncomeService } from '../../shared/services/api/income.service';
import { ExpenseService } from '../../shared/services/api/expense.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, PieChartComponent, BarChartComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  balance: any;
  currentBalance: number = 0;
  totalIncome: number = 0;
  totalExpense: number = 0;
  totalSaving: number = 0;

  selectedView: string = 'month';

  spendingCategories: { name: string; value: number }[] = [];
  incomeSources: { name: string; value: number }[] = [];

  constructor(
    private reportService: ReportService,
    private incomeService: IncomeService,
    private expenseService: ExpenseService,
  ) {}

  ngOnInit() {
    this.balanceInfo();
  }
  
  balanceInfo() {
    this.reportService.getBalance().subscribe((data: any) => {
      this.balance = data;  
      this.currentBalance = data.available_balance;    
      this.totalSaving = data.total_savings;
    });

    this.incomeService.getLastMonthIncome().subscribe((data:any) => {
      this.totalIncome = data.reduce((sum: any, item: { total_amount: any; }) => sum + item.total_amount, 0);
    });

    this.expenseService.getLastMonthExpense().subscribe((data:any) => {
      this.totalExpense = data.reduce((sum: any, item: { total_amount: any; }) => sum + item.total_amount, 0);
    });

    this.expenseService.getLastMonthCategorySummary().subscribe((data:any) => {
      this.spendingCategories = data.map((item: any) => ({
        name: item.category__name,
        value: item.total_amount     
      }));
      console.log(this.spendingCategories);
    });

    this.incomeService.getLastMonthSourceSummary().subscribe((data:any) => {
      this.incomeSources = data.map((item: any) => ({
        name: item.source__name,
        value: item.total_amount     
      }));
      console.log(data);
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

  addIncome() {
    console.log('Add Income clicked');
  }

  addExpense() {
    console.log('Add Expense clicked');
  }

  createSavingsGoal() {
    console.log('Create Savings Goal clicked');
  }
}
