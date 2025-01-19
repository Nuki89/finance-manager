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

}
