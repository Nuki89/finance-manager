import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IncomeService } from '../../../../shared/services/api/income.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { SharedDataService } from '../../../../shared/services/shared/shared-data.service';
import { DatepickerComponent } from "../../../../shared/ui/components/datepicker/datepicker.component";
import moment from 'moment';
import { ConfirmationModuleComponent } from '../../../../shared/ui/components/confirmation-module/confirmation-module.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-income-form',
  standalone: true,
  imports: [CommonModule, FormsModule, DatepickerComponent],
  templateUrl: './income-form.component.html',
  styleUrls: ['./income-form.component.css'],
})
export class IncomeFormComponent {
  @Input() sources: any[] = []; 
  selectedSource: any = null; 
  newSourceName: string = '';
  amount: number | null = null; 
  description: string = ''; 
  incomes: any[] = [];
  selectedSourceObj: any | null = null;
  selectedDate: Date | null = null;

  constructor(
    private incomeService: IncomeService, 
    private http: HttpClient, 
    private toastr: ToastrService,
    private sharedDataService: SharedDataService,
    private dialog: MatDialog
    ) { }


  ngOnInit() {
    this.loadData();
  }


  onDatePicked(date: Date) {
    this.selectedDate = date;
    // console.log("Selected Date in IncomeFormComponent:", this.selectedDate);
  }


  onAddIncome() {
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

    this.incomeService.addIncome(payload).subscribe(
      (data: any) => {
        // console.log('Backend Response:', data);
        this.toastr.success('Income added successfully!','Income added');
        this.selectedSource = null;
        this.amount = null;
        this.selectedDate = null;
        this.description = '';
        this.loadData();
        this.sharedDataService.notifyIncomeChanged();
      },
      (error) => {
        console.error('Error adding income:', error);
        this.toastr.error('Failed to add income. Please try again.','Error adding income');
      }
    );
  }


  addNewSource() {
    if (!this.newSourceName) {
      this.toastr.error('Please enter a source name.','Error adding income source');
      return;
    }

    const payload = {
      name: this.newSourceName,
    };

    // console.log('Payload:', payload);

    this.incomeService.addIncomeSource(payload).subscribe(
      (data: any) => {
        // console.log('Backend Response:', data);
        this.toastr.success('Income source added successfully!','Income source added');
        this.newSourceName = '';
        this.loadData();
      },
      (error) => {
        console.error('Error adding income source:', error);
        this.toastr.error('Failed to add income source. Please try again.','Error adding income source');
      }
    );
  
  }


  updateIncomeSource(id: number, name: string) {
    if (!name) {
      this.toastr.error('Please enter a source name.','Error updating income source');
      return;
    }

    const payload = {
      name: name,
    };

    // console.log('Payload:', payload);

    this.incomeService.updateIncomeSource(id, payload).subscribe(
      (data: any) => {
        // console.log('Backend Response:', data);
        this.toastr.success('Income source updated successfully!','Income source updated');
        this.loadData();
      },
      (error) => {
        console.error('Error updating income source:', error);
        this.toastr.error('Failed to update income source. Please try again.','Error updating income source');
      }
    );
  }


  loadData() {
    forkJoin({
      incomes: this.incomeService.getIncome(),
      sources: this.incomeService.getIncomeSource()
    }).subscribe(
      ({ incomes, sources }) => {
        this.incomes = incomes as any[];
        this.sources = sources as any[];
        if (this.sources.length > 0) {
          this.selectedSource = this.sources[0].id;
          this.onSourceSelect();
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }


  onSourceSelect() {
    this.selectedSourceObj = this.sources.find(
      (source) => source.id === Number(this.selectedSource)  
    ) || null;
  }


  handleDeleteSource(id: number) {
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


}
