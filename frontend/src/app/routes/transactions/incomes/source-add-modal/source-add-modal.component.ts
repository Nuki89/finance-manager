import { Component } from '@angular/core';
import { IncomeService } from '../../../../shared/services/api/income.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-source-add-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon],
  templateUrl: './source-add-modal.component.html',
  styleUrl: './source-add-modal.component.css',
  viewProviders : [provideIcons({ heroXMark })]
})
export class SourceAddModalComponent {
  sources: any[] = [];
  newSourceName: string = '';

  constructor(
    private incomeService: IncomeService, 
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<SourceAddModalComponent>, 
    ) { }

  loadData() {
    forkJoin({
      sources: this.incomeService.getIncomeSource()
    }).subscribe(
      ({ sources }) => {
        this.sources = sources as any[];
        
      },
      (error) => {
        console.error('Error fetching data:', error);
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

    this.incomeService.addIncomeSource(payload).subscribe(
      (data: any) => {
        this.toastr.success('Income source added successfully!','Income source added');
        this.dialogRef.close(data); 
        this.newSourceName = '';
        this.loadData();
      },
      (error) => {
        console.error('Error adding income source:', error);
        this.toastr.error('Failed to add income source. Please try again.','Error adding income source');
      }
    );
  }

  closeModal() {
    this.dialogRef.close();
  }

}
