import { CommonModule } from '@angular/common';
import { Component, Input, NO_ERRORS_SCHEMA, ViewEncapsulation } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-table-action-cell',
  standalone: true,
  imports: [CommonModule, NgIcon],
  template: `
  <div class="flex justify-center space-x-2">
    <button 
      *ngFor="let action of actions" 
      class="flex items-center justify-center w-10 h-10 border rounded transition duration-200"
      [ngClass]="action.class"
      (click)="action.handler()"
      [title]="action.tooltip"
    >
      <ng-icon [name]="action.icon" class="text-2xl"/>
    </button>
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


// import { CommonModule } from '@angular/common';
// import { Component, Input, NO_ERRORS_SCHEMA, ViewEncapsulation } from '@angular/core';
// import { NgIcon } from '@ng-icons/core';
// import { ICellRendererAngularComp } from 'ag-grid-angular';
// import { ICellRendererParams } from 'ag-grid-community';
// import { heroTrash, heroPencilSquare } from '@ng-icons/heroicons/outline';

// @Component({
//   selector: 'app-table-action-cell',
//   standalone: true,
//   imports: [CommonModule, NgIcon],
//   template: `
//   <div class="flex justify-center space-x-2">
//     <button 
//       *ngFor="let action of actions" 
//       class="flex items-center justify-center w-10 h-10 border rounded transition duration-200"
//       [ngClass]="action.class"
//       (click)="action.handler()"
//       [title]="action.tooltip"
//     >
//       <ng-icon [name]="action.icon" class="text-2xl"/>
//     </button>
//   </div>
//   `,
//   encapsulation: ViewEncapsulation.None,
//   schemas: [NO_ERRORS_SCHEMA]
// })
// export class TableActionCellComponent implements ICellRendererAngularComp {
//   @Input() onEdit!: () => void;
//   @Input() onDelete!: () => void;

//   actions: any[] = [];

//   private params!: ICellRendererParams;

//   agInit(params: ICellRendererParams): void {
//     this.params = params;

//     if (params.context && params.context.componentParent) {
//       this.actions = [
//         {
//           type: 'edit',
//           icon: 'heroPencilSquare',
//           class: 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
//           tooltip: 'Edit',
//           handler: () => params.context.componentParent.handleEdit(params.data.id, params.data),
//         },
//         {
//           type: 'delete',
//           icon: 'heroTrash',
//           class: 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white',
//           tooltip: 'Delete',
//           handler: () => params.context.componentParent.handleDelete(params.data.id),
//         }
//       ];
//     } else {
//       console.error("context.componentParent is undefined in agInit");
//     }
//   }

//   refresh(params: ICellRendererParams): boolean {
//     this.params = params;
//     return true;
//   }
// }