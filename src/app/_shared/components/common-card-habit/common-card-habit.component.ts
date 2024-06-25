import { Component, Input, OnInit } from '@angular/core';
import { Habit } from '../../models/habits.interface';

@Component({
  selector: 'common-card-habit',
  templateUrl: './common-card-habit.component.html',
  styleUrls: ['./common-card-habit.component.scss'],
})
export class CommonCardHabitComponent implements OnInit {
  @Input() habit: Habit = {} as Habit;
  constructor() {}

  ngOnInit() {}
}
