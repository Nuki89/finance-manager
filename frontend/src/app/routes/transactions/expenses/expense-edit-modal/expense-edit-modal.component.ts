import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatepickerComponent } from '../../../../shared/ui/components/datepicker/datepicker.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { ActionButtonComponent } from '../../../../shared/ui/components/action-button/action-button.component';
import { ExpenseService } from '../../../../shared/services/api/expense.service';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../../../../shared/services/shared/shared-data.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'app-expense-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DatepickerComponent, NgIcon, ActionButtonComponent],
  templateUrl: './expense-edit-modal.component.html',
  styleUrls: ['./expense-edit-modal.component.css'],
  viewProviders : [provideIcons({ heroXMark })]
})
export class ExpenseEditModalComponent {
  constructor(
    private expenseService: ExpenseService,
    private toastr: ToastrService,
    private sharedDataService: SharedDataService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public rawData: any
  ) {}

  categories: any[] = [];
  selectedCategory: any = null;
  amount: number | null = null;
  description: string = '';
  selectedDate: Date | null = null;
  selectedCategoryObj: any | null = null;


  ngOnInit() {
    this.loadData();
    this.initializeForm();
  }

  loadData() {
    this.expenseService.getExpenseCategory()
      .subscribe({
        next: (categories: any) => {
          this.categories = categories;
          if (this.rawData) {
            this.selectedCategory = this.rawData.category_data ? this.rawData.category_data.id : this.rawData.category;
          }
        },
        error: (error) => {
          console.error('Error fetching categories:', error);
        }
      }
    );
  }

  initializeForm() {
    if (this.rawData) {
      this.selectedCategory = this.rawData.category_data ? this.rawData.category_data.id : this.rawData.category;
      this.amount = this.rawData.amount;
      this.description = this.rawData.description;
      this.selectedDate = this.rawData.date ? new Date(this.rawData.date) : new Date();
    }
  }

  onSaveExpense() {
    if (!this.selectedCategory || !this.amount) {
      this.toastr.error('Please fill in all required fields.','Error adding expense');
      return;
    }

    const formattedDate = this.selectedDate
    ? moment(this.selectedDate).format('YYYY-MM-DD')  
    : moment().format('YYYY-MM-DD');  

    const payload = {
      category: this.selectedCategory,
      amount: this.amount,
      date: formattedDate,
      description: this.description || '',
    };

    // console.log('Payload:', payload);

    this.expenseService.updateExpense(this.rawData.id, payload).subscribe(
      (data: any) => {
        // console.log('Backend Response:', data);
        this.toastr.success('Expense updated successfully!','Expense updated');
        this.selectedCategory = null;
        this.amount = null;
        this.selectedDate = null;
        this.description = '';
        this.loadData();
        this.sharedDataService.notifyExpenseChanged();
        this.closeModal();
      },
      (error) => {
        console.error('Error updating expense:', error);
        this.toastr.error('Failed to update expense. Please try again.','Error updating expense');
      }
    );
  }

  onDatePicked(date: Date) {
    this.selectedDate = date;
  }

  onCategorySelect() {
    this.selectedCategoryObj = this.categories.find(
      (category) => category.id === Number(this.selectedCategory)  
    ) || null;
  }

  closeModal() {
    this.dialog.closeAll();
  }

}
