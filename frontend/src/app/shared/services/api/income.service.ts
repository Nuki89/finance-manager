import { Injectable } from '@angular/core';
import { apiEndpoints } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Income } from '../../models/income.model';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private incomeUrl = apiEndpoints.incomeUrl
  private sourceUrl = apiEndpoints.incomeSourcesUrl

  constructor(private http: HttpClient) { }

  getIncome(): Observable<Income[]> {
    return this.http.get<Income[]>(this.incomeUrl);
  }

  // getIncome() {
  //   return this.http.get(this.incomeUrl)
  // }

  addIncome(payload: any) {
    return this.http.post(this.incomeUrl, payload)
  }

  updateIncome(id: number, payload: any) {
    return this.http.put(`${this.incomeUrl.replace(/\/$/, '')}/${id}/`, payload);
  }

  deleteIncome(id: number) {
    return this.http.delete(`${this.incomeUrl.replace(/\/$/, '')}/${id}/`);
  }

  getIncomeSource() {
    return this.http.get(this.sourceUrl)
  }

  addIncomeSource(payload: any) {
    return this.http.post(this.sourceUrl, payload)
  }

  updateIncomeSource(id: number, payload: any) {
    return this.http.put(`${this.sourceUrl.replace(/\/$/, '')}/${id}/`, payload);
  }

  deleteIncomeSource(id: number) {
    return this.http.delete(`${this.sourceUrl.replace(/\/$/, '')}/${id}/`);
  }

  getMonthlyIncome() {
    return this.http.get(`${this.incomeUrl}monthly_summary`)
  }

  getLastMonthIncome() {
    return this.http.get(`${this.incomeUrl}last_month_summary`)
  }

  getLastYearIncome() {
    return this.http.get(`${this.incomeUrl}last_year_summary`)
  }

  getIncomeMonthlySource() {
    return this.http.get(`${this.incomeUrl}monthly_source_summary`)
  }

  getLastMonthSourceSummary() {
    return this.http.get(`${this.incomeUrl}last_month_source_summary`)
  }

  getYearlySourceSummary() {
    return this.http.get(`${this.incomeUrl}last_year_source_summary`)
  }

}
