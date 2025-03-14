import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BarChartComponent, PieChartComponent } from '../../shared/ui/charts';
import { ReportService } from '../../shared/services/api/report.service';
import { IncomeService } from '../../shared/services/api/income.service';
import { ExpenseService } from '../../shared/services/api/expense.service';
import { ToggleViewService } from '../../shared/services/shared/toggle-view.service';
import { lastValueFrom, Subject } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeLoading03, hugeSettings01 } from '@ng-icons/huge-icons';
import { IncomeSummaryComponent } from './components/income-summary/income-summary.component';
import { ExpenseSummaryComponent } from './components/expense-summary/expense-summary.component';
import { ActionButtonComponent } from '../../shared/ui/components/action-button/action-button.component';
import { IncomeFormComponent } from '../transactions/incomes/income-form/income-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseFormComponent } from '../transactions/expenses/expense-form/expense-form.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SavingSummaryComponent } from './components/saving-summary/saving-summary.component';
import { HistoryService } from '../../shared/services/api/history.service';
import { SavingFormComponent } from '../transactions/savings/saving-form/saving-form.component';
import { SavingService } from '../../shared/services/api/saving.service';
import { BalanceSummaryComponent } from './components/balance-summary/balance-summary.component';
import { ColorSettingsModalComponent } from './components/color-settings-modal/color-settings-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, PieChartComponent, BarChartComponent, NgIcon, IncomeSummaryComponent, ExpenseSummaryComponent, ActionButtonComponent, SavingSummaryComponent, BalanceSummaryComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  viewProviders : [provideIcons({ hugeLoading03, hugeSettings01 })]
})
export class HomeComponent {
  @Input() sources: any[] = []; 

  @ViewChild(IncomeSummaryComponent) incomeSummaryComponent!: IncomeSummaryComponent;
  @ViewChild(ExpenseSummaryComponent) expenseSummaryComponent!: ExpenseSummaryComponent;
  @ViewChild(SavingSummaryComponent) savingSummaryComponent!: SavingSummaryComponent;
  @ViewChild(BalanceSummaryComponent) balanceSummaryComponent!: BalanceSummaryComponent
  @ViewChild(BarChartComponent) barChart!: BarChartComponent;
  @ViewChild(PieChartComponent) pieChart!: PieChartComponent;

  @ViewChild('incomePieChart') incomePieChart!: PieChartComponent;
  @ViewChild('expensePieChart') expensePieChart!: PieChartComponent;


  public loading: boolean = true;
  public selectedView: string = 'month';
  public balance: any;
  public totalIncome: number = 0;
  public totalExpense: number = 0;
  public totalSaving: number = 0;
  public recentTransactions: any[] = [];
  public savings: any[] = [];
  
  public spendingCategories: { name: string; value: number }[] = [];
  public incomeSources: { name: string; value: number }[] = [];
  public incomeVsExpense = this.initializeIncomeVsExpense();
  public incomeChartCategory = this.initializeChartData();
  public expenseChartCategory = this.initializeChartData();
  
  private selectedSource: any = null; 
  private incomes: any[] = [];
  private selectedSourceObj: any | null = null;
  private currentBalance: number = 0;
  private destroy$ = new Subject<void>();
  private lastYearIncome: any[] = [];
  private lastYearExpense: any[] = [];

  // public colorMap: { [key: string]: string } = {};
  public incomeColorMap: { [key: string]: string } = {};
  public expenseColorMap: { [key: string]: string } = {};

  private incomeColorKey = 'incomeCategoryColors';
  private expenseColorKey = 'expenseCategoryColors';

