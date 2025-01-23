import { Injectable } from '@angular/core';
import { apiEndpoints } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private apiUrlListIncome = apiEndpoints.apiUrlListIncomes

  constructor(private http: HttpClient) { }

  getIncome() {
    return this.http.get(this.apiUrlListIncome)
  }

  addIncome(payload: any) {
    return this.http.post(this.apiUrlListIncome, payload)
  }

  deleteIncome(id: number) {
    return this.http.delete(`${this.apiUrlListIncome.replace(/\/$/, '')}/${id}/`);
}

  updateIncome(id: number, payload: any) {
    return this.http.put(`${this.apiUrlListIncome}/${id}`, payload)
  }

  getIncomeSource() {
    return this.http.get(apiEndpoints.apiUrlListIncomeSources)
  }

}
