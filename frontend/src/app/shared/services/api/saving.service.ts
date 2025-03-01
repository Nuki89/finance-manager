import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiEndpoints } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SavingService {
  private savingUrl = apiEndpoints.savingsUrl
  private categoriesUrl = apiEndpoints.savingCategoriesUrl
  
  constructor(private http: HttpClient) { }

  getSaving() {
    return this.http.get(this.savingUrl)
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

  getSavingSource() {
    return this.http.get(this.categoriesUrl)
  }

  addSavingSource(payload: any) {
    return this.http.post(this.categoriesUrl, payload)
  }

  updateSavingSource(id: number, payload: any) {
    return this.http.put(`${this.categoriesUrl.replace(/\/$/, '')}/${id}/`, payload);
  }

  deleteSavingSource(id: number) {
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

  getSavingMonthlySource() {
    return this.http.get(`${this.savingUrl}monthly_source_summary`)
  }

  getLastMonthSourceSummary() {
    return this.http.get(`${this.savingUrl}last_month_source_summary`)
  }

  getYearlySourceSummary() {
    return this.http.get(`${this.savingUrl}last_year_source_summary`)
  }

}
