import { Component, Inject, Input } from '@angular/core';
import { IncomeService } from '../../../../shared/services/api/income.service';
import { forkJoin } from 'rxjs';
import { ConfirmationModuleComponent } from '../../../../shared/ui/components/confirmation-module/confirmation-module.component';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../../../../shared/services/shared/shared-data.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { ActionButtonComponent } from '../../../../shared/ui/components/action-button/action-button.component';

@Component({
  selector: 'app-source-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon, ActionButtonComponent],
  templateUrl: './source-edit-modal.component.html',
  styleUrl: './source-edit-modal.component.css',
  viewProviders : [provideIcons({ heroXMark })]
})
export class SourceEditModalComponent {
  @Input() sources: any[] = []; 
  selectedSource: any = null; 
  incomes: any[] = [];
  selectedSourceObj: any | null = null;
  selectedDate: Date | null = null;

  constructor(
    private incomeService: IncomeService, 
    private http: HttpClient, 
    private toastr: ToastrService,
    private sharedDataService: SharedDataService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<SourceEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.selectedSourceObj = { ...data.selectedSource };
    this.sources = data.sources || [];
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

  updateIncomeSource(id: number, name: string) {
    if (!name) {
      this.toastr.error('Please enter a source name.','Error updating income source');
      return;
    }

    const payload = {
      name: name,
    };

    this.incomeService.updateIncomeSource(id, payload).subscribe(
      (data: any) => {
        this.toastr.success('Income source updated successfully!','Income source updated');
        this.dialogRef.close({ id, name });
        this.loadData();
        this.sharedDataService.notifyIncomeChanged();
      },
      (error) => {
        console.error('Error updating income source:', error);
        this.toastr.error('Failed to update income source. Please try again.','Error updating income source');
      }
    );
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
            this.dialogRef.close({ id });
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

  closeModal() {
    this.dialogRef.close();
  }

}
