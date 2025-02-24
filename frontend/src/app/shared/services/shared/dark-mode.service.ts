import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private darkModeSubject = new BehaviorSubject<boolean>(this.getSavedState());
  
  darkMode$ = this.darkModeSubject.asObservable();

  toggleDarkMode() {
    const currentMode = this.darkModeSubject.value;
    this.darkModeSubject.next(!currentMode);
    localStorage.setItem('darkMode', JSON.stringify(!currentMode));
  }

  getCurrentState(): boolean {
    return this.darkModeSubject.value;
  }

  private getSavedState(): boolean {
    const storedState = localStorage.getItem('darkMode');
    return storedState !== null ? JSON.parse(storedState) : false;
  }
  
}
