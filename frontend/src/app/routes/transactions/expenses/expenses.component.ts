import { Component } from '@angular/core';
import { ExpenseFormComponent } from "./expense-form/expense-form.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExpenseService } from '../../../shared/services/api/expense.service';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, RouterModule, ExpenseFormComponent],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent {
  expense_categories: any = []
  expenses: any = []

  constructor(private expenseService: ExpenseService) { }

  ngOnInit() {}

  getExpenseCategories() {
    return this.expense_categories || [];
  }
  
}
