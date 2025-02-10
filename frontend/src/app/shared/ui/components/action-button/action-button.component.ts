import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-action-button',
  standalone: true,
  imports: [CommonModule, NgIcon],
  template: `
    <button 
      class="flex items-center justify-center w-10 h-10 border rounded transition duration-200"
      [ngClass]="buttonClass"
      (click)="handleClick($event)"
      [title]="tooltip"
    >
      <ng-icon [name]="icon" class="text-2xl"/>
    </button>
  `,
  styles: ``
})
export class ActionButtonComponent {
  @Input() icon!: string;
  @Input() buttonClass!: string;
  @Input() tooltip!: string;
  @Output() actionClick = new EventEmitter<Event>();

  handleClick(event: Event) {
    this.actionClick.emit(event);
  }
}
