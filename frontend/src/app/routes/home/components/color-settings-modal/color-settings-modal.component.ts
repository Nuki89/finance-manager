import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActionButtonComponent } from '../../../../shared/ui/components/action-button/action-button.component';

@Component({
  selector: 'app-color-settings-modal',
  standalone: true,
  imports: [CommonModule, ActionButtonComponent],
  templateUrl: './color-settings-modal.component.html',
  styleUrls: ['./color-settings-modal.component.css']
})
export class ColorSettingsModalComponent {
  public selectedType: 'income' | 'expense'; 
  public incomeSources: string[];
  public expenseSources: string[];
  public incomeColorMap: { [key: string]: string };
  public expenseColorMap: { [key: string]: string };

  constructor(
    public dialogRef: MatDialogRef<ColorSettingsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedType = data.selectedType;
    this.incomeSources = data.incomeSources;
    this.expenseSources = data.expenseSources;
    this.incomeColorMap = { ...data.incomeColorMap };
    this.expenseColorMap = { ...data.expenseColorMap };
  }

  public onColorChange(category: string, event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      if (this.selectedType === 'income') {
        this.incomeColorMap[category] = input.value;
        this.saveIncomeColors(); 
      } else {
        this.expenseColorMap[category] = input.value;
        this.saveExpenseColors();
      }
    }
  }  

  public saveChanges() {
    this.dialogRef.close({
      incomeColorMap: this.incomeColorMap,
      expenseColorMap: this.expenseColorMap
    });
  }

  public closeModal() {
    this.dialogRef.close();
  }

  private saveIncomeColors() {
    localStorage.setItem('incomeCategoryColors', JSON.stringify(this.incomeColorMap));
  }
  
  private saveExpenseColors() {
    localStorage.setItem('expenseCategoryColors', JSON.stringify(this.expenseColorMap));
  }

}
