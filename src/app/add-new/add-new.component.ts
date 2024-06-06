import { Component, OnInit, AfterContentInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HabitService } from '../_shared/services/habit.service';
import { Habit } from '../habit-dashboard/_models/habits.interface';
import { EventColor } from 'calendar-utils';


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

  constructor(
    private habitService: HabitService,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.newHabitForm = this.fb.group({
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      frequency: ['', Validators.required],
      color: [''], // Colore come stringa
      remind: [''],
    });
  }

  ngOnInit() {
    this.newHabitForm.get('startDate')?.valueChanges.subscribe(value => {
      // Se la data di inizio cambia, aggiorna la data di fine aggiungendo un'ora
      const endDate = new Date(value);
      endDate.setHours(endDate.getHours() + 1);

      this.newHabitForm.get('endDate')?.setValue(endDate);

      const dayOfWeek = this.getDayOfWeek(value);
      const dayId = this.mapDayOfWeekToId(dayOfWeek);

      this.selectedDays = [dayId];
      this.newHabitForm.get('frequency')?.setValue(this.selectedDays);
    });
  }

  private getDayOfWeek(date: Date): string {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return days[date?.getDay()];
  }

  private mapDayOfWeekToId(dayOfWeek: string): string {
    const day = this.days.find(d => d.id === dayOfWeek);
    return day ? day.id : '';
  }

  ngAfterContentInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isHabitToEdit = true;
        this.habitService.getHabit(params['id']).then(habit => {
          if (habit) {
            this.newHabitForm.patchValue({
              ...habit,
            });

            this.selectedDays = habit.frequency;
            this.selectedTime = habit.remind;
          }
        });
      }
    });
  }

  testSalvataggio() {
    const eventColor = this.getEventColor();

    const newHabit: Habit = {
      id: this.isHabitToEdit ? this.route.snapshot.params['id'] : Date.now(),  // Questo id sarà sostituito in setHabits
      title: this.newHabitForm.value.title,
      completed: false,
      completedAt: '',
      startDate: this.newHabitForm.value.startDate,
      endDate: this.newHabitForm.value.endDate,
      frequency: this.newHabitForm.value.frequency,
      remind: this.newHabitForm.value.remind,
      color: eventColor
    };

    console.log(newHabit);
  }
  selectTime(time: string) {
    this.selectedTime = time;
    this.newHabitForm?.get('remind')?.setValue(time);
  }

  toggleDay(dayId: string) {
    //Se l'utente tenta di elimniare il giorno di startDate allora esco dalla funzione e non lo elimino
    if (this.newHabitForm.value.startDate) {
      const dayOfWeek = this.getDayOfWeek(this.newHabitForm.value.startDate);
      const dayIdOfWeek = this.mapDayOfWeekToId(dayOfWeek);
      if (dayId === dayIdOfWeek) {
        return;
      }
    }

    const index = this.selectedDays.indexOf(dayId);
    if (index > -1) {
      this.selectedDays.splice(index, 1);
    } else {
      this.selectedDays.push(dayId);
    }
    this.newHabitForm?.get('frequency')?.setValue(this.selectedDays);
  }


  onColorChange(color: any) {
    this.newHabitForm.get('color')?.setValue(color);
  }

  getEventColor(): EventColor {
    const color = this.newHabitForm.get('color')?.value || '';
    return {
      primary: color,
      secondary: color
    };
  }

  // Gestisci l'evento di cancellazione del valore del calendario
  onReminderClear() {
    this.newHabitForm.get('remind')?.setValue(null);
    this.cdRef.detectChanges(); // Aggiorna la vista
  }
  async submit() {
    const eventColor = this.getEventColor();

    const newHabit: Habit = {
      id: this.isHabitToEdit ? this.route.snapshot.params['id'] : Date.now(),  // Questo id sarà sostituito in setHabits
      title: this.newHabitForm.value.title,
      completed: false,
      completedAt: '',
      startDate: this.newHabitForm.value.startDate,
      endDate: this.newHabitForm.value.endDate,
      frequency: this.newHabitForm.value.frequency,
      remind: this.newHabitForm.value.remind,
      color: eventColor
    };

    const repetitionDates = this.habitService.generateRepetitionDates(
      new Date(newHabit.startDate),
      newHabit.frequency,
      newHabit.endDate ? new Date(newHabit.endDate) : undefined
    );
    console.log(repetitionDates);

    await this.habitService.setHabits(newHabit, repetitionDates);
    this.habitService.notifyNewHabitAdded();
    this.newHabitForm.reset();
    this.selectedDays = [];
    this.router.navigate(['/tabs/dashboard']);
  }


}
