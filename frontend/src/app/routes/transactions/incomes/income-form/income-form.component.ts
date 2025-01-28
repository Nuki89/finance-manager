import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IncomeService } from '../../../../shared/services/api/income.service';
import { HttpClient } from '@angular/common/http';
import { apiEndpoints } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { timeout } from 'rxjs';
import { SharedDataService } from '../../../../shared/services/shared/shared-data.service';

@Component({
  selector: 'app-income-form',
  standalone: true,
  imports : [CommonModule, FormsModule ],
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

  constructor(
    private incomeService: IncomeService, 
    private http: HttpClient, 
    private toastr: ToastrService,
    private sharedDataService: SharedDataService,
    ) { }


  ngOnInit() {
    this.fetchIncome();
    this.fetchSource();
  }

  
  onAddIncome() {
    if (!this.selectedSource || !this.amount) {
      this.toastr.error('Please fill in all required fields.','Error adding income');
      return;
    }

    const payload = {
      source: this.selectedSource,
      amount: this.amount,
      description: this.description || '',
    };

    console.log('Payload:', payload);

    this.http.post(apiEndpoints.incomeUrl, payload).subscribe(
      (data: any) => {
        console.log('Backend Response:', data);
        this.toastr.success('Income added successfully!','Income added');
        this.selectedSource = null;
        this.amount = null;
        this.description = '';
        this.fetchIncome();
        this.fetchSource();
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

    console.log('Payload:', payload);

    this.http.post(apiEndpoints.incomeSourcesUrl, payload).subscribe(
      (data: any) => {
        console.log('Backend Response:', data);
        this.toastr.success('Income source added successfully!','Income source added');
        this.newSourceName = '';
        this.fetchSource();
      },
      (error) => {
        console.error('Error adding income source:', error);
        this.toastr.error('Failed to add income source. Please try again.','Error adding income source');
      }
    );
  
  }


  fetchIncome() {
    this.http.get(apiEndpoints.incomeUrl).subscribe(
      (data: any) => {
        this.incomes = data;
      },
      (error) => {
        console.error('Error fetching incomes:', error);
      }
    );
  }


  fetchSource() {
    this.http.get(apiEndpoints.incomeSourcesUrl).subscribe(
      (data: any) => {
        this.sources = data;
        if (this.sources.length > 0) {
          this.selectedSource = this.sources[0].id;
        }
      },
      (error) => {
        console.error('Error fetching income sources:', error);
      }
    );
  }


}
