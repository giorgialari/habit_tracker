import { Injectable } from '@angular/core';
import { isSameDay } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class KnobService {
  constructor() {}

  calculateColor(currentKnobValue: number, goal: number): string {
    const percentage = currentKnobValue / goal;
    if (percentage < 0.33) {
      return '#ff6666'; // Rosso brillante
    } else if (percentage < 0.66) {
      return '#ffcc66'; // Arancione brillante
    } else {
      return '#66cc66'; // Verde brillante
    }
  }

  calculateKnobValue(events: any[], viewDate: Date) {
    // Prendo tutti gli eventi della giornata selezionata
    const eventsOfDay = events.filter((event) =>
      isSameDay(event.start, viewDate)
    );

    // Se non ci sono eventi, imposta il valore a 0 e termina la funzione
    if (eventsOfDay.length === 0) {
      return 0;
    }

    let weightedCompleted = 0; // Somma ponderata dei completamenti
    let totalGoal = 0; // Somma totale dei goal

    eventsOfDay.forEach((event) => {
      const actualGoalNormalized = Math.min(event.actualGoal, event.goal); // Normalizza actualGoal a non superare goal
      weightedCompleted += actualGoalNormalized; // Usa il valore normalizzato
      totalGoal += event.goal;
    });

    // Calcola la percentuale finale ponderata
    let finalPercentage = (weightedCompleted / totalGoal) * 100;
    let rounded = Math.round(finalPercentage);

    return rounded;
  }
}
