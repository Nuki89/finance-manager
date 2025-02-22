import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionButtonComponent } from '../../../../shared/ui/components/action-button/action-button.component';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { forkJoin } from 'rxjs';
import { ExpenseService } from '../../../../shared/services/api/expense.service';
import { SharedDataService } from '../../../../shared/services/shared/shared-data.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationModuleComponent } from '../../../../shared/ui/components/confirmation-module/confirmation-module.component';

@Component({
  selector: 'app-category-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ActionButtonComponent, NgIcon],
  templateUrl: './category-edit-modal.component.html',
  styleUrl: './category-edit-modal.component.css',
  viewProviders : [provideIcons({ heroXMark })],
})
export class CategoryEditModalComponent {
  @Input() categories: any[] = [];
  selectedCategory: any = null;
  expenses: any[] = [];
  selectedCategoryObj: any | null = null;
  selectedDate: Date | null = null;

  constructor(
    private expenseService: ExpenseService,
    private sharedDataService: SharedDataService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<CategoryEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedCategoryObj = { ...data.selectedCategory };
    this.categories = data.categories || [];
   }

  loadData() {
    forkJoin({
      categories: this.expenseService.getExpenseCategory(),
      expenses: this.expenseService.getAllExpenses()
    }).subscribe(
      ({ categories, expenses }) => {
        this.categories = categories as any[];
        this.expenses = expenses as any[];
        if (this.categories.length > 0) {
          this.selectedCategory = this.categories[0].id;
          this.onCategorySelect();
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  onCategorySelect() {
    this.selectedCategoryObj = this.categories.find(
      (category) => category.id === Number(this.selectedCategory)  
    ) || null;
  }

  updateExpenseCategory(id: number, name: string) {
    if (!name) {
      this.toastr.error('Please enter a category name.','Error updating expense category');
      return;
    }

    const payload = {
      name: name,
    };

    this.expenseService.updateExpenseCategory(id, payload).subscribe(
      (data: any) => {
        this.toastr.success('Category updated successfully');
        this.dialogRef.close({ id, name });
        this.loadData();
        this.sharedDataService.notifyExpenseChanged();
      },
      (error) => {
        console.error('Error updating category:', error);
        this.toastr.error('Failed to update expense category. Please try again.', 'Error updating category');
      }
    );

  }

  handleDeleteCategory(id: number) {
    const categoryToDelete = this.categories.find((category) => category.id === id);

    const dialogRef = this.dialog.open(ConfirmationModuleComponent, {
      width: '400px',
      data: {
        title: 'Delete Expense Category',
        message: `Are you sure you want to delete the category "${categoryToDelete.name}"?`,
      }
    })

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.expenseService.deleteExpenseCategory(id).subscribe(
          () => {
            this.toastr.success(`Category "${categoryToDelete?.name}" deleted successfully!`);
            this.dialogRef.close({ id });
            this.loadData();
          },
          (error) => {
            const specificErrorMessage = "Cannot delete this category because it has associated expense. Please delete all related expense first.";
            
            if (error.status === 400 && error.error?.detail === specificErrorMessage) {
              this.toastr.warning(specificErrorMessage);
            } else {
              this.toastr.error(`Failed to delete "${categoryToDelete?.name}". Please try again.`);
            }
            console.error('Error deleting expense categories:', error);
          }
        );
      }
    })

  }

  closeModal() {
    this.dialogRef.close();
  }

}
