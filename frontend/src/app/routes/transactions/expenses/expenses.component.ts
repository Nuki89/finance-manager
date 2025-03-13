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

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, RouterModule, ExpenseFormComponent, SharedTableComponent],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent {
  public expenses: any = []
  public expense_categories: any = []

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

  public clearFilter(): void {
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
        this.expenses = data;        
      },
      error: (err) => {
        this.toastr.error('Failed to load expenses. Please try again.');
        console.error('Failed to fetch expenses', err)
      }
    })
  }
  
}
