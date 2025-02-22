import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionButtonComponent } from '../../../../shared/ui/components/action-button/action-button.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ExpenseService } from '../../../../shared/services/api/expense.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-category-add-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ActionButtonComponent, NgIcon],
  templateUrl: './category-add-modal.component.html',
  styleUrls: ['./category-add-modal.component.css'],
  viewProviders : [provideIcons({ heroXMark })]
})
export class CategoryAddModalComponent {
  categories: any[] = [];
  newCategoryName: string = '';

  constructor(
    private expenseService: ExpenseService, 
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CategoryAddModalComponent>, 
    ) { }

  loadData() {
    forkJoin({
      categories: this.expenseService.getExpenseCategory()
    }).subscribe(
      ({ categories }) => {
        this.categories = categories as any[];
        
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    )
  }

  addNewCategory() {
    if (!this.newCategoryName) {
      this.toastr.error('Please enter a category name.','Error adding expense category');
      return;
    }

    const payload = {
      name: this.newCategoryName,
    };

    this.expenseService.addExpenseCategory(payload).subscribe(
      (data: any) => {
        this.toastr.success('Expense category added successfully!','Expense category added');
        this.dialogRef.close(data); 
        this.newCategoryName = '';
        this.loadData();
      },
      (error) => {
        console.error('Error adding expense category:', error);
        this.toastr.error('Failed to add expense category. Please try again.','Error adding expense category');
      }
    );
  }

  closeModal() {
    this.dialogRef.close();
  }

}