  private availableColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
    '#9966FF', '#FF9F40', '#8D99AE', '#00A878',
    '#F72585', '#06D6A0'
  ];
  private colorKey = 'categoryColors';

  constructor(
    private reportService: ReportService,
    private incomeService: IncomeService,
    private expenseService: ExpenseService,
    private historyService: HistoryService,
    private savingService: SavingService,
    private toggleViewService: ToggleViewService,
    private dialog: MatDialog,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit() {
    this.loadSavedColors();
    this.balanceInfo();

    this.toggleViewService.viewMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(view => {
        this.selectedView = view;
        this.loadAllData();
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public openAddIncomeModal() {
    const dialogRef = this.dialog.open(IncomeFormComponent, {
      width: '800px',
      data: {
        selectedSource: null,
        title: 'Add New Income',
        hideFilters: true,
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

  public openAddExpenseModal() {
    const dialogRef = this.dialog.open(ExpenseFormComponent, {
      width: '800px',
      data: {
        selectedSource: null,
        title: 'Add New Expense',
        hideFilters: true,
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

  public openAddSavingModal() {
    const dialogRef = this.dialog.open(SavingFormComponent, {
      width: '800px',
      data: {
        selectedSource: null,
        title: 'Add New Saving',
      },
    });

    dialogRef.afterClosed().subscribe((onAddSaving) => {
      console.log('Dialog closed:', onAddSaving);
      if (onAddSaving) {
        this.loadAllData();
        this.savingSummaryComponent.fetchSavingData();
      }
    });
  }

  public openColorSettingsModal(type: 'income' | 'expense') {
    const dialogRef = this.dialog.open(ColorSettingsModalComponent, {
      width: '400px',
      data: {
        selectedType: type,
        incomeSources: this.incomeSources.map(i => i.name),
        expenseSources: this.spendingCategories.map(i => i.name),
        incomeColorMap: this.incomeColorMap,
        expenseColorMap: this.expenseColorMap
      },
    });
  
    dialogRef.afterClosed().subscribe((onSaveColors) => {
      if (onSaveColors) {
        this.incomeColorMap = onSaveColors.incomeColorMap;
        this.expenseColorMap = onSaveColors.expenseColorMap;
  
        this.saveIncomeColors();
        this.saveExpenseColors();
  
        this.fetchIncomeData();
        this.fetchExpenseData();
      }
    });
  }  

  public updateCategoryColor(category: string, color: string, type: 'income' | 'expense') {
    if (type === 'income') {
        this.incomeColorMap[category] = color;
        this.saveIncomeColors();

        this.incomeChartCategory.datasets[0].backgroundColor = this.incomeSources.map(i => 
            this.incomeColorMap[i.name] || this.getRandomColor()
        );

        if (this.incomePieChart) {
            this.incomePieChart.updateChart();
        }
    }

    if (type === 'expense') {
        this.expenseColorMap[category] = color;
        this.saveExpenseColors();

        this.expenseChartCategory.datasets[0].backgroundColor = this.spendingCategories.map(i => 
            this.expenseColorMap[i.name] || this.getRandomColor()
        );

        if (this.expensePieChart) {
            this.expensePieChart.updateChart();
        }
    }
  }

  public onColorChange(category: string, event: Event, type: 'income' | 'expense') {
    const input = event.target as HTMLInputElement;
    if (input) {
        this.updateCategoryColor(category, input.value, type);
    }
  }

  private initializeChartData(): { labels: string[], datasets: { data: number[], backgroundColor: string[] }[] } {
    return {
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: this.availableColors
            }
        ]
    };
  }

  private initializeIncomeVsExpense(): { labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string }[] } {
    return {
        labels: [
            'January', 'February', 'March', 'April', 
            'May', 'June', 'July', 'August', 
            'September', 'October', 'November', 'December'
        ],
        datasets: [
            {
                label: 'Income',
                data: [], 
                backgroundColor: '#3b82f6',
            },
            {
                label: 'Expense',
                data: [], 
                backgroundColor: '#ef4444',
            },
        ],
    };
  }

  private async loadAllData(): Promise<void> {
    this.loading = true;
    try {
      await this.fetchIncomeData();
      await this.fetchExpenseData();
      await this.fetchLastYearIncome();
      await this.fetchLastYearExpense();
      await this.fetchHistory();
      await this.fetchSaving();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.loading = false;
    }
  }  

  private async fetchIncomeData(): Promise<void> {
    try {
      const sourceDataFetcher =
        this.selectedView === 'Yearly'
          ? this.incomeService.getYearlySourceSummary()
          : this.incomeService.getLastMonthSourceSummary();

      const data: any = await lastValueFrom(sourceDataFetcher);

      this.incomeSources = data.map((item: any) => ({
        name: item.source__name,
        value: item.total_amount
      }));

      const backgroundColors: string[] = this.incomeSources.map(i => {
        if (!this.incomeColorMap[i.name]) {
            if (this.availableColors.length > 0) {
                this.incomeColorMap[i.name] = this.availableColors.shift()!;
            } else {            
                this.incomeColorMap[i.name] = this.getRandomColor();
            }
            this.saveIncomeColors();
        }
        return this.incomeColorMap[i.name];
      });

      this.incomeChartCategory = {
        labels: this.incomeSources.map(i => i.name),
        datasets: [{
          data: this.incomeSources.map(i => i.value),
          backgroundColor: backgroundColors
        }]
      };

      // this.incomeChartCategory.labels = this.incomeSources.map(i => i.name);
      // this.incomeChartCategory.datasets[0].data = this.incomeSources.map(i => i.value);

      if (this.pieChart) {
          this.pieChart.updateChart();
      }

    } catch (error) {
      console.error(`Error fetching ${this.selectedView} income sources:`, error);
      this.incomeSources = [];
    }
  }
  
  private async fetchExpenseData(): Promise<void> {
    try {
      const categoryDataFetcher =
        this.selectedView === 'Yearly'
          ? this.expenseService.getYearlyCategorySummary()
          : this.expenseService.getLastMonthCategorySummary();
  
      const data: any = await lastValueFrom(categoryDataFetcher);
  
      this.spendingCategories = data.map((item: any) => ({
        name: item.category__name,
        value: item.total_amount
      }));

      const backgroundColors: string[] = this.spendingCategories.map(i => {
        if (!this.expenseColorMap[i.name]) {
            if (this.availableColors.length > 0) {
                this.expenseColorMap[i.name] = this.availableColors.shift()!;
            } else {            
                this.expenseColorMap[i.name] = this.getRandomColor();
            }
            this.saveExpenseColors();
        }
        return this.expenseColorMap[i.name];
      });
  
      this.expenseChartCategory = {
        labels: this.spendingCategories.map(i => i.name),
        datasets: [{
          data: this.spendingCategories.map(i => i.value),
          backgroundColor: backgroundColors
        }]
      };

      // this.expenseChartCategory.labels = this.spendingCategories.map(i => i.name);
      // this.expenseChartCategory.datasets[0].data = this.spendingCategories.map(i => i.value);

      if (this.pieChart) {
          this.pieChart.updateChart();
      }
  
    } catch (error) {
      console.error(`Error fetching ${this.selectedView} spending categories:`, error);
      this.spendingCategories = [];
    }
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

  private async fetchLastYearIncome() {
    try {
      const data: any = await lastValueFrom(this.incomeService.getLastYearIncome());
      this.lastYearIncome = Array(12).fill(0);

        data.forEach((item: any) => {
            const monthIndex = new Date(item.month).getMonth(); 
            this.lastYearIncome[monthIndex] = item.total_amount; 
        });

      this.incomeVsExpense.datasets[0].data = [...this.lastYearIncome];

      if (this.barChart) {
          this.barChart.updateChart();
      }

    } catch (error) {
      console.error('Error fetching last year income:', error);
    }
  }

  private async fetchLastYearExpense() {
    try {
      const data: any = await lastValueFrom(this.expenseService.getLastYearExpense());
      this.lastYearExpense = Array(12).fill(0);

        data.forEach((item: any) => {
            const monthIndex = new Date(item.month).getMonth(); 
            this.lastYearExpense[monthIndex] = item.total_amount;
        });

      this.incomeVsExpense.datasets[1].data = [...this.lastYearExpense];

      if (this.barChart) {
          this.barChart.updateChart();
      }

    } catch (error) {
      console.error('Error fetching last year expense:', error);
    }
  }

  private async fetchHistory() {
    try {
      const data: any = await lastValueFrom(this.historyService.getHistoryLast5());
      
      this.recentTransactions = data.map((item: any) => ({
        type: item.type,
        name: item.name,
        amount: item.amount,
        date: item.date ? this.dateFormatter({ value: item.date }) : '',
      }));

    } catch (error) {
      console.error('Error fetching history:', error);
    }
  }

  private dateFormatter(params: any): string {
    const date = new Date(params.value);
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();
    return `${day}.${month}.${year}`; 
  }

  private async fetchSaving() {
    try {
      const data: any = await lastValueFrom(this.savingService.getSummaryByCategory());
      this.savings = data;
    } catch (error) {
      console.error('Error fetching saving:', error);
      this.totalSaving = 0;
    }
  }

  private loadSavedColors() {
    const savedIncomeColors = localStorage.getItem(this.incomeColorKey);
    if (savedIncomeColors) {
        this.incomeColorMap = JSON.parse(savedIncomeColors);
    }

    const savedExpenseColors = localStorage.getItem(this.expenseColorKey);
    if (savedExpenseColors) {
        this.expenseColorMap = JSON.parse(savedExpenseColors);
    }
  }

  private saveIncomeColors() {
    localStorage.setItem(this.incomeColorKey, JSON.stringify(this.incomeColorMap));
  }

  private saveExpenseColors() {
      localStorage.setItem(this.expenseColorKey, JSON.stringify(this.expenseColorMap));
  }

  
  private getRandomColor(): string {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }
  
}
