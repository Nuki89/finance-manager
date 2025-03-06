import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { SavingService } from '../../../../shared/services/api/saving.service';
import { SharedDataService } from '../../../../shared/services/shared/shared-data.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ActionButtonComponent } from '../../../../shared/ui/components/action-button/action-button.component';
import { FormsModule } from '@angular/forms';
import { ConfirmationModuleComponent } from '../../../../shared/ui/components/confirmation-module/confirmation-module.component';

@Component({
  selector: 'app-category-edit-modal',
  standalone: true,
  imports: [CommonModule, NgIcon, FormsModule, ActionButtonComponent],
  templateUrl: './category-edit-modal.component.html',
  styleUrls: ['./category-edit-modal.component.css'],
  viewProviders : [provideIcons({ heroXMark })],
})
export class CategoryEditModalComponent {
  @Input() categories: any[] = [];

  public selectedCategory: any = null;
  public selectedCategoryObj: any | null = null;
  public selectedDate: Date | null = null;
  
  private savings: any[] = [];

  constructor(
    private savingService: SavingService,
    private sharedDataService: SharedDataService,
    private dialogRef: MatDialogRef<CategoryEditModalComponent>,
    private dialog: MatDialog,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedCategoryObj = { ...data.selectedCategory };
    this.categories = data.categories || [];
  }

  public updateSavingCategory(id: number, name: string) {
    if (!name) {
      this.toastr.error('Please enter a category name.','Error updating saving category');
      return;
    }
    const payload = {
      name: name,
    };
    this.savingService.updateSavingCategory(id, payload).subscribe(
      (data: any) => {
        this.toastr.success('Category updated successfully');
        this.dialogRef.close({ id, name });
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
      const categoryToDelete = this.categories.find((category) => category.id === id);
  
      const dialogRef = this.dialog.open(ConfirmationModuleComponent, {
        width: '400px',
        data: {
          title: 'Delete Saving Category',
          message: `Are you sure you want to delete the category "${categoryToDelete.name}"?`,
        }
      })
  
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.savingService.deleteSavingCategory(id).subscribe(
            () => {
              this.toastr.success(`Category "${categoryToDelete?.name}" deleted successfully!`);
              this.dialogRef.close({ id });
              this.loadData();
            },
            (error) => {
              const specificErrorMessage = "Cannot delete this category because it has associated saving. Please delete all related saving first.";
              
              if (error.status === 400 && error.error?.detail === specificErrorMessage) {
                this.toastr.warning(specificErrorMessage);
              } else {
                this.toastr.error(`Failed to delete "${categoryToDelete?.name}". Please try again.`);
              }
              console.error('Error deleting saving categories:', error);
            }
          );
        }
      })
    }

  public closeModal() {
    this.dialogRef.close();
  } 

  private loadData() {
    forkJoin({
      categories: this.savingService.getSavingCategory(),
      savings: this.savingService.getSaving()
    }).subscribe(
      ({ categories, savings }) => {
        this.categories = categories as any[];
        this.savings = savings as any[];
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

  private onCategorySelect() {
    this.selectedCategoryObj = this.categories.find(
      (category) => category.id === Number(this.selectedCategory)  
    ) || null;
  }
  
}
