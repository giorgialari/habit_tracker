import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  constructor() { }

  calculateColor(currentKnobValue: number, goal: number): string {
    const percentage = currentKnobValue / goal;
    if (percentage < 0.33) {
      return '#ff6666';  // Rosso brillante
    } else if (percentage < 0.66) {
      return '#ffcc66';  // Arancione brillante
    } else {
      return '#66cc66';  // Verde brillante
    }
  }
}
