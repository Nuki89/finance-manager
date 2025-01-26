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

  exportPdf(payload: any) {
    return this.http.post(this.exportPdfUrl, payload)
  }

}
