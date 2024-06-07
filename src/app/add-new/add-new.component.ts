import {
  Component,
  OnInit,
  AfterContentInit,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HabitService } from '../_shared/services/habit.service';
import { Habit } from '../habit-dashboard/_models/habits.interface';
import { EventColor } from 'calendar-utils';
import { CATEGORIES, COLORS_CATEGORIES, DAYS } from './data/data';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.scss'],
})
export class AddNewComponent implements OnInit, AfterContentInit {
  newHabitForm: FormGroup;
  @Input() isHabitToEdit: boolean = false;

  days = DAYS;
  selectedDays: string[] = [];
  categories = CATEGORIES;
  selectedCategory: any;
  iconSelectedCategory: string = '';

  colors_categories = COLORS_CATEGORIES;
  selectedColor: any = '';

  selectedTime: string = '';

  constructor(
    private habitService: HabitService,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.newHabitForm = this.fb.group({
      category: ['', Validators.required],
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      frequency: ['', Validators.required],
      color: [''],
      remind: [''],
    });
  }

  ngOnInit() {
    this.newHabitForm.get('startDate')?.valueChanges.subscribe((value) => {
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
    const day = this.days.find((d) => d.id === dayOfWeek);
    return day ? day.id : '';
  }

  ngAfterContentInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isHabitToEdit = true;
        this.habitService.getHabit(params['id']).then((habit) => {
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
    this.selectedColor = this.colors_categories.find((c) => c.hex === color);

    console.log(this.selectedColor);
  }

  onCategoryChange(categoryId: number) {
    this.selectedCategory = this.categories.find((c) => c.id === categoryId);
    this.newHabitForm.get('category')?.setValue(this.selectedCategory);
    this.iconSelectedCategory = this.selectedCategory.icon;
  }

  getEventColor(): EventColor {
    return {
      primary: this.selectedColor.hex,
      secondary: this.selectedColor.textColor,
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
      id: this.isHabitToEdit ? this.route.snapshot.params['id'] : Date.now(), // Questo id sarà sostituito in setHabits
      category: this.newHabitForm.value.category,
      title: this.newHabitForm.value.title,
      completed: false,
      completedAt: '',
      startDate: this.newHabitForm.value.startDate,
      endDate: this.newHabitForm.value.endDate,
      frequency: this.newHabitForm.value.frequency,
      remind: this.newHabitForm.value.remind,
      color: eventColor,
    };

    const repetitionDates = this.habitService.generateRepetitionDates(
      new Date(newHabit.startDate),
      newHabit.frequency,
      newHabit.endDate ? new Date(newHabit.endDate) : undefined
    );

    await this.habitService.setHabits(newHabit, repetitionDates);
    this.habitService.notifyNewHabitAdded();
    this.newHabitForm.reset();
    this.selectedDays = [];
    this.router.navigate(['/tabs/dashboard']);
  }
}
