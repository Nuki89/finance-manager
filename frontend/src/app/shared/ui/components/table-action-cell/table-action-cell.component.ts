import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA, ViewEncapsulation } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ActionButtonComponent } from '../action-button/action-button.component';

@Component({
  selector: 'app-table-action-cell',
  standalone: true,
  imports: [CommonModule, ActionButtonComponent],
  template: `
  <div class="flex justify-center space-x-2">
    <app-action-button 
      *ngFor="let action of actions"
      [icon]="action.icon"
      [buttonClass]="action.class"
      [tooltip]="action.tooltip"
      size="icon"
      (actionClick)="action.handler()"
    >
    </app-action-button>
  </div>
  `,
  encapsulation: ViewEncapsulation.None,
  schemas: [NO_ERRORS_SCHEMA]
})
export class TableActionCellComponent implements ICellRendererAngularComp {
  actions: any[] = [];

  agInit(params: ICellRendererParams & { actions?: any[] }): void {
    this.actions = params.actions || [];
  }

  refresh(params: ICellRendererParams & { actions?: any[] }): boolean {
    this.actions = params.actions || [];
    return true;
  }
}
