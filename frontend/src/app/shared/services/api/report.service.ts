import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiEndpoints } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private balanceUrl = apiEndpoints.balanceUrl
  private exportPdfUrl = apiEndpoints.exportPdfUrl

  constructor(private http: HttpClient) { }

  getBalance() {
    return this.http.get(this.balanceUrl)
  }

  exportVsPdf() {
    return this.http.get(`${this.exportPdfUrl}download_summary_pdf`, { responseType: 'blob' });
  }  

  exportIncomePdf() {
    return this.http.get(`${this.exportPdfUrl}download_income_summary_pdf`, { responseType: 'blob' });
  }

  exportExpensePdf() {
    return this.http.get(`${this.exportPdfUrl}download_expense_summary_pdf`, { responseType: 'blob' });
  }

}
