import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-action-button',
  standalone: true,
  imports: [CommonModule, NgIcon],
  template: `
    <button 
      class="flex items-center justify-center rounded-lg transition duration-400"
      [ngClass]="[buttonClass, size === 'icon' ? 'w-10 h-10' : 'px-4 py-2']"
      (click)="handleClick($event)"
      [title]="tooltip"
      [type]="type"
    >
      <ng-icon *ngIf="icon" [name]="icon" class="text-2xl" [ngClass]="text ? 'mr-2' : ''"></ng-icon>
      <span *ngIf="text">{{ text }}</span>
    </button>
  `,
  styles: ``
})
export class ActionButtonComponent {
  @Input() icon?: string;
  @Input() text?: string;
  @Input() buttonClass!: string;
  @Input() tooltip!: string;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() size: 'normal' | 'icon' = 'normal';

  @Output() actionClick = new EventEmitter<Event>();

  handleClick(event: Event) {
    this.actionClick.emit(event);
  }
}
