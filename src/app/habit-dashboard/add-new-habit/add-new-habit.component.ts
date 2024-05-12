import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HabitService } from '../_services/habit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-new-habit',
  templateUrl: './add-new-habit.component.html',
  styleUrls: ['./add-new-habit.component.scss'],
})
export class AddNewHabitComponent implements OnInit {
  newHabitForm: FormGroup;
  days = [
    { id: 'mon', label: 'M' },
    { id: 'tue', label: 'T' },
    { id: 'wed', label: 'W' },
    { id: 'thu', label: 'T' },
    { id: 'fri', label: 'F' },
    { id: 'sat', label: 'S' },
    { id: 'sun', label: 'S' }
  ];
  selectedDays: string[] = [];
  times = [
    { label: 'Morning', icon: '' },
    { label: 'Noon', icon: '' },
    { label: 'Evening', icon: '' },
    { label: 'None', icon: 'notifications_off' }
  ];
  selectedTime: string = '';


  constructor(private habitService: HabitService, private router: Router) {
    this.newHabitForm = new FormGroup({
      title: new FormControl('', Validators.required),
      frequency: new FormControl('', Validators.required),
      remind: new FormControl('', Validators.required),
    });
  }

  ngOnInit() { }

  selectTime(time: string) {
    this.selectedTime = time;
    this.newHabitForm?.get('remind')?.setValue(time);
  }

  toggleDay(dayId: string) {
    const index = this.selectedDays.indexOf(dayId);
    if (index > -1) {
      this.selectedDays.splice(index, 1);
    } else {
      this.selectedDays.push(dayId);
    }
    this.newHabitForm?.get('frequency')?.setValue(this.selectedDays);
  }

  async submit() {
    await this.habitService.setHabit({
      id: Date.now(),
      title: this.newHabitForm.value.title,
      completed: false,
      completedAt: '',
      frequency: this.newHabitForm.value.frequency,
      remind: this.newHabitForm.value.remind
    });
    this.newHabitForm.reset();
    this.router.navigate(['/tabs/dashboard']);

  }
}
