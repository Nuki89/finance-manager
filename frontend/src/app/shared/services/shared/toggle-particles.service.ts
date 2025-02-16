import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleParticlesService {

  private showParticles = new BehaviorSubject<boolean>(this.getSavedState());
  showParticles$ = this.showParticles.asObservable();

  constructor() {}

  toggleParticles(): void {
    const newState = !this.showParticles.value;
    this.showParticles.next(newState);
    localStorage.setItem('showParticles', JSON.stringify(newState));
  }

  getCurrentState(): boolean {
    return this.showParticles.value;
  }

  private getSavedState(): boolean {
    const storedState = localStorage.getItem('showParticles');
    return storedState !== null ? JSON.parse(storedState) : false;
  }
  
}
