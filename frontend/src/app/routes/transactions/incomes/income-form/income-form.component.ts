import { CommonModule } from '@angular/common';
import { Component, Input, Optional, SimpleChanges, Inject, Output, EventEmitter } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { IncomeService } from '../../../../shared/services/api/income.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, forkJoin } from 'rxjs';
import { SharedDataService } from '../../../../shared/services/shared/shared-data.service';
import { DatepickerComponent } from "../../../../shared/ui/components/datepicker/datepicker.component";
import moment from 'moment';
import { ConfirmationModuleComponent } from '../../../../shared/ui/components/confirmation-module/confirmation-module.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SourceEditModalComponent } from '../source-edit-modal/source-edit-modal.component';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { SourceAddModalComponent } from '../source-add-modal/source-add-modal.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroTrash, heroPlusSmall, heroPencilSquare } from '@ng-icons/heroicons/outline';
import { hugeLoading03, hugeFilter, hugeFilterRemove } from '@ng-icons/huge-icons';
import { ActionButtonComponent } from '../../../../shared/ui/components/action-button/action-button.component';

import { Income } from '../../../../shared/models/income.model';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-income-form',
  standalone: true,
  imports: [CommonModule, FormsModule, DatepickerComponent, ActionButtonComponent, NgIcon],
  templateUrl: './income-form.component.html',
  styleUrls: ['./income-form.component.css'],
  viewProviders : [provideIcons({ heroTrash, heroPlusSmall, heroPencilSquare, hugeLoading03, hugeFilter, hugeFilterRemove })]
})
export class IncomeFormComponent {
  @Input() sources: any[] = []; 
  @Output() filter = new EventEmitter<string>();
  @Output() clearFilterEvent = new EventEmitter<void>();

  // public incomes: any[] = [];
  public loading: boolean = true;
  public incomes: Income[] = [];
  public selectedSource: any = null; 
  public newSourceName: string = '';
  public amount: number | null = null; 
  public description: string = ''; 
  public selectedSourceObj: any | null = null;
  public selectedDate: Date | null = null;
  
  private initialDate: Date | null = null;
  private date = new FormControl();

  constructor(
    private incomeService: IncomeService, 
    private http: HttpClient, 
    private toastr: ToastrService,
    private sharedDataService: SharedDataService,
    private dialog: MatDialog,
    @Optional() private dialogRef: MatDialogRef<IncomeFormComponent>,
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

  public onDatePicked(date: Date) {
    this.selectedDate = date;
  }

  public openAddSourceModal() {
    const dialogRef = this.dialog.open(SourceAddModalComponent, {
      width: '400px',
      data: {
        selectedSource: null,
      },
    });

    dialogRef.afterClosed().subscribe((updatedSource) => {
      if (updatedSource) {
        this.loadData();
      }
    });
  }

  public openUpdateSourceModal(selectedSource: any) {
    if (!selectedSource) {
      this.toastr.error('No source selected.', 'Error');
      return;
    }
  
    const dialogRef = this.dialog.open(SourceEditModalComponent, {
      width: '400px',
      data: {
        selectedSource: { ...this.selectedSourceObj },
        sources: this.sources,
      },
    });
  
    dialogRef.afterClosed().subscribe((updatedSource) => {
      if (updatedSource) {
        this.loadData(); 
      }
    });
  }

  public onSourceSelect() {
    this.selectedSourceObj = this.sources.find(
      (source) => source.id === Number(this.selectedSource)  
    ) || null;
  }

  public handleDeleteSource(id: number) {
    const sourceToDelete = this.sources.find(source => source.id === id);

    const dialogRef = this.dialog.open(ConfirmationModuleComponent, {
      width: '400px',
      data: {
        title: 'Delete Income Source',
        message: `Are you sure you want to delete "${sourceToDelete?.name}"?`,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.incomeService.deleteIncomeSource(id).subscribe(
          () => {
            this.toastr.success(`Income source "${sourceToDelete?.name}" deleted successfully!`);
            this.loadData();
          },
          (error) => {
            const specificErrorMessage = "Cannot delete this source because it has associated incomes. Please delete all related incomes first.";
            
            if (error.status === 400 && error.error?.detail === specificErrorMessage) {
              this.toastr.warning(specificErrorMessage);
            } else {
              this.toastr.error(`Failed to delete "${sourceToDelete?.name}". Please try again.`);
            }
            console.error('Error deleting income source:', error);
          }
        );
      }
    });
  }

  public onAddIncome() {
    if (!this.selectedSource || !this.amount) {
      this.toastr.error('Please fill in all required fields.','Error adding income');
      return;
    }

    const formattedDate = this.selectedDate
    ? moment(this.selectedDate).format('YYYY-MM-DD')  
    : moment().format('YYYY-MM-DD');  

    const payload = {
      source: this.selectedSource,
      amount: this.amount,
      date: formattedDate,
      description: this.description || '',
    };

    this.incomeService.addIncome(payload).subscribe(
      (data: any) => {
        this.toastr.success('Income added successfully!','Income added');
        this.selectedSource = null;
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

  public filterIncomesBySource() {
    if (this.selectedSourceObj) {
      this.filter.emit(this.selectedSourceObj.name);
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
      const { incomes, sources } = await firstValueFrom(
        forkJoin({
          incomes: this.incomeService.getIncome(),
          sources: this.incomeService.getIncomeSource()
        })
      );

      this.incomes = incomes as any[];
      this.sources = sources as any[];

      if (this.sources.length > 0) {
        this.selectedSource = this.sources[0].id;
        this.onSourceSelect();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.loading = false;
    }
  }

}
