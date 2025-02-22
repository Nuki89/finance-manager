import { Injectable } from '@angular/core';
import { apiEndpoints } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private expenseUrl = apiEndpoints.expenseUrl
  private categoriesUrl = apiEndpoints.expenseCategoriesUrl

  private expenseCache: any[] | null = null;
  private lastFetchTime: number = 0;
  private CACHE_DURATION = 60 * 1000;

  constructor(private http: HttpClient) { }

  private handleError(operation = 'operation', fallbackValue: any = []) {
    return (error: any): Observable<any[]> => {
      console.error(`${operation} failed:`, error);
      return of(fallbackValue);
    };
  }

  // getAllExpenses() {
  //   return this.http.get(this.expenseUrl)
  // }

  getAllExpenses() {
    const now = Date.now();
    if (this.expenseCache && now - this.lastFetchTime < this.CACHE_DURATION) { 
      console.log('Returning cached expenses');
      return of(this.expenseCache);
    }

    return this.http.get(this.expenseUrl).pipe(
      tap(data => {
        this.expenseCache = data as any[];
        this.lastFetchTime = Date.now();
      }),
      catchError(this.handleError('getAllExpenses', []))
    );
  }

  addExpense(payload: any) {
    return this.http.post(this.expenseUrl, payload)
  }

  updateExpense(id: number, payload: any) {
    return this.http.put(`${this.expenseUrl}/${id}`, payload)
  }

  deleteExpense(id: number) {
    return this.http.delete(`${this.expenseUrl.replace(/\/$/, '')}/${id}/`);
  }

  getExpenseCategory() {
    return this.http.get(this.categoriesUrl)
  }

  addExpenseCategory(payload: any) {
    return this.http.post(this.categoriesUrl, payload)
  }

  updateExpenseCategory(id: number, payload:any) {
    return this.http.put(`${this.categoriesUrl.replace(/\/$/, '')}/${id}/`, payload);
  }

  deleteExpenseCategory(id: number) {
    return this.http.delete(`${this.categoriesUrl.replace(/\/$/, '')}/${id}/`);
  }

  getMonthlyExpense() {
    return this.http.get(`${this.expenseUrl}monthly_summary`)
  }

  getLastMonthExpense() {
    return this.http.get(`${this.expenseUrl}last_month_summary`)
  }

  getLastYearExpense() {
    return this.http.get(`${this.expenseUrl}last_year_summary`)
  }

  getMonthlyCategorySummary() {
    return this.http.get(`${this.expenseUrl}monthly_category_summary`)
  }

  getLastMonthCategorySummary() {
    return this.http.get(`${this.expenseUrl}last_month_category_summary`)
  }

  getYearlyCategorySummary() {
    return this.http.get(`${this.expenseUrl}last_year_category_summary`)
  }

}