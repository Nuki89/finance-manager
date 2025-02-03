import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { GeneralSettingsComponent } from "./general-settings/general-settings.component";
import { AccountSettingsComponent } from "./account-settings/account-settings.component";
import { FinanceSettingsComponent } from './finance-settings/finance-settings.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatTabsModule, GeneralSettingsComponent, AccountSettingsComponent, FinanceSettingsComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  selectedTabIndex: number = 0;

  constructor() {}

  ngOnInit() {
    const savedTab = localStorage.getItem('selectedSettingsTab');
    if (savedTab !== null) {
      this.selectedTabIndex = Number(savedTab);
    }
  }

  onTabChange(event: any) {
    this.selectedTabIndex = event.index;
    localStorage.setItem('selectedSettingsTab', event.index.toString()); 
  }
}
