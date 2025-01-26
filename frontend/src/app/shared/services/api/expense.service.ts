import { Injectable } from '@angular/core';
import { apiEndpoints } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private expenseUrl = apiEndpoints.apiUrlListExpenses
  private categoriesUrl = apiEndpoints.apiUrlListExpenseCategories

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

  getExpenseSource() {
    return this.http.get(this.categoriesUrl)
  }

}