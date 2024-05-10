import { Component, OnInit } from '@angular/core';
import { myHabitsMock } from './_models/mock';
import { Habit } from './_models/habits.interface';

@Component({
  selector: 'app-my-habits',
  templateUrl: './my-habits.component.html',
  styleUrls: ['./my-habits.component.scss'],
})
export class MyHabitsComponent implements OnInit {
  _myHabits: Habit[] = myHabitsMock;
  constructor() { }

  ngOnInit() {
  }

  toggleCompletion(habit: Habit): void {
    //Assegno a _myHabits il valore di _myHabits con la modifica
    const findHabit = this._myHabits.find(h => h.id === habit.id);
    if (findHabit) {
      habit.completedAt = habit.completed ? new Date().toLocaleTimeString() : '';
    }

  }

}
