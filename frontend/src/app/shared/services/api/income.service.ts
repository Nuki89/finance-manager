import { Injectable } from '@angular/core';
import { apiEndpoints } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private incomeUrl = apiEndpoints.incomeUrl
  private sourceUrl = apiEndpoints.incomeSourcesUrl

  constructor(private http: HttpClient) { }

  getIncome() {
    return this.http.get(this.incomeUrl)
  }

  addIncome(payload: any) {
    return this.http.post(this.incomeUrl, payload)
  }

  deleteIncome(id: number) {
    return this.http.delete(`${this.incomeUrl.replace(/\/$/, '')}/${id}/`);
}

  updateIncome(id: number, payload: any) {
    return this.http.put(`${this.incomeUrl}/${id}`, payload)
  }

  getMonthlyIncome() {
    return this.http.get(`${this.incomeUrl}monthly_summary`)
  }

  getIncomeSource() {
    return this.http.get(this.sourceUrl)
  }

}
