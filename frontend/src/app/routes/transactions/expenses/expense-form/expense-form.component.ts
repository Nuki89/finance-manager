import { CommonModule } from '@angular/common';
import { Component, Inject, Input, Optional, SimpleChanges } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ExpenseService } from '../../../../shared/services/api/expense.service';
import { FormControl, FormsModule } from '@angular/forms';
import { DatepickerComponent } from '../../../../shared/ui/components/datepicker/datepicker.component';
import { provideIcons } from '@ng-icons/core';
import { heroTrash, heroPlusSmall, heroPencilSquare } from '@ng-icons/heroicons/outline';
import { ActionButtonComponent } from '../../../../shared/ui/components/action-button/action-button.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { ConfirmationModuleComponent } from '../../../../shared/ui/components/confirmation-module/confirmation-module.component';
import { SharedDataService } from '../../../../shared/services/shared/shared-data.service';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, FormsModule, DatepickerComponent, ActionButtonComponent],
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css'],
  viewProviders : [provideIcons({ heroTrash, heroPlusSmall, heroPencilSquare })]
})
export class ExpenseFormComponent {
  @Input() categories: any[] = []; 
  expenses: any[] = [];
  selectedCategory: any = null;
  newCategoryName: string = '';

  amount: number | null = null;
  description: string = '';
  selectedDate: Date | null = null;
  initialDate: Date | null = null;
  selectedCategorieObj: any | null = null;

  date = new FormControl();

  constructor(
    private expenseService: ExpenseService,
    private toastr: ToastrService,
    private sharedDataService: SharedDataService,
    private dialog: MatDialog,
    @Optional() private dialogRef: MatDialogRef<ExpenseFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any 
  ) { }

  ngOnInit() {
    this.selectedDate = new Date();
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialDate'] && changes['initialDate'].currentValue) {
      this.setDateValue();
    }
  }

  private setDateValue() {
    if (this.initialDate) {
      this.date.setValue(moment(this.initialDate).toDate()); 
    } else {
      this.date.setValue(moment().toDate());
    }
  }

  loadData() {
    forkJoin({
      expenses: this.expenseService.getAllExpenses(),
      categories: this.expenseService.getExpenseCategories()
    }).subscribe(
      ({ expenses, categories }) => {
        this.expenses = expenses as any[];
        this.categories = categories as any[];
        console.log('Expenses:', this.expenses);
        console.log('Categories:', this.categories);
        if (this.categories.length > 0) {
          this.selectedCategory = this.categories[0].id;
          this.onCategorieSelect();
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  onCategorieSelect() {
    this.selectedCategorieObj = this.categories.find(
      (categorie) => categorie.id === Number(this.selectedCategory)  
    ) || null;
  }

  onDatePicked(date: Date) {
    this.selectedDate = date;
  }

  openAddCategoryModal() {
    // const dialogRef = this.dialog.open(SourceAddModalComponent, {
    //   width: '400px',
    //   data: {
    //     selectedCategory: null,
    //   },
    // });

    // dialogRef.afterClosed().subscribe((updatedCategorie) => {
    //   if (updatedCategorie) {
    //     this.loadData();
    //   }
    // });
  }
  
  openUpdateCategoryModal(selectedCategory: any) {
    // if (!selectedCategory) {
    //   this.toastr.error('No source selected.', 'Error');
    //   return;
    // }
  
    // const dialogRef = this.dialog.open(SourceEditModalComponent, {
    //   width: '400px',
    //   data: {
    //     selectedCategory: { ...this.selectedCategorieObj },
    //     categories: this.categories,
    //   },
    // });
  
    // dialogRef.afterClosed().subscribe((updatedCategorie) => {
    //   if (updatedCategorie) {
    //     this.loadData(); 
    //   }
    // });
  }

  handleDeleteCategory(id: number) {
    const categoryToDelete = this.categories.find(category => category.id === id);

    const dialogRef = this.dialog.open(ConfirmationModuleComponent, {
      width: '400px',
      data: {
        title: 'Delete Expense Category',
        message: `Are you sure you want to delete "${categoryToDelete?.name}"?`,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.expenseService.deleteExpenseCategories(id).subscribe(
          () => {
            this.toastr.success(`Expense category "${categoryToDelete?.name}" deleted successfully!`);
            this.loadData();
          },
          (error) => {
            const specificErrorMessage = "Cannot delete this category because it has associated incomes. Please delete all related incomes first.";
            
            if (error.status === 400 && error.error?.detail === specificErrorMessage) {
              this.toastr.warning(specificErrorMessage);
            } else {
              this.toastr.error(`Failed to delete "${categoryToDelete?.name}". Please try again.`);
            }
            console.error('Error deleting income category:', error);
          }
        );
      }
    });
  }

  onAddExpense() {
    if (!this.selectedCategory || !this.amount) {
      this.toastr.error('Please fill in all required fields.','Error adding income');
      return;
    }

    const formattedDate = this.selectedDate
    ? moment(this.selectedDate).format('YYYY-MM-DD')  
    : moment().format('YYYY-MM-DD');  

    const payload = {
      source: this.selectedCategory,
      amount: this.amount,
      date: formattedDate,
      description: this.description || '',
    };

    this.expenseService.addExpense(payload).subscribe(
      (data: any) => {
        this.toastr.success('Income added successfully!','Income added');
        this.selectedCategory = null;
        this.amount = null;
        this.selectedDate = null;
        this.description = '';
        this.loadData();
        this.sharedDataService.notifyIncomeChanged();

        if (this.dialogRef) {
          this.dialogRef.close(true);
        }

      },
      (error) => {
        console.error('Error adding income:', error);
        this.toastr.error('Failed to add income. Please try again.','Error adding income');
      }
    );
  }

}
