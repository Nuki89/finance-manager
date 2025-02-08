import { CommonModule } from '@angular/common';
import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { heroTrash, heroPencilSquare } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-table-action-cell',
  standalone: true,
  imports: [CommonModule, NgIcon],
  template: `
    <button (click)="onEdit()">
      <ng-icon [icon]="heroPencilSquare"></ng-icon>
    </button>
    <button (click)="onDelete()">
      <ng-icon [icon]="heroTrash"></ng-icon>
    </button>


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
  schemas: [NO_ERRORS_SCHEMA]
})
export class TableActionCellComponent {
  @Input() onEdit!: () => void;
  @Input() onDelete!: () => void;

  heroTrash = heroTrash;
  heroPencilSquare = heroPencilSquare;

}
