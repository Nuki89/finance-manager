import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private incomeChangedSource = new BehaviorSubject<void>(undefined);

  incomeChanged$ = this.incomeChangedSource.asObservable();

  notifyIncomeChanged() {
    this.incomeChangedSource.next();
  }

}
