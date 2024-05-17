import { AfterContentInit, AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HabitService } from '../habit-dashboard/_services/habit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.scss'],
})
export class AddNewComponent implements OnInit, AfterContentInit {
  newHabitForm: FormGroup;
  @Input() isHabitToEdit: boolean = false;

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

  categories = [
    { id: 1, label: 'Health', icon: 'fitness_center' },
    { id: 2, label: 'Work', icon: 'work' },
    { id: 3, label: 'Study', icon: 'school' },
    { id: 4, label: 'Personal', icon: 'person' },
    { id: 5, label: 'Other', icon: 'more_horiz' }
  ];

  selectedCategory = null;
  selectedTime: string = '';


  constructor(private habitService: HabitService, private router: Router, private location: Location, private route: ActivatedRoute) {
    this.newHabitForm = new FormGroup({
      title: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      frequency: new FormControl('', Validators.required),
      remind: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {

  }

  ngAfterContentInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isHabitToEdit = true;
        this.habitService.getHabit(params['id']).then(habit => {
          console.log(habit);
          if (habit) {
            this.newHabitForm.patchValue(habit);
            this.selectedDays = habit.frequency;
            this.selectedTime = habit.remind;
          }
        });
      }
    });
  }

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

  goBack() {
    this.location.back();
  }

  async submit() {
    if (this.isHabitToEdit) {
      await this.habitService.setHabit({
        id: this.route.snapshot.params['id'],
        title: this.newHabitForm.value.title,
        completed: false,
        completedAt: '',
        startDate: this.newHabitForm.value.startDate,
        frequency: this.newHabitForm.value.frequency,
        remind: this.newHabitForm.value.remind
      });
      this.router.navigate(['/tabs/dashboard']);
      return;
    }
    await this.habitService.setHabit({
      id: Date.now(),
      title: this.newHabitForm.value.title,
      completed: false,
      completedAt: '',
      startDate: this.newHabitForm.value.startDate,
      frequency: this.newHabitForm.value.frequency,
      remind: this.newHabitForm.value.remind
    });
    this.newHabitForm.reset();
    this.router.navigate(['/tabs/dashboard']);

  }
}
