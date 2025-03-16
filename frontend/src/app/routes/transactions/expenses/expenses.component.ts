import { Component } from '@angular/core';
import { ExpenseFormComponent } from "./expense-form/expense-form.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExpenseService } from '../../../shared/services/api/expense.service';
import { SharedTableComponent } from '../../../shared/ui/components/shared-table/shared-table.component';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationModuleComponent } from '../../../shared/ui/components/confirmation-module/confirmation-module.component';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseEditModalComponent } from './expense-edit-modal/expense-edit-modal.component';
import { DatepickerComponent } from '../../../shared/ui/components/datepicker/datepicker.component';
import { ActionButtonComponent } from '../../../shared/ui/components/action-button/action-button.component';
import { FormControl, FormsModule } from '@angular/forms';
import moment from 'moment';
import { Expense } from '../../../shared/models/expense.model';
import { hugeFilter, hugeFilterRemove } from '@ng-icons/huge-icons';
import { provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, RouterModule, ExpenseFormComponent, SharedTableComponent, DatepickerComponent, ActionButtonComponent, FormsModule],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
  viewProviders : [ provideIcons({ hugeFilter, hugeFilterRemove})]
})
export class ExpensesComponent {
  public expenses: Expense[] = []
  public expense_categories: any = []
  public searchTerm: string = '';
  public selectedDate: Date | null = null;
  
  private originalExpenses: Expense[] = []; 
  private initialDate: Date | null = null;
  private date = new FormControl();
  private destroy$ = new Subject<void>();

  constructor(
    private expenseService: ExpenseService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.fetchExpenses();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public filterExpensesByCategory(categoryName: string) {
    this.expenseService.getExpenseByCategory(categoryName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.expenses = data;
        },
        error: (err) => {
          this.toastr.error('Failed to filter expenses. Please try again.');
          console.error('Failed to filter expenses', err);
        }
      }
    );
  }

  public onDatePicked(date: Date) {
    this.selectedDate = date;
  
    if (this.selectedDate) {
      const selectedDateFormatted = moment(this.selectedDate).format('YYYY-MM-DD');
  
      this.expenses = this.originalExpenses.filter((expense) => {
        const expenseDate = moment(expense.date).format('YYYY-MM-DD');
        return expenseDate === selectedDateFormatted;
      });
    } else {
      this.expenses = [...this.originalExpenses];
    }
  }

  public filterExpenses() {
    if (!this.searchTerm) {
      this.expenses = [...this.originalExpenses];
      return;
    }

    const term = this.searchTerm.toLowerCase();

    this.expenses = this.originalExpenses.filter((expense) => {
      return (
        expense.category_data?.name?.toLowerCase().includes(term) ||
        expense.amount?.toString().toLowerCase().includes(term) ||
        expense.date?.toLowerCase().includes(term) ||
        expense.description?.toLowerCase().includes(term)
      );
    });
  }

  public clearFilter(): void {
    if (this.searchTerm) {
      this.searchTerm = '';
      this.expenses = [...this.originalExpenses];
    }
    this.handleDataChange();
  }

  public handleDataChange(): void {
    this.fetchExpenses();  
  }
  
  public getExpenseCategories() {
    return this.expense_categories || [];
  }

  public handleEdit(expenseData: any): void {
    const dialogRef = this.dialog.open(ExpenseEditModalComponent, {
      width: '600px',
      data: expenseData  
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toastr.success('Expense updated successfully!');
        this.fetchExpenses(); 
      }
    });
  }

  public handleDelete(expenseId: number): void {
    const dialogRef = this.dialog.open(ConfirmationModuleComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this expense?'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.expenseService.deleteExpense(expenseId).subscribe(() => {
          this.toastr.success('Expense deleted successfully!');
          this.fetchExpenses();  
        }, error => {
          this.toastr.error('Failed to delete expense. Please try again.');
          console.error('Error deleting expense:', error);
        });
      }
    });
  }

  private fetchExpenses(): void {
    this.expenseService.getExpense()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        this.originalExpenses = data;  
        this.expenses = [...this.originalExpenses];      
      },
      error: (err) => {
        this.toastr.error('Failed to load expenses. Please try again.');
        console.error('Failed to fetch expenses', err)
      }
    })
  }
  
}
