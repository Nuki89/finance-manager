import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleViewService {
  private viewMode = new BehaviorSubject<'Monthly' | 'Yearly'>('Monthly'); 
  viewMode$ = this.viewMode.asObservable(); 

  toggleView(): void {
    this.viewMode.next(this.viewMode.value === 'Monthly' ? 'Yearly' : 'Monthly');
  }

  getCurrentView(): 'Monthly' | 'Yearly' {
    return this.viewMode.value;
  }
}
