import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { heroXMark, heroCheck, heroTrash, heroChevronLeft, heroChevronDown } from '@ng-icons/heroicons/outline';
import { ActionButtonComponent } from '../../../../shared/ui/components/action-button/action-button.component';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../../../../shared/services/shared/shared-data.service';
import { SavingService } from '../../../../shared/services/api/saving.service';
import { DatepickerComponent } from '../../../../shared/ui/components/datepicker/datepicker.component';
import { ConfirmationModuleComponent } from '../../../../shared/ui/components/confirmation-module/confirmation-module.component';
import { forkJoin } from 'rxjs';
import moment from 'moment';
import { SharedTableComponent } from '../../../../shared/ui/components/shared-table/shared-table.component';

@Component({
  selector: 'app-saving-details-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon, ActionButtonComponent, DatepickerComponent, SharedTableComponent],
  templateUrl: './saving-details-modal.component.html',
  styleUrls: ['./saving-details-modal.component.css'],
  viewProviders : [provideIcons({ heroXMark, heroCheck, heroTrash, heroChevronLeft, heroChevronDown })],
})
export class SavingDetailsModalComponent {
  @Input() categories: any[] = [];

  public selectedCategoryObj: any;
  public amount: number | null = null;
  public description: string = '';
  public selectedDate: Date | null = null;
  public filteredSavings: any[] = [];
  public showEditCategory: boolean = false;
  
  private savings: any[] = [];

  constructor(
    private savingService: SavingService,
    private toastr: ToastrService,
    private sharedDataService: SharedDataService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<SavingDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.categories = data.categories || [];
    this.selectedCategoryObj = { ...data.selectedCategory };

    if (!this.selectedCategoryObj.id) {
      const matchedCategory = this.categories.find(
        (cat) => cat.name === this.selectedCategoryObj.category_name
      );

      if (matchedCategory) {
        this.selectedCategoryObj.id = matchedCategory.id;
      } else {
        console.warn("No matching category found for:", this.selectedCategoryObj.category_name);
      }
    }

  }

  ngOnInit() {
    this.selectedDate = new Date();
    this.loadData();
  }

  public onDatePicked(date: Date) {
    this.selectedDate = date;
  }

  public closeModal() {
    this.dialogRef.close();
  }

  public updateSavingCategory(id: number, name: string, goal_amount: number) {
    if (!name) {
      this.toastr.error('Please enter a category name.','Error updating saving category');
      return;
    }
    const payload = {
      name: name,
      goal_amount: goal_amount
    };
    this.savingService.updateSavingCategory(id, payload).subscribe(
      (data: any) => {
        this.toastr.success('Category updated successfully');
        this.dialogRef.close({ id, name, goal_amount });
        this.loadData();
        this.sharedDataService.notifySavingChanged();
      },
      (error) => {
        console.error('Error updating category:', error);
        this.toastr.error('Failed to update saving category. Please try again.', 'Error updating category');
      }
    );
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
            this.dialogRef.close({ id });
            this.loadData();
            this.sharedDataService.notifySavingChanged();
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
    if (!this.selectedCategoryObj.id || !this.amount) {
      this.toastr.error('Please fill in all required fields.','Error adding saving');
      return;
    }

    const formattedDate = this.selectedDate
    ? moment(this.selectedDate).format('YYYY-MM-DD')  
    : moment().format('YYYY-MM-DD');  

    const payload = {
      category: this.selectedCategoryObj.id,
      amount: this.amount,
      date: formattedDate,
      description: this.description || '',
    };

    this.savingService.addSaving(payload).subscribe(
      (data: any) => {
        this.toastr.success('Saving added successfully!','Saving added');

        this.resetForm();

        this.filteredSavings.push({
          category: this.selectedCategoryObj.id,
          amount: this.amount,
          date: formattedDate,
          description: this.description || '',
        });

        this.sharedDataService.notifySavingChanged();

        this.loadData();

        // if (this.dialogRef) {
        //   this.dialogRef.close(true);
        // }

      },
      (error) => {
        console.error('Error adding saving:', error);
        this.toastr.error('Failed to add saving. Please try again.','Error adding saving');
      }
    );
  }  

  public handleDataChange(): void {
    this.loadData();  
  }

  public handleDelete(savingId: number): void {
    const dialogRef = this.dialog.open(ConfirmationModuleComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this saving?'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.savingService.deleteSaving(savingId).subscribe(() => {
          this.toastr.success('Saving deleted successfully!');
          this.loadData();  
          this.sharedDataService.notifySavingChanged();

          // if (this.dialogRef) {
          //   this.dialogRef.close(true);
          // }

        }, error => {
          this.toastr.error('Failed to delete saving. Please try again.');
          console.error('Error deleting saving:', error);
        });
      }
    });
  }

  public toggleEditCategory() {
    this.showEditCategory = !this.showEditCategory;
  }

  public handleDeleteAllSavings(selectedCategoryObjId: number) {
    const categoryToDelete = this.categories.find(category => category.id === selectedCategoryObjId);

    const dialogRef = this.dialog.open(ConfirmationModuleComponent, {
      width: '400px',
      data: {
        title: 'Delete All Savings',
        message: `Are you sure you want to delete all savings for "${categoryToDelete?.name}"?`,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.savingService.deleteSavingsByCategory(categoryToDelete?.name).subscribe(
          () => {
            this.toastr.success(`All savings for "${categoryToDelete?.name}" deleted successfully!`);
            this.dialogRef.close({ id: selectedCategoryObjId });
            this.loadData();
            this.sharedDataService.notifySavingChanged();
          },
          (error) => {
            this.toastr.error(`Failed to delete all savings for "${categoryToDelete?.name}". Please try again.`);
            console.error('Error deleting savings:', error);
          }
        );
      }
    });
  }

  private resetForm() {
    this.amount = null;
    this.selectedDate = null;
    this.description = '';
  }

  private loadData() {
    forkJoin({
      savings: this.savingService.getSaving(),
      categories: this.savingService.getSavingCategory()
    }).subscribe(
      ({ savings, categories }) => {
        this.savings = savings as any[];
        this.categories = categories as any[];

        this.filteredSavings = this.savings.filter(
          (saving) => saving.category === this.selectedCategoryObj.id
        );
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

}
