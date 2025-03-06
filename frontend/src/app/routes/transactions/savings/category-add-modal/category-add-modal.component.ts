import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { ActionButtonComponent } from '../../../../shared/ui/components/action-button/action-button.component';
import { SavingService } from '../../../../shared/services/api/saving.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
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
  public categories: any[] = [];
  public newCategoryName: string = '';
  public goal: number | null = null;

  constructor(
    private savingService: SavingService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CategoryAddModalComponent>,
  ) { }

  private loadData() {
    forkJoin({
      categories: this.savingService.getSavingCategory()
    }).subscribe(
      ({ categories }) => {
        this.categories = categories as any[];
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    )
  }

  public addNewCategory() {
    if (!this.newCategoryName) {
      this.toastr.error('Please enter a category name.','Error adding saving category');
      return;
    }

    const payload = {
      name: this.newCategoryName,
      goal_amount: this.goal
    };

    this.savingService.addSavingCategory(payload).subscribe(
      (data: any) => {
        this.toastr.success('Saving category added successfully!','Saving category added');
        this.dialogRef.close(data); 
        this.newCategoryName = '';
        this.goal = null;
        this.loadData();
      },
      (error) => {
        console.error('Error adding saving category:', error);
      }
    )
  }

  closeModal() {
    this.dialogRef.close();
  }

}
