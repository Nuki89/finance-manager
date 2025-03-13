import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Optional, Output, SimpleChanges } from '@angular/core';
import { firstValueFrom, forkJoin } from 'rxjs';
import { ExpenseService } from '../../../../shared/services/api/expense.service';
import { FormControl, FormsModule } from '@angular/forms';
import { DatepickerComponent } from '../../../../shared/ui/components/datepicker/datepicker.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroTrash, heroPlusSmall, heroPencilSquare } from '@ng-icons/heroicons/outline';
import { hugeLoading03 } from '@ng-icons/huge-icons';
import { ActionButtonComponent } from '../../../../shared/ui/components/action-button/action-button.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { ConfirmationModuleComponent } from '../../../../shared/ui/components/confirmation-module/confirmation-module.component';
import { SharedDataService } from '../../../../shared/services/shared/shared-data.service';
import { CategoryAddModalComponent } from '../category-add-modal/category-add-modal.component';
import { CategoryEditModalComponent } from '../category-edit-modal/category-edit-modal.component';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, FormsModule, DatepickerComponent, ActionButtonComponent, NgIcon],
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css'],
  viewProviders : [provideIcons({ heroTrash, heroPlusSmall, heroPencilSquare, hugeLoading03 })]
})
export class ExpenseFormComponent {
  @Input() categories: any[] = []; 
  @Output() filter = new EventEmitter<string>();
  @Output() clearFilterEvent = new EventEmitter<void>();

  public loading: boolean = true;
  public expenses: any[] = [];
  public selectedCategory: any = null;
  public newCategoryName: string = '';
  public amount: number | null = null;
  public description: string = '';
  public selectedDate: Date | null = null;
  public selectedCategorieObj: any | null = null;
  
  private initialDate: Date | null = null;
  private date = new FormControl();

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

  public onCategorySelect() {
    this.selectedCategorieObj = this.categories.find(
      (categorie) => categorie.id === Number(this.selectedCategory)  
    ) || null;
  }

  public onDatePicked(date: Date) {
    this.selectedDate = date;
  }

  public openAddCategoryModal() {
    const dialogRef = this.dialog.open(CategoryAddModalComponent, {
      width: '400px',
      data: {
        selectedCategory: null,
      },
    });

    dialogRef.afterClosed().subscribe((updatedCategory) => {
      if (updatedCategory) {
        this.loadData();
      }
    });
  }
  
  public openUpdateCategoryModal(selectedCategory: any) {
    if (!selectedCategory) {
      this.toastr.error('No category selected.', 'Error');
      return;
    }
  
    const dialogRef = this.dialog.open(CategoryEditModalComponent, {
      width: '400px',
      data: {
        selectedCategory: { ...this.selectedCategorieObj },
        categories: this.categories,
      },
    });
  
    dialogRef.afterClosed().subscribe((updatedCategory) => {
      if (updatedCategory) {
        this.loadData(); 
      }
    });
  }

  public handleDeleteCategory(id: number) {
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
        this.expenseService.deleteExpenseCategory(id).subscribe(
          () => {
            this.toastr.success(`Expense category "${categoryToDelete?.name}" deleted successfully!`);
            this.loadData();
          },
          (error) => {
            const specificErrorMessage = "Cannot delete this category because it has associated expense. Please delete all related expenses first.";
            
            if (error.status === 400 && error.error?.detail === specificErrorMessage) {
              this.toastr.warning(specificErrorMessage);
            } else {
              this.toastr.error(`Failed to delete "${categoryToDelete?.name}". Please try again.`);
            }
            console.error('Error deleting expense category:', error);
          }
        );
      }
    });
  }

  public onAddExpense() {
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

    this.expenseService.addExpense(payload).subscribe(
      (data: any) => {
        this.toastr.success('Expense added successfully!','Expense added');
        this.selectedCategory = null;
        this.amount = null;
        this.selectedDate = null;
        this.description = '';
        this.loadData();
        this.sharedDataService.notifyExpenseChanged();

        if (this.dialogRef) {
          this.dialogRef.close(true);
        }

      },
      (error) => {
        console.error('Error adding expense:', error);
        this.toastr.error('Failed to add expense. Please try again.','Error adding expense');
      }
    );
  }

  public filterExpensesByCategories() {
    if (this.selectedCategorieObj) {
      this.filter.emit(this.selectedCategorieObj.name);
    }
  }

  public clearFilter() {
    this.clearFilterEvent.emit();
  }

  private setDateValue() {
    if (this.initialDate) {
      this.date.setValue(moment(this.initialDate).toDate()); 
    } else {
      this.date.setValue(moment().toDate());
    }
  }

  private async loadData(): Promise<void> {
    this.loading = true;
    try {
      const { expenses, categories } = await firstValueFrom(
        forkJoin({
          expenses: this.expenseService.getExpense(),
          categories: this.expenseService.getExpenseCategory()
        })
      );

      this.expenses = expenses as any[];
      this.categories = categories as any[];

      if (this.categories.length > 0) {
        this.selectedCategory = this.categories[0].id;
        this.onCategorySelect();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.loading = false;
    }
  }

}
