import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IncomeService } from '../../../shared/services/api/income.service';
import { IncomeFormComponent } from './income-form/income-form.component';
import { SharedTableComponent } from '../../../shared/ui/components/shared-table/shared-table.component';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { IncomeEditModalComponent } from './income-edit-modal/income-edit-modal.component';
import { ConfirmationModuleComponent } from '../../../shared/ui/components/confirmation-module/confirmation-module.component';
import { ToastrService } from 'ngx-toastr';
import { provideIcons } from '@ng-icons/core';
import { ActionButtonComponent } from '../../../shared/ui/components/action-button/action-button.component';
import { FormControl, FormsModule } from '@angular/forms';
import { DatepickerComponent } from '../../../shared/ui/components/datepicker/datepicker.component';
import moment from 'moment';
import { hugeFilter, hugeFilterRemove } from '@ng-icons/huge-icons';
import { Income } from '../../../shared/models/income.model';

@Component({
  selector: 'app-incomes',
  standalone: true,
  imports: [CommonModule, RouterModule, IncomeFormComponent, SharedTableComponent, ActionButtonComponent, FormsModule, DatepickerComponent],
  templateUrl: './incomes.component.html',
  styleUrls: ['./incomes.component.css'],
  viewProviders : [ provideIcons({ hugeFilter, hugeFilterRemove})]
})
export class IncomesComponent {
  public allIncomes: Income[] = [];
  public searchTerm: string = '';
  public selectedDate: Date | null = null;
  
  private originalIncomes: Income[] = []; 
  private initialDate: Date | null = null;
  private date = new FormControl();
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

  public filterIncomesBySource(sourceName: string) {
    this.incomeService.getIncomeBySource(sourceName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.allIncomes = data;
        },
        error: (err) => {
          this.toastr.error('Failed to filter incomes. Please try again.');
          console.error('Failed to filter incomes', err);
        }
      }
    );
  }

  public onDatePicked(date: Date) {
    this.selectedDate = date;
  
    if (this.selectedDate) {
      const selectedDateFormatted = moment(this.selectedDate).format('YYYY-MM-DD');
  
      this.allIncomes = this.originalIncomes.filter((income) => {
        const incomeDate = moment(income.date).format('YYYY-MM-DD');
        return incomeDate === selectedDateFormatted;
      });
    } else {
      this.allIncomes = [...this.originalIncomes];
    }
  }

  public filterIncomes() {
    if (!this.searchTerm) {
      this.allIncomes = [...this.originalIncomes];
      return;
    }

    const term = this.searchTerm.toLowerCase();

    this.allIncomes = this.originalIncomes.filter((income) => {
      return (
        income.source_data?.name?.toLowerCase().includes(term) ||
        income.amount?.toString().toLowerCase().includes(term) ||
        income.date?.toLowerCase().includes(term) ||
        income.description?.toLowerCase().includes(term)
      );
    });
  }

  public clearFilter(): void {
    if (this.searchTerm) {
      this.searchTerm = '';
      this.allIncomes = [...this.originalIncomes];
    }
    this.handleDataChange();
  }
  
  public handleDataChange(): void {
    this.fetchIncomes();  
  }

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
        this.originalIncomes = data;
        this.allIncomes = [...data];   
      },
      error: (err) => {
        this.toastr.error('Failed to load incomes. Please try again.');
        console.error('Failed to fetch incomes', err)
      }
    });
  }

}
