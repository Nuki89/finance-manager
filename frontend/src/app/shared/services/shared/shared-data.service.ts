import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private incomeChangedSource = new BehaviorSubject<void>(undefined);
  private expenseChangedSource = new BehaviorSubject<void>(undefined);

  incomeChanged$ = this.incomeChangedSource.asObservable();
  expenseChanged$ = this.expenseChangedSource.asObservable();

  notifyIncomeChanged() {
    this.incomeChangedSource.next();
  }

  notifyExpenseChanged() {
    this.expenseChangedSource.next();
  }

}
