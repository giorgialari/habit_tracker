import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Habit } from '../../models/habits.interface';
import { CardType } from '../../models/enum';

@Component({
  selector: 'common-card-habit',
  templateUrl: './common-card-habit.component.html',
  styleUrls: ['./common-card-habit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CommonCardHabitComponent implements OnInit {
  @Input() habit: Habit = {} as Habit;
  @Input() cardType: CardType = CardType.Todo;
  CardType = CardType;
  constructor() {}

  ngOnInit() {}
}
