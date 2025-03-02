import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiEndpoints } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private historyUrl = apiEndpoints.historyUrl;

  constructor(
    private http: HttpClient
  ) { }

  getHistoryLast5() {
    return this.http.get(`${this.historyUrl}filterLast5`);
  }

}
