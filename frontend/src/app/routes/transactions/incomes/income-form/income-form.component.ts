import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IncomeService } from '../../../../shared/services/api/income.service';
import { HttpClient } from '@angular/common/http';
import { apiEndpoints } from '../../../../../environments/environment';

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

  ngOnInit() {
    this.incomeService.getIncome().subscribe((data: any) => {
      this.incomes = data
      // console.log("Incomes: ", this.incomes)
    })
  }

  constructor(private incomeService: IncomeService, private http: HttpClient) { }

  onAddIncome() {
    if (!this.selectedSource || !this.amount) {
      alert('Please fill in all required fields.');
      return;
    }

    const payload = {
      source: this.selectedSource,
      amount: this.amount,
      description: this.description || '',
    };

    console.log('Payload:', payload);

    this.http.post(apiEndpoints.apiUrlListIncomes, payload).subscribe(
      (data: any) => {
        console.log('Backend Response:', data);
        alert('Income added successfully!');
        this.selectedSource = null;
        this.amount = null;
        this.description = '';
        window.location.reload();
      },
      (error) => {
        console.error('Error adding income:', error);
        alert('Failed to add income. Please try again.');
      }
    );
  }

  addNewSource() {
    if (!this.newSourceName) {
      alert('Please enter a source name.');
      return;
    }

    const payload = {
      name: this.newSourceName,
    };

    console.log('Payload:', payload);

    this.http.post(apiEndpoints.apiUrlListIncomeSources, payload).subscribe(
      (data: any) => {
        console.log('Backend Response:', data);
        // alert('Income source added successfully!');
        this.newSourceName = '';
        window.location.reload();
      },
      (error) => {
        console.error('Error adding income source:', error);
        alert('Failed to add income source. Please try again.');
      }
    );
  
  }
}
