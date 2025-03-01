import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IncomeService } from '../../../shared/services/api/income.service';
import { IncomeTableComponent } from "./income-table/income-table.component";
import { IncomeFormComponent } from './income-form/income-form.component';
import { SharedTableComponent } from '../../../shared/ui/components/shared-table/shared-table.component';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { IncomeEditModalComponent } from './income-edit-modal/income-edit-modal.component';
import { ConfirmationModuleComponent } from '../../../shared/ui/components/confirmation-module/confirmation-module.component';
import { ToastrService } from 'ngx-toastr';

import { Income } from '../../../shared/models/income.model';

@Component({
  selector: 'app-incomes',
  standalone: true,
  imports: [CommonModule, RouterModule, IncomeTableComponent, IncomeFormComponent, SharedTableComponent],
  templateUrl: './incomes.component.html',
  styleUrls: ['./incomes.component.css']
})
export class IncomesComponent {
  public incomes: Income[] = [];

  // private income_sources: any = []
  private destroy$ = new Subject<void>();

  constructor(
    private incomeService: IncomeService, 
    private dialog: MatDialog,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.fetchIncomes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public handleDataChange(): void {
    this.fetchIncomes();  
  }
  
  // public getIncomeSources() {
  //   return this.income_sources || [];
  // }

  public handleEdit(incomeData: any): void {
    console.log('Editing Income:', incomeData);
    const dialogRef = this.dialog.open(IncomeEditModalComponent, {
      width: '600px',
      data: incomeData  
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toastr.success('Income updated successfully!');
        this.fetchIncomes(); 
      }
    });
  }

  public handleDelete(incomeId: number): void {
    console.log('Deleting Income ID:', incomeId);  
    const dialogRef = this.dialog.open(ConfirmationModuleComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this income?'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.incomeService.deleteIncome(incomeId).subscribe(() => {
          this.toastr.success('Income deleted successfully!');
          this.fetchIncomes();  
        }, error => {
          this.toastr.error('Failed to delete income. Please try again.');
          console.error('Error deleting income:', error);
        });
      }
    });
  }

  private fetchIncomes(): void {
    this.incomeService.getIncome()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        this.incomes = data;        
      },
      error: (err) => {
        this.toastr.error('Failed to load incomes. Please try again.');
        console.error('Failed to fetch incomes', err)
      }
    });
  }
  
}
