import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatepickerComponent } from '../../../../shared/ui/components/datepicker/datepicker.component';
import { IncomeService } from '../../../../shared/services/api/income.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../../../../shared/services/shared/shared-data.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { ActionButtonComponent } from '../../../../shared/ui/components/action-button/action-button.component';

@Component({
  selector: 'app-income-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DatepickerComponent, NgIcon, ActionButtonComponent],
  templateUrl: './income-edit-modal.component.html',
  styleUrl: './income-edit-modal.component.css',
  viewProviders : [provideIcons({ heroXMark })]
})
export class IncomeEditModalComponent {
  selectedSource: any = null;
  newSourceName: string = '';
  amount: number | null = null;
  description: string = '';
  incomes: any[] = [];
  selectedSourceObj: any | null = null;
  selectedDate: Date | null = null;
  sources: any[] = [];

  constructor(
    private incomeService: IncomeService, 
    private http: HttpClient, 
    private toastr: ToastrService,
    private sharedDataService: SharedDataService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public rawData: any
    ) { }

    
  ngOnInit() {
    this.loadData();
    this.initializeForm();
  }


  loadData() {
    this.incomeService.getIncomeSource().subscribe({
      next: (sources: any) => {
        this.sources = sources;
  
        if (this.rawData) {
          this.selectedSource = this.rawData.source_data ? this.rawData.source_data.id : this.rawData.source;
        }
      },
      error: (error) => {
        console.error('Error fetching sources:', error);
      }
    });
  }


  initializeForm() {
    if (this.rawData) {
      this.selectedSource = this.rawData.source_data ? this.rawData.source_data.id : this.rawData.source; 
      this.amount = this.rawData.amount;
      this.description = this.rawData.description;
      this.selectedDate = this.rawData.date ? new Date(this.rawData.date) : new Date();
    }
  }


  onSaveIncome() {
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
  
      // console.log('Payload:', payload);
  
      this.incomeService.updateIncome(this.rawData.id, payload).subscribe(
        (data: any) => {
          // console.log('Backend Response:', data);
          this.toastr.success('Income updated successfully!','Income updated');
          this.selectedSource = null;
          this.amount = null;
          this.selectedDate = null;
          this.description = '';
          this.loadData();
          this.sharedDataService.notifyIncomeChanged();
          this.closeModal();
        },
        (error) => {
          console.error('Error updating income:', error);
          this.toastr.error('Failed to update income. Please try again.','Error updating income');
        }
      );
    }


  onDatePicked(date: Date) {
    this.selectedDate = date;
    // console.log("Selected Date in IncomeFormComponent:", this.selectedDate);
  }


  onSourceSelect() {
    this.selectedSourceObj = this.sources.find(
      (source) => source.id === Number(this.selectedSource)  
    ) || null;
  }


  closeModal() {
    this.dialog.closeAll();
  }


}
