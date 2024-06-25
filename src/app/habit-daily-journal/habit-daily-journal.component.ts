import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { HabitService } from '../_shared/services/habit.service';
import { Habit } from '../_shared/models/habits.interface';
import * as moment from 'moment';
import { CustomCalendarView } from '../_shared/models/enum';
import { ColorService } from '../_shared/services/color.service';

@Component({
  selector: 'app-habit-daily-journal',
  templateUrl: './habit-daily-journal.component.html',
  styleUrls: ['./habit-daily-journal.component.scss'],
})
export class HabitDailyJournalComponent implements OnInit {
  _myHabits: Habit[] = [];
  startDate: Date = new Date();
  viewDate: Date = new Date();
  view: CustomCalendarView = CustomCalendarView.Day;

  constructor(
    private habitService: HabitService,
    private colorService: ColorService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.loadHabits();
  }

  async loadHabits() {
    this._myHabits = await this.habitService.getAllHabits();

    // Filtro le abitudini che hanno la startDate uguale a quella selezionata
    this._myHabits = this._myHabits.filter((habit) => {
      const habitStartDate = moment(habit.startDate).startOf('day');
      const selectedStartDate = moment(this.startDate).startOf('day');
      return habitStartDate.isSame(selectedStartDate);
    });

    this.cdr.detectChanges();
  }

  calculateColor(actualGoal: number, goal: number) {
    return this.colorService.calculateColor(actualGoal, goal);
  }

}
