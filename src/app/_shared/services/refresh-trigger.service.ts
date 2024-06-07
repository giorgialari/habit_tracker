import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  private refreshTrigger = new BehaviorSubject<number>(0);

  constructor() { }

  forceRefresh() {
    this.refreshTrigger.next(Math.random());  // Emette un numero casuale
  }

  getRefreshTrigger() {
    return this.refreshTrigger.asObservable();
  }
}
