import { Component } from '@angular/core';
import { ExpenseFormComponent } from "./expense-form/expense-form.component";

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [ExpenseFormComponent],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent {

  
}
