import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ExpenseService } from '../../../../shared/services/api/expense.service';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css']
})
export class ExpenseFormComponent {
  @Input() categories: any[] = []; 
  expenses: any[] = [];
  selectedCategory: any = null;
  newCategoryName: string = '';

  amount: number | null = null;
  description: string = '';
  selectedDate: Date | null = null;
  initialDate: Date | null = null;
  selectedCategorieObj: any | null = null;

  constructor(private expenseService: ExpenseService) { }

  ngOnInit() {
    this.selectedDate = new Date();
    this.loadData();
  }

  loadData() {
    forkJoin({
      expenses: this.expenseService.getAllExpenses(),
      categories: this.expenseService.getExpenseCategories()
    }).subscribe(
      ({ expenses, categories }) => {
        this.expenses = expenses as any[];
        this.categories = categories as any[];
        console.log('Expenses:', this.expenses);
        console.log('Categories:', this.categories);
        if (this.categories.length > 0) {
          this.selectedCategory = this.categories[0].id;
          this.onCategorieSelect();
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  onCategorieSelect() {
    this.selectedCategorieObj = this.categories.find(
      (categorie) => categorie.id === Number(this.selectedCategory)  
    ) || null;
  }
}
