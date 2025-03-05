import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiEndpoints } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Saving } from '../../models/saving.model';

@Injectable({
  providedIn: 'root'
})
export class SavingService {
  private savingUrl = apiEndpoints.savingsUrl
  private categoriesUrl = apiEndpoints.savingCategoriesUrl
  
  constructor(private http: HttpClient) { }

  getSaving(): Observable<Saving[]> {
      return this.http.get<Saving[]>(this.savingUrl);
    }

  addSaving(payload: any) {
    return this.http.post(this.savingUrl, payload)
  }

  updateSaving(id: number, payload: any) {
    return this.http.put(`${this.savingUrl}/${id}`, payload)
  }

  deleteSaving(id: number) {
    return this.http.delete(`${this.savingUrl.replace(/\/$/, '')}/${id}/`);
  }

  getSavingCategory() {
    return this.http.get(this.categoriesUrl)
  }

  addSavingCategory(payload: any) {
    return this.http.post(this.categoriesUrl, payload)
  }

  updateSavingCategory(id: number, payload: any) {
    return this.http.put(`${this.categoriesUrl.replace(/\/$/, '')}/${id}/`, payload);
  }

  deleteSavingCategory(id: number) {
    return this.http.delete(`${this.categoriesUrl.replace(/\/$/, '')}/${id}/`);
  }

  getMonthlySaving() {
    return this.http.get(`${this.savingUrl}monthly_summary`)
  }

  getLastMonthSaving() {
    return this.http.get(`${this.savingUrl}last_month_summary`)
  }

  getLastYearSaving() {
    return this.http.get(`${this.savingUrl}last_year_summary`)
  }

  getSavingMonthlyCategory() {
    return this.http.get(`${this.savingUrl}monthly_category_summary`)
  }

  getLastMonthCategorySummary() {
    return this.http.get(`${this.savingUrl}last_month_category_summary`)
  }

  getYearlyCategorySummary() {
    return this.http.get(`${this.savingUrl}last_year_category_summary`)
  }

  getSummaryByCategory() {
    return this.http.get(`${this.savingUrl}summary_by_category`)
  }

}
