import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, interval, takeWhile } from 'rxjs';

@Component({
  selector: 'app-habit-dashboard',
  templateUrl: './habit-dashboard.component.html',
  styleUrls: ['./habit-dashboard.component.scss'],
})
export class HabitDashboardComponent implements OnInit, OnDestroy {

  weekDays: Date[] = [];
  daysToDisplay: number = 6;
  today = new Date();
  currentMonth: string = ''

  constructor() {
    this.loadWeekDays(this.today);
  }

  ngOnInit() { }
  // Carica i giorni della settimana data una data qualsiasi in quella settimana
  loadWeekDays(date: Date) {
    const startOfWeek = this.getStartOfWeek(new Date(date)); // Crea una copia della data
    this.currentMonth = startOfWeek.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });

    // Prima verifica se la settimana visualizzata è la settimana corrente
    const isCurrentWeek = this.getStartOfWeek(new Date()).getTime() === startOfWeek.getTime();

    // Imposta il numero di giorni in base al risultato
    this.daysToDisplay = isCurrentWeek ? 7 : 6;

    // Ora popola l'array dei giorni della settimana
    this.weekDays = Array.from({ length: this.daysToDisplay }).map((_, i) => {
      const day = new Date(startOfWeek.getTime()); // Utilizza il getTime per garantire che non venga modificato l'originale
      day.setDate(day.getDate() + i);
      return day;
    });

    // Aggiorna la verifica subito dopo il caricamento dei giorni della settimana
    this.isThisWeek();  // Questo aggiorna la condizione per il pulsante "next"
  }


  // Calcola l'inizio della settimana per la data fornita
  getStartOfWeek(date: Date) {
    // Crea una copia della data per evitare modifiche all'originale
    const dateCopy = new Date(date?.getTime());
    const day = dateCopy.getDay();
    const diff = dateCopy.getDate() - day + (day === 0 ? -6 : 1);  // Adegua se la settimana inizia di domenica
    dateCopy.setDate(diff);
    dateCopy.setHours(0, 0, 0, 0);  // Azzerare ore, minuti, secondi, e millisecondi
    return dateCopy;
  }


  // Vai alla settimana successiva
  nextWeek() {
    const nextWeekDate = new Date(this.weekDays[0]);
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);
    this.loadWeekDays(nextWeekDate);
  }

  // Torna alla settimana precedente
  previousWeek() {
    const previousWeekDate = new Date(this.weekDays[0]);
    previousWeekDate.setDate(previousWeekDate.getDate() - 7);
    this.loadWeekDays(previousWeekDate);
  }

  // Determina se un giorno è il giorno corrente
  isToday(date: Date) {
    const isToday = date.getDate() === this.today.getDate() &&
      date.getMonth() === this.today.getMonth() &&
      date.getFullYear() === this.today.getFullYear();
    return isToday;
  }

  isThisWeek() {
    const currentWeekStart = this.getStartOfWeek(new Date());
    const viewedWeekStart = this.getStartOfWeek(this.weekDays[0]);
    return currentWeekStart.getTime() === viewedWeekStart.getTime();
  }

  private intervalSubscription: Subscription = new Subscription();
  private continue = false;

  startAction(action: 'next' | 'previous') {
    this.continue = true;

    // Imposta un intervallo che viene eseguito ogni 200 millisecondi
    this.intervalSubscription = interval(200)
      .pipe(takeWhile(() => this.continue))
      .subscribe(() => {
        if (action === 'next' && !this.isThisWeek()) {
          this.nextWeek();
        } else if (action === 'previous') {
          this.previousWeek();
        }
      });
  }

  stopAction() {
    this.continue = false;
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.stopAction();
  }

}
