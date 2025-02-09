import { CommonModule } from '@angular/common';
import { Component, Input, NO_ERRORS_SCHEMA, ViewEncapsulation } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { heroTrash, heroPencilSquare } from '@ng-icons/heroicons/outline';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-table-action-cell',
  standalone: true,
  imports: [CommonModule, NgIcon],
  template: `
    <button class="bg-blue-500 text-white px-3 rounded ml-2" (click)="onEdit()">
      Edit
      <!-- <ng-icon [icon]="heroPencilSquare"></ng-icon> -->
    </button>
    <button class="bg-red-500 text-white px-3 rounded ml-2" (click)="onDelete()">
      <!-- <ng-icon [icon]="heroTrash"></ng-icon> -->
       Delete
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  schemas: [NO_ERRORS_SCHEMA]
})
export class TableActionCellComponent implements ICellRendererAngularComp {
  @Input() onEdit!: () => void;
  @Input() onDelete!: () => void;

  heroTrash = heroTrash;
  heroPencilSquare = heroPencilSquare;

  private params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  
    if (params.context && params.context.componentParent) {
      this.onEdit = () => params.context.componentParent.handleEdit(params.data.id, params.data);
      this.onDelete = () => params.context.componentParent.handleDelete(params.data.id);
    } else {
      console.error("context.componentParent is undefined in agInit");
    }
  }  

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }
}
