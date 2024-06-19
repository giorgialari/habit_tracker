import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { ColorService } from 'src/app/_shared/services/color.service';
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
  get knobColor(): string {
    return this.colorService.calculateColor(this.currentKnobValue, this.currentHabit.goal);
  }
  @Input() currentHabit: Habit = {} as Habit;

  constructor(private colorService: ColorService) {}

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
  }

  onHide() {
    this.visible = false;
    this.hide.emit(this.visible);
  }

  increaseKnobValue(amount: number): void {
    this.currentKnobValue += amount;
    this.onConfirm();
  }

  decreaseKnobValue(amount: number): void {
    const newValue = this.currentKnobValue - amount;
    this.currentKnobValue = Math.max(newValue, 0);
    this.onConfirm();
  }


}
