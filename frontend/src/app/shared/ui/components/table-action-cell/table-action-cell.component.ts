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
  <div class="flex justify-center space-x-2">

    <button class="flex items-center justify-center w-10 h-10 border border-blue-500 text-blue-500 rounded transition duration-200 hover:bg-blue-500 hover:text-white" (click)="onEdit()">
      <ng-icon name="heroPencilSquare" class="text-2xl"/>
    </button>

    <button class="flex items-center justify-center w-10 h-10 border border-red-500 text-red-500 rounded transition duration-200 hover:bg-red-500 hover:text-white" (click)="onDelete()">
      <ng-icon name="heroTrash" class="text-2xl"/>
    </button>
  </div>
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
