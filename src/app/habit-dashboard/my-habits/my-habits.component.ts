import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Habit } from '../_models/habits.interface';
import { HabitService } from '../_services/habit.service';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { IonItemSliding, IonList } from '@ionic/angular';

@Component({
  selector: 'app-my-habits',
  templateUrl: './my-habits.component.html',
  styleUrls: ['./my-habits.component.scss'],
})
export class MyHabitsComponent implements OnInit, OnDestroy {
  private initSub: Subscription;
  private routerSubscription: Subscription = new Subscription();

  _myHabits: Habit[] = [];

  constructor(private habitService: HabitService, private router: Router, private cdr: ChangeDetectorRef) {
    this.initSub = this.habitService.getStorageReady().subscribe(ready => {
      if (ready) {
        this.loadHabits();
      }
    });
  }

  ngOnInit() {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadHabits(); // Ricarica i dati ogni volta che si verifica una navigazione
    });
  }

  async loadHabits() {
    this._myHabits = await this.habitService.getAllHabits();
  }

  toggleCompletion(habit: Habit): void {
    const findHabit = this._myHabits.find(h => h.id === habit.id);
    if (findHabit) {
      habit.completedAt = habit.completed ? new Date().toLocaleTimeString() : '';
      this.habitService.setHabit(findHabit);
    }

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
  }

}
