import { Component, OnDestroy, OnInit } from '@angular/core';
import { GestureController } from '@ionic/angular';
import { Subscription, interval, takeWhile } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit, OnDestroy {
  weekDays: Date[] = [];
  daysToDisplay: number = 6;
  today = new Date();
  currentMonth: string = '';
  private intervalSubscription: Subscription = new Subscription();
  private continue = false;
  constructor(public gestureCtrl: GestureController
  ) {
    this.loadWeekDays(this.today);
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.stopAction();
  }

  // Carica i giorni della settimana data una data qualsiasi in quella settimana
  loadWeekDays(date: Date) {
    const startOfWeek = this.getStartOfWeek(new Date(date));
    this.currentMonth = startOfWeek.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
    const isCurrentWeek = this.getStartOfWeek(new Date()).getTime() === startOfWeek.getTime();
    this.daysToDisplay = isCurrentWeek ? 6 : 5;

    this.weekDays = Array.from({ length: this.daysToDisplay }).map((_, i) => {
      const day = new Date(date.getTime());
      day.setDate(day.getDate() + i);
      return day;
    });
    this.isThisWeek();
  }


  // Calcola l'inizio della settimana per la data fornita
  getStartOfWeek(date: Date) {
    const dateCopy = new Date(date?.getTime());
    const day = dateCopy.getDay();
    const diff = dateCopy.getDate() - day + (day === 0 ? -6 : 1);
    dateCopy.setDate(diff);
    dateCopy.setHours(0, 0, 0, 0);
    return dateCopy;
  }

  // Vai alla settimana successiva
  nextWeek() {
    const nextWeekDate = new Date(this.weekDays[0]);
    nextWeekDate.setDate(nextWeekDate.getDate() + 5);
    console.log(nextWeekDate);
    this.loadWeekDays(nextWeekDate);
  }

  // Torna alla settimana precedente
  previousWeek() {
    const previousWeekDate = new Date(this.weekDays[0]);
    previousWeekDate.setDate(previousWeekDate.getDate() - 5);
    console.log(previousWeekDate);
    this.loadWeekDays(previousWeekDate);
  }

  // Determina se un giorno è il giorno corrente
  isToday(date: Date) {
    const isToday = date.getDate() === this.today.getDate() &&
      date.getMonth() === this.today.getMonth() &&
      date.getFullYear() === this.today.getFullYear();
    return isToday;
  }

  // Verifica se la settimana visualizzata è la settimana corrente
  isThisWeek() {
    const currentWeekStart = this.getStartOfWeek(new Date());
    const viewedWeekStart = this.getStartOfWeek(this.weekDays[0]);
    return currentWeekStart.getTime() === viewedWeekStart.getTime();
  }

  // Avvia l'azione di scorrimento delle settimane
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

  // Interrompe l'azione di scorrimento delle settimane
  stopAction() {
    this.continue = false;
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }
}
