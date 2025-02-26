import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private darkModeSubject = new BehaviorSubject<boolean>(this.getSavedState());
  
  darkMode$ = this.darkModeSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  toggleDarkMode() {
    const currentMode = this.darkModeSubject.value;
    this.darkModeSubject.next(!currentMode);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('darkMode', JSON.stringify(!currentMode));
    }
  }

  getCurrentState(): boolean {
    return this.darkModeSubject.value;
  }

  private getSavedState(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const storedState = localStorage.getItem('darkMode');
      return storedState !== null ? JSON.parse(storedState) : false;
    }
    return false;  
  }
}


// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class DarkModeService {
//   private darkModeSubject = new BehaviorSubject<boolean>(this.getSavedState());
  
//   darkMode$ = this.darkModeSubject.asObservable();

//   toggleDarkMode() {
//     const currentMode = this.darkModeSubject.value;
//     this.darkModeSubject.next(!currentMode);
//     localStorage.setItem('darkMode', JSON.stringify(!currentMode));
//   }

//   getCurrentState(): boolean {
//     return this.darkModeSubject.value;
//   }

//   private getSavedState(): boolean {
//     const storedState = localStorage.getItem('darkMode');
//     return storedState !== null ? JSON.parse(storedState) : false;
//   }
  
// }
