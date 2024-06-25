import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { HabitService } from '../_shared/services/habit.service';
import { Habit } from '../_shared/models/habits.interface';
import * as moment from 'moment';
import { CardType, CustomCalendarView } from '../_shared/models/enum';
import { KnobService } from '../_shared/services/knob.service';

@Component({
  selector: 'app-habit-daily-journal',
  templateUrl: './habit-daily-journal.component.html',
  styleUrls: ['./habit-daily-journal.component.scss'],
})
export class HabitDailyJournalComponent implements OnInit, AfterViewChecked {
  _myHabits: Habit[] = [];
  startDate: Date = new Date();
  viewDate: Date = new Date();
  view: CustomCalendarView = CustomCalendarView.Day;
  CardType = CardType;
  currentKnobValue = 0;
  moods = [
    { icon: '😢', value: 1 },
    { icon: '😟', value: 2 },
    { icon: '😐', value: 3 },
    { icon: '🙂', value: 4 },
    { icon: '😄', value: 5 },
  ];

  selectedMood: number = 0;
  note: string = '';
  get knobColor(): string {
    return this.knobService.calculateColor(this.currentKnobValue, 100);
  }
  get displayKnobValue(): number {
    return Math.min(this.currentKnobValue, 100);
  }
  constructor(
    private habitService: HabitService,
    private knobService: KnobService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.loadHabits();
  }

  ngAfterViewChecked() {
    this.calculateKnobValue();
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
    return this.knobService.calculateColor(actualGoal, goal);
  }

  private calculateKnobValue() {
    const mappedHabits = this._myHabits.map((habit) =>
      this.habitService.mapHabitToEvent(habit, [])
    );

    this.currentKnobValue = this.knobService.calculateKnobValue(
      mappedHabits,
      this.viewDate
    );

    this.cdr.detectChanges();
  }

  selectMood(value: number) {
    this.selectedMood = value;
  }

  async saveMoodAndNotes() {
    const updatedHabits = this._myHabits.map((habit) => {
      return {...habit, mood: this.selectedMood, notes: this.note};
    });

    for (const habit of updatedHabits) {
      await this.habitService.setHabit(habit);
    }
  }
}
