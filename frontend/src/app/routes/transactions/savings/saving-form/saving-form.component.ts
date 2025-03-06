import { CommonModule } from '@angular/common';
import { Component, Inject, Input, Optional, SimpleChanges } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatepickerComponent } from '../../../../shared/ui/components/datepicker/datepicker.component';
import { ActionButtonComponent } from '../../../../shared/ui/components/action-button/action-button.component';
import moment from 'moment';
import { forkJoin } from 'rxjs';
import { SavingService } from '../../../../shared/services/api/saving.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationModuleComponent } from '../../../../shared/ui/components/confirmation-module/confirmation-module.component';
import { SharedDataService } from '../../../../shared/services/shared/shared-data.service';
import { provideIcons } from '@ng-icons/core';
import { heroTrash, heroPlusSmall, heroPencilSquare } from '@ng-icons/heroicons/outline';
import { CategoryAddModalComponent } from '../category-add-modal/category-add-modal.component';

@Component({
  selector: 'app-saving-form',
  standalone: true,
  imports: [CommonModule, FormsModule, DatepickerComponent, ActionButtonComponent],
  templateUrl: './saving-form.component.html',
  styleUrls: ['./saving-form.component.css'],
  viewProviders : [provideIcons({ heroTrash, heroPlusSmall, heroPencilSquare })]
})
export class SavingFormComponent {
  @Input() categories: any[] = [];
  
  public selectedCategory: any = null;
  public amount: number | null = null;
  public description: string = '';
  public selectedDate: Date | null = null;
  public selectedCategorieObj: any | null = null;
  
  private savings: any[] = [];
  private newCategoryName: string = '';
  private initialDate: Date | null = null;
  private date = new FormControl();

  constructor(
    private savingService: SavingService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private sharedDataService: SharedDataService,
    @Optional() private dialogRef: MatDialogRef<SavingFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any 
  ) {}

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
  
    // const dialogRef = this.dialog.open(CategoryEditModalComponent, {
    //   width: '400px',
    //   data: {
    //     selectedCategory: { ...this.selectedCategorieObj },
    //     categories: this.categories,
    //   },
    // });
  
    // dialogRef.afterClosed().subscribe((updatedCategory) => {
    //   if (updatedCategory) {
    //     this.loadData(); 
    //   }
    // });
  }

  public handleDeleteCategory(id: number) {
    const categoryToDelete = this.categories.find(category => category.id === id);

    const dialogRef = this.dialog.open(ConfirmationModuleComponent, {
      width: '400px',
      data: {
        title: 'Delete Saving Category',
        message: `Are you sure you want to delete "${categoryToDelete?.name}"?`,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.savingService.deleteSavingCategory(id).subscribe(
          () => {
            this.toastr.success(`Saving category "${categoryToDelete?.name}" deleted successfully!`);
            this.loadData();
          },
          (error) => {
            const specificErrorMessage = "Cannot delete this category because it has associated saving. Please delete all related savings first.";
            
            if (error.status === 400 && error.error?.detail === specificErrorMessage) {
              this.toastr.warning(specificErrorMessage);
            } else {
              this.toastr.error(`Failed to delete "${categoryToDelete?.name}". Please try again.`);
            }
            console.error('Error deleting saving category:', error);
          }
        );
      }
    });
  }

  public onAddSaving() {
    if (!this.selectedCategory || !this.amount) {
      this.toastr.error('Please fill in all required fields.','Error adding saving');
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

    this.savingService.addSaving(payload).subscribe(
      (data: any) => {
        this.toastr.success('Saving added successfully!','Saving added');
        this.selectedCategory = null;
        this.amount = null;
        this.selectedDate = null;
        this.description = '';
        this.loadData();
        this.sharedDataService.notifySavingChanged();

        if (this.dialogRef) {
          this.dialogRef.close(true);
        }

      },
      (error) => {
        console.error('Error adding saving:', error);
        this.toastr.error('Failed to add saving. Please try again.','Error adding saving');
      }
    );
  }

  private loadData() {
    forkJoin({
      savings: this.savingService.getSaving(),
      categories: this.savingService.getSavingCategory()
    }).subscribe(
      ({ savings, categories }) => {
        this.savings = savings as any[];
        this.categories = categories as any[];

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

  private setDateValue() {
    if (this.initialDate) {
      this.date.setValue(moment(this.initialDate).toDate()); 
    } else {
      this.date.setValue(moment().toDate());
    }
  }

}
