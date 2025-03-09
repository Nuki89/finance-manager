import { CommonModule } from '@angular/common';
import { Component, Inject, Input, Optional } from '@angular/core';
import { Saving } from '../../../shared/models/saving.model';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { SavingService } from '../../../shared/services/api/saving.service';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../../../shared/services/shared/shared-data.service';
import { CategoryAddModalComponent } from './category-add-modal/category-add-modal.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActionButtonComponent } from '../../../shared/ui/components/action-button/action-button.component';
import { SavingDetailsModalComponent } from './saving-details-modal/saving-details-modal.component';

@Component({
  selector: 'app-savings',
  standalone: true,
  imports: [CommonModule, ActionButtonComponent],
  templateUrl: './savings.component.html',
  styleUrls: ['./savings.component.css']
})
export class SavingsComponent {
  @Input() categories: any[] = [];

  public savings: Saving[] = [];
  public savingsCategorySummary: any[] = [];
  public selectedCategory: any = null;
  public selectedCategorieObj: any | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private savingService: SavingService,
    private sharedDataService: SharedDataService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    @Optional() private dialogRef: MatDialogRef<SavingsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any 
  ) {
  }

  ngOnInit(): void {
    this.loadData();
    this.subscribeToSavingChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  public onCategorySelect() {
    this.selectedCategorieObj = this.categories.find(
      (categorie) => categorie.id === Number(this.selectedCategory)  
    ) || null;
  }

  public openCategoryDetailModal(selectedCategory: any) {
    if (!selectedCategory) {
      this.toastr.error('No category selected.', 'Error');
      return;
    }
  
    const selectedCategoryObj = this.categories.find(
      (cat) => cat.name === selectedCategory.category_name
    );
  
    if (!selectedCategoryObj) {
      console.warn("Category ID not found for:", selectedCategory.category_name);
      return;
    }

    const dialogRef = this.dialog.open(SavingDetailsModalComponent, {
      width: '400px',
      data: {
        selectedCategory: selectedCategoryObj,
        categories: this.categories, 
      },
    });
  
    dialogRef.afterClosed().subscribe((updatedCategory) => {
      if (updatedCategory) {
        this.loadData();
        this.sharedDataService.notifySavingChanged();
      }
    });
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

  private fetchSavings(): void {
    this.savingService.getSaving()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        this.savings = data;      
      },
      error: (error) => {
        this.toastr.error('Failed to load savings. Please try again.');
        console.error('Error fetching savings:', error);
      }
    })
  }

  private fetchSummary(): void {
    this.savingService.getSummaryByCategory()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        this.savingsCategorySummary = data as any[];
      },
      error: (error) => {
        this.toastr.error('Failed to load savings. Please try again.');
        console.error('Error fetching savings:', error);
      }
    })
  }

  private subscribeToSavingChanges(): void {
    this.sharedDataService.savingChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadData();
        this.fetchSummary();
        this.fetchSavings();
    });
  }

}
