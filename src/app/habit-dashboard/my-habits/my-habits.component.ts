import { AfterContentChecked, AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { myHabitsMock } from '../_models/mock';
import { Habit } from '../_models/habits.interface';
import { HabitService } from '../_services/habit.service';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-my-habits',
  templateUrl: './my-habits.component.html',
  styleUrls: ['./my-habits.component.scss'],
})
export class MyHabitsComponent implements OnInit, OnDestroy {
  private initSub: Subscription;
  private routerSubscription: Subscription = new Subscription();

  _myHabits: Habit[] = [];

  constructor(private habitService: HabitService, private router: Router) {
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

  navigateToAddNewHabit() {
    this.router.navigate(['/tabs/dashboard/add-new-habit']);
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
