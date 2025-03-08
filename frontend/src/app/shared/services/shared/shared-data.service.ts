import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private incomeChangedSource = new BehaviorSubject<void>(undefined);
  private expenseChangedSource = new BehaviorSubject<void>(undefined);
  private savingChangedSource = new BehaviorSubject<void>(undefined);
  private balanceChangedSource = new BehaviorSubject<void>(undefined);

  incomeChanged$ = this.incomeChangedSource.asObservable();
  expenseChanged$ = this.expenseChangedSource.asObservable();
  savingChanged$ = this.savingChangedSource.asObservable();
  balanceChanged$ = this.balanceChangedSource.asObservable();

  notifyIncomeChanged() {
    this.incomeChangedSource.next();
    this.balanceChangedSource.next();
  }

  notifyExpenseChanged() {
    this.expenseChangedSource.next();
    this.balanceChangedSource.next();
  }

  notifySavingChanged() {
    this.savingChangedSource.next();
    this.balanceChangedSource.next();
  }

}
