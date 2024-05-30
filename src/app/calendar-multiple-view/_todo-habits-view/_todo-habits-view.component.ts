import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as moment from 'moment';
import { Subscription, filter } from 'rxjs';
import { CalendarService } from 'src/app/_shared/services/calendar.service';
import { HabitService } from 'src/app/_shared/services/habit.service';
import { Habit } from 'src/app/habit-dashboard/_models/habits.interface';

@Component({
  selector: 'app-todo-habits-view',
  templateUrl: './_todo-habits-view.component.html',
  styleUrls: ['./_todo-habits-view.component.scss']
})
export class _todoHabitsViewComponent implements OnInit, OnDestroy {
  private initSub: Subscription;
  private routerSubscription: Subscription = new Subscription();
  private calendarServiceSubscription: Subscription = new Subscription();

  _myHabits: Habit[] = [];
  startDate: Date = new Date();

  constructor(private habitService: HabitService, private router: Router, private cdr: ChangeDetectorRef, private calendarService: CalendarService) {
    this.initSub = this.habitService.getStorageReady().subscribe(ready => {
      if (ready) {
        this.loadHabits();
      }
    });

    this.calendarServiceSubscription = this.calendarService.selectedDate.subscribe(date => {
      this.startDate = date.completeDate;
      this.loadHabits();
    });
  }

  ngOnInit() {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(async () => {
      await this.loadHabits(); // Ricarica i dati ogni volta che si verifica una navigazione
    });
  }

  async loadHabits() {
    this._myHabits = await this.habitService.getAllHabits();
    // Filtro le abitudini che hanno la startDate uguale a quella selezionata
    this._myHabits = this._myHabits.filter(habit => {
      const habitStartDate = moment(habit.startDate).startOf('day');
      const selectedStartDate = moment(this.startDate).startOf('day');
      return habitStartDate.isSame(selectedStartDate);
    });
    this.cdr.detectChanges();
  }


  toggleCompletion(habit: Habit): void {
    const findHabit = this._myHabits.find(h => h.id === habit.id);
    if (findHabit) {
      habit.completedAt = habit.completed ? new Date().toLocaleTimeString() : '';
      this.habitService.setHabit(findHabit);
    }

  }

  editHabit(habit: Habit) {
    this.router.navigate(['/tabs/edit-habit', habit.id]);
  }

  deleteHabit(habit: Habit) {
    // Chiamata al servizio per eliminare l'abitudine
    this.habitService.removeHabit(habit.id).then(() => {
      // Aggiorna l'elenco delle abitudini dopo l'eliminazione
      this.loadHabits();
    });
  }

  ngOnDestroy() {
    if (this.initSub) {
      this.initSub.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.calendarServiceSubscription) {
      this.calendarServiceSubscription.unsubscribe();
    }
  }

}
