import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { heroTrash, heroPencilSquare } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-table-action-cell',
  standalone: true,
  imports: [CommonModule, NgIcon],
  template: `
    <div class="flex gap-2">
      <button class="bg-blue-500 text-white px-3 rounded" (click)="onEdit()">
        <ng-icon [name]="heroPencilSquare"></ng-icon>
      </button>
      
      <button class="bg-red-500 text-white px-3 rounded" (click)="onDelete()">
        <ng-icon [name]="heroTrash"></ng-icon>
      </button>
    </div>
  `,
  styles: [`
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      border: none;
      cursor: pointer;
    }
  `],
})
export class TableActionCellComponent {
  @Input() params: any;

  heroPencilSquare = heroPencilSquare;
  heroTrash = heroTrash;

  onEdit() {
    if (this.params.context?.componentParent?.handleEdit) {
      this.params.context.componentParent.handleEdit(this.params.data.id, this.params.data);
    }
  }

  onDelete() {
    if (this.params.context?.componentParent?.handleDelete) {
      this.params.context.componentParent.handleDelete(this.params.data.id);
    }
  }
}
