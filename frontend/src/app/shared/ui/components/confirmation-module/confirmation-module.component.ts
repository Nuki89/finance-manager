import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActionButtonComponent } from '../action-button/action-button.component';

@Component({
  selector: 'app-confirmation-module',
  standalone: true,
  imports: [ActionButtonComponent],
  templateUrl: './confirmation-module.component.html',
  styleUrls: ['./confirmation-module.component.css']
})
export class ConfirmationModuleComponent {
  
  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<ConfirmationModuleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); 
  }

  onCancel(): void {
    this.dialogRef.close(false); 
  }
}
