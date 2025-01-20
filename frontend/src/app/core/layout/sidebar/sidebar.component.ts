import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapLayoutSidebar, bootstrapXLg } from '@ng-icons/bootstrap-icons';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  viewProviders : [provideIcons({ bootstrapLayoutSidebar, bootstrapXLg})]
})
export class SidebarComponent {

} 