import { AfterContentChecked, AfterContentInit, Component, OnInit } from '@angular/core';
import { myHabitsMock } from '../_models/mock';
import { Habit } from '../_models/habits.interface';
import { HabitService } from '../_services/habit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-habits',
  templateUrl: './my-habits.component.html',
  styleUrls: ['./my-habits.component.scss'],
})
export class MyHabitsComponent implements OnInit, AfterContentInit {
  _myHabits: Habit[] = [];

  constructor(private habitService: HabitService, private router: Router) { }

  ngOnInit() {
  }

  ngAfterContentInit(): void {
    this.loadHabits();
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


}
