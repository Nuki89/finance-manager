import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PieChartComponent } from '../../shared/ui/charts/pie-chart.component';
import { BarChartComponent } from '../../shared/ui/charts/bar-chart.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, PieChartComponent, BarChartComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentBalance = 1800;
  totalIncome = 5000;
  totalExpense = 3200;

  spendingCategories = [
    { name: 'Rent', value: 1200 },
    { name: 'Food', value: 800 },
    { name: 'Travel', value: 400 },
    { name: 'Other', value: 800 },
  ];

  incomeVsExpense = {
    labels: ['January', 'February', 'March', 'April'],
    datasets: [
      {
        label: 'Income',
        data: [5000, 4500, 5200, 4800],
        backgroundColor: '#3b82f6',
      },
      {
        label: 'Expense',
        data: [3200, 3000, 3500, 3300],
        backgroundColor: '#ef4444',
      },
    ],
  };

  recentTransactions = [
    { name: 'Groceries', amount: -120 },
    { name: 'Salary', amount: 3000 },
    { name: 'Subscription', amount: -15 },
  ];

  addIncome() {
    console.log('Add Income clicked');
  }

  addExpense() {
    console.log('Add Expense clicked');
  }

  createSavingsGoal() {
    console.log('Create Savings Goal clicked');
  }
}
