import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, PieChartComponent, BarChartComponent, NgIcon],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  viewProviders : [provideIcons({ hugeLoading03 })]
})
export class HomeComponent {
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

  constructor(
    private reportService: ReportService,
    private incomeService: IncomeService,
    private expenseService: ExpenseService,
    private toggleViewService: ToggleViewService
  ) {}

  ngOnInit() {
    this.balanceInfo();

    this.viewSubscription = this.toggleViewService.viewMode$.subscribe(view => {
      this.selectedView = view;
      this.fetchIncomeData();
    });

  }
  
  balanceInfo() {
    this.reportService.getBalance().subscribe((data: any) => {
      this.balance = data;  
      this.currentBalance = data.available_balance;    
      this.totalSaving = data.total_savings;
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

    // this.incomeService.getLastMonthIncome().subscribe((data:any) => {
    //   this.totalIncome = data.reduce((sum: any, item: { total_amount: any; }) => sum + item.total_amount, 0);
    // });

    // this.incomeService.getLastYearIncome().subscribe((data:any) => {
    //   this.totalIncome = data.reduce((sum: any, item: { total_amount: any; }) => sum + item.total_amount, 0);
    // });

    // this.incomeService.getYearlySourceSummary().subscribe((data:any) => {
    //   this.incomeSources = data.map((item: any) => ({
    //     name: item.source__name,
    //     value: item.total_amount     
    //   }));
    //   console.log(data);
    // });

    // this.incomeService.getLastMonthSourceSummary().subscribe((data:any) => {
    //   this.incomeSources = data.map((item: any) => ({
    //     name: item.source__name,
    //     value: item.total_amount     
    //   }));
    //   console.log(data);
    // });
  }

  
  // fetchIncomeData(): void {
  //   this.loading = true; 

  //   const dataFetcher =
  //     this.selectedView === 'Yearly'
  //       ? this.incomeService.getYearlySourceSummary()
  //       : this.incomeService.getLastMonthSourceSummary();

  //   dataFetcher.subscribe(
  //     (data: any) => {
  //       this.incomeSources = data.map((item: any) => ({
  //         name: item.source__name,
  //         value: item.total_amount
  //       }));
  //       console.log(`${this.selectedView} Income Sources:`, data);
  //       this.loading = false; 
  //     },
  //     (error) => {
  //       console.error(`Error fetching ${this.selectedView} income sources:`, error);
  //       this.incomeSources = [];
  //       this.loading = false;
  //     }
  //   );
  // }

  fetchIncomeData(): void {
    this.loading = true; 

    const sourceDataFetcher =
      this.selectedView === 'Yearly'
        ? this.incomeService.getYearlySourceSummary()
        : this.incomeService.getLastMonthSourceSummary();

    const totalIncomeFetcher =
      this.selectedView === 'Yearly'
        ? this.incomeService.getLastYearIncome()
        : this.incomeService.getLastMonthIncome();

    sourceDataFetcher.subscribe(
      (data: any) => {
        this.incomeSources = data.map((item: any) => ({
          name: item.source__name,
          value: item.total_amount
        }));
        this.checkLoadingComplete();
      },
      (error) => {
        console.error(`Error fetching ${this.selectedView} income sources:`, error);
        this.incomeSources = [];
        this.checkLoadingComplete();
      }
    );

    totalIncomeFetcher.subscribe(
      (data: any) => {
        this.totalIncome = data.reduce((sum: any, item: { total_amount: any }) => sum + item.total_amount, 0);
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
