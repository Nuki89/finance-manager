import { Injectable } from '@angular/core';
import { apiEndpoints } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private expenseUrl = apiEndpoints.expenseUrl
  private categoriesUrl = apiEndpoints.expenseCategoriesUrl

  constructor(private http: HttpClient) { }

  getExpense() {
    return this.http.get(this.expenseUrl)
  }

  addExpense(payload: any) {
    return this.http.post(this.expenseUrl, payload)
  }

  deleteExpense(id: number) {
    return this.http.delete(`${this.expenseUrl.replace(/\/$/, '')}/${id}/`);
  }

  updateExpense(id: number, payload: any) {
    return this.http.put(`${this.expenseUrl}/${id}`, payload)
  }

  getMonthlyExpense() {
    return this.http.get(`${this.expenseUrl}monthly_summary`)
  }

  getExpenseCategory() {
    return this.http.get(`${this.expenseUrl}monthly_category_summary`)
  }

  getExpenseSource() {
    return this.http.get(this.categoriesUrl)
  }

  getLastMonthCategorySummary() {
    return this.http.get(`${this.expenseUrl}last_month_category_summary`)
  }

  getLastMonthExpense() {
    return this.http.get(`${this.expenseUrl}last_month_summary`)
  }

  getLastYearExpense() {
    return this.http.get(`${this.expenseUrl}last_year_summary`)
  }

  getYearlyCategorySummary() {
    return this.http.get(`${this.expenseUrl}last_year_category_summary`)
  }

}