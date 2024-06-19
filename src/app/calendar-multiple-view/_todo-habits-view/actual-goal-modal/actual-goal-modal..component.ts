import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { Habit } from 'src/app/habit-dashboard/_models/habits.interface';

@Component({
  selector: 'app-actual-goal-modal',
  templateUrl: './actual-goal-modal.component.html',
  styleUrls: ['./actual-goal-modal.component.scss'],
})
export class ActualGoalModalComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Output() hide = new EventEmitter();
  confirm: boolean = false;
  @Output() confirmEventEmitter = new EventEmitter();
  currentKnobValue = 0;
  @Input() currentHabit: Habit = {} as Habit;

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    this.currentKnobValue = this.currentHabit?.actualGoal || 0;
  }

  onKnobChange(event: any) {
    this.currentKnobValue = event;
  }

  onConfirm() {
    this.confirm = true;
    const habitUpdated = {
      ...this.currentHabit,
      actualGoal: this.currentKnobValue,
    };
    this.confirmEventEmitter.emit(habitUpdated);
    this.onHide();
  }

  onHide() {
    this.visible = false;
    this.hide.emit(this.visible);
  }


}
