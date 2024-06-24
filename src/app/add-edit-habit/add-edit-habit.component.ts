import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  AfterViewInit,
  ElementRef,
  Renderer2,
  ViewChild,
  AfterViewChecked,
} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HabitService } from '../_shared/services/habit.service';
import { Habit } from '../_shared/models/habits.interface';
import { EventColor } from 'calendar-utils';
import { CATEGORIES, COLORS_CATEGORIES, DAYS } from '../_shared/data/data';
import { parseISO } from 'date-fns';
import { RefreshService } from '../_shared/services/refresh-trigger.service';
import { theme } from 'src/theme/dark-theme/dark-config';
import { NotificationService } from '../_shared/services/notification.service';

@Component({
  selector: 'app-add-edit-habit',
  templateUrl: './add-edit-habit.component.html',
  styleUrls: ['./add-edit-habit.component.scss'],
})
export class AddEditHabitComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  // #region Properties
  newHabitForm: FormGroup;
  @Input() isHabitToEdit: boolean = false;
  @ViewChild('startDatePicker') startDatePicker!: ElementRef;
  @ViewChild('endDatePicker') endDatePicker!: ElementRef;
  days = DAYS;
  selectedDays: string[] = [];
  categories = CATEGORIES;
  selectedCategory: any;
  iconSelectedCategory: string = '';

  colors_categories = COLORS_CATEGORIES;
  selectedColor: any = '';

  defaultIconBackgroundColor = theme.backgroundColor;
  defaultIconTextColor = theme.textColor;

  selectedTime: string = '';
  goalTypes = [
    { id: 1, label: 'Volta/e', value: 'volte' },
    { id: 2, label: 'Custom', value: 'custom' },
  ];

  infoMessage = {
    days: [''],
    startDateNoHours: '',
    endDateNoHours: '',
    startHour: '',
    endHour: '',
    goal: '',
    goalType: '',
  };

  // #endregion

  // #region Constructor
  constructor(
    private habitService: HabitService,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private refreshService: RefreshService,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.newHabitForm = this.fb.group({
      category: ['', Validators.required],
      title: ['', Validators.required],
      allDay: [false],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startDailyHour: ['', Validators.required],
      endDailyHour: ['', Validators.required],
      actualGoal: [0],
      goal: ['', Validators.required],
      goalType: ['', Validators.required],
      customGoalType: [''],
      frequency: ['', Validators.required],
      color: [''],
      remind: [''],
    });

    this.newHabitForm.get('goalType')?.valueChanges.subscribe((value) => {
      if (value === 'custom') {
        this.newHabitForm
          .get('customGoalType')
          ?.setValidators([Validators.required]);
        this.newHabitForm.get('customGoalType')?.updateValueAndValidity();
        this.newHabitForm.get('customGoalType')?.markAsDirty();
      } else {
        this.newHabitForm.get('customGoalType')?.clearValidators();
        this.newHabitForm.get('customGoalType')?.updateValueAndValidity();
      }
    });

    this.newHabitForm.get('allDay')?.valueChanges.subscribe((value) => {
      if (value) {
        this.newHabitForm.get('startDailyHour')?.clearValidators();
        this.newHabitForm.get('endDailyHour')?.clearValidators();
        this.newHabitForm.get('startDailyHour')?.updateValueAndValidity();
        this.newHabitForm.get('endDailyHour')?.updateValueAndValidity();
      } else {
        this.newHabitForm
          .get('startDailyHour')
          ?.setValidators([Validators.required]);
        this.newHabitForm
          .get('endDailyHour')
          ?.setValidators([Validators.required]);
        this.newHabitForm.get('startDailyHour')?.updateValueAndValidity();
        this.newHabitForm.get('endDailyHour')?.updateValueAndValidity();
      }
    });
  }

  // #endregion

  // #region Lifecycle Hooks
  ngOnInit() {
    this.newHabitForm.get('startDate')?.valueChanges.subscribe((value) => {
      if (!value) return;
      const endDate = new Date(value);
      if (this.newHabitForm.value.allDay) {
        endDate.setHours(23, 59, 59, 0);
      }

      if (endDate) {
        this.newHabitForm.get('endDate')?.setValue(endDate);
      }

      const dayOfWeek = this.getDayOfWeek(value);
      const dayId = this.mapDayOfWeekToId(dayOfWeek);

      this.selectedDays = [dayId];
      this.newHabitForm.get('frequency')?.setValue(this.selectedDays);

      //Setto di default il goal a 1 e il goalType con id 1 (volte)
      this.newHabitForm.get('goal')?.setValue(1);
      const firstGoalType = this.goalTypes.find((g) => g.id === 1);
      this.newHabitForm.get('goalType')?.setValue(firstGoalType?.value);
    });

    this.newHabitForm.get('startDailyHour')?.valueChanges.subscribe((value) => {
      if (!value) return;

      const endDate = new Date(value);
      endDate.setHours(endDate.getHours() + 1);
      this.newHabitForm.get('endDailyHour')?.setValue(endDate);
    });

    this.newHabitForm.get('allDay')?.valueChanges.subscribe((value) => {
      if (value) {
        this.newHabitForm.get('startDate')?.setValue(new Date());
        this.newHabitForm.value.startDate.setHours(0, 0, 0, 0);

        this.newHabitForm.get('endDate')?.setValue(new Date());
        this.newHabitForm.value.endDate.setHours(23, 59, 59, 0);

        this.newHabitForm.get('startDailyHour')?.setValue(new Date());
        this.newHabitForm.value.startDailyHour.setHours(0, 0, 0, 0);

        this.newHabitForm.get('endDailyHour')?.setValue(new Date());
        this.newHabitForm.value.endDailyHour.setHours(23, 59, 59, 0);
      }
    });
  }

  setStartDateAndEndDateHours() {
    //assegno a startDate l'ora di startDailyHour e a endDate l'ora di endDailyHour
    const startDate = this.newHabitForm.value.startDate;
    const startDailyHour = this.newHabitForm.value.startDailyHour;
    const endDate = this.newHabitForm.value.endDate;
    const endDailyHour = this.newHabitForm.value.endDailyHour;

    startDate.setHours(startDailyHour.getHours(), startDailyHour.getMinutes());
    endDate.setHours(endDailyHour.getHours(), endDailyHour.getMinutes());
  }

  ngAfterViewInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isHabitToEdit = true;
        this.habitService.getHabit(params['id']).then((habit) => {
          if (habit) {
            habit.startDate = parseISO(habit.startDate) as any;
            habit.endDate = parseISO(habit.endDate) as any;
            this.newHabitForm.patchValue({
              ...habit,
              startDailyHour: habit.startDate,
              endDailyHour: habit.endDate,
            });
            this.selectedCategory = this.categories.find(
              (c) => c.id === habit.category.id
            );
            this.iconSelectedCategory = this.selectedCategory.icon;
            this.newHabitForm.get('category')?.setValue(this.selectedCategory);

            this.selectedColor = this.colors_categories.find(
              (c) => c.hex === habit.color.primary
            );
            this.newHabitForm.get('color')?.setValue(this.selectedColor);

            this.selectedDays = habit.frequency;
            this.selectedTime = habit.remind;
            this.cdRef.detectChanges();
          }
        });

        this.habitService
          .getHabitsByIdMaster(params['idMaster'])
          .then((habit) => {
            if (habit.length > 0) {
              //raccolgo l'ultimo habit per settare la data di inizio e fine
              const lastHabit = habit[habit.length - 1];
              lastHabit.endDate = parseISO(lastHabit.endDate) as any;
              this.newHabitForm.get('endDate')?.setValue(lastHabit.endDate);
            }
          });
      }
    });
  }

  ngAfterViewChecked(): void {
  }
  // #endregion

  // #region Form Handlers
  onColorChange(selectedColor: any) {
    this.newHabitForm.get('color')?.setValue(selectedColor);
    this.selectedColor = selectedColor;
  }

  onCategoryChange(category: any) {
    this.selectedCategory = category;
    this.newHabitForm.get('category')?.setValue(this.selectedCategory);
    this.iconSelectedCategory = this.selectedCategory?.icon;
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

  onReminderClear() {
    this.newHabitForm.get('remind')?.setValue(null);
    this.cdRef.detectChanges();
  }

  onReminderShow() {
    document.querySelectorAll('.p-button-label').forEach((span) => {
      const spanElement = span as HTMLElement;
      if (spanElement?.textContent?.trim() === 'Today') {
        spanElement.style.display = 'none';
      }
    });
  }

  // #endregion

  // #region Helper Methods
  private getDayOfWeek(dateInput: string | Date): string {
    // Creazione di un oggetto Date. Se 'dateInput' è già un Date, lo usa direttamente.
    let date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    // Verifica che 'date' sia un oggetto Date valido.
    if (!isNaN(date.getTime())) {
      const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      return days[date.getDay()];
    } else {
      return 'Invalid date';
    }
  }

  private mapDayOfWeekToId(dayOfWeek: string): string {
    const day = this.days.find((d) => d.id === dayOfWeek);
    return day ? day.id : '';
  }

  getMinDate() {
    const startDateValue = this.newHabitForm.get('startDate')?.value;
    if (startDateValue) {
      const startDate = new Date(startDateValue);
      return startDate;
    }
    return null;
  }

  getEventColor(): EventColor {
    return {
      primary: this.selectedColor?.hex || this.defaultIconBackgroundColor,
      secondary: this.selectedColor?.textColor || this.defaultIconTextColor,
    };
  }

  async submitNotificationForm(date: Date) {
    await this.notificationService.handleNewNotification(
      date,
      1,
      'New Event',
      "Don't forget your event!"
    );
  }

  // #endregion

  // #region Actions SAVE and EDIT
 async saveHabit() {
    this.newHabitForm.markAllAsTouched();
    Object.keys(this.newHabitForm.controls).forEach((key) => {
      this.newHabitForm.get(key)?.markAsDirty();
    });
    this.newHabitForm.updateValueAndValidity();
    if (this.newHabitForm.invalid) {
      return;
    }
    const eventColor = this.getEventColor();

    this.setStartDateAndEndDateHours();

    const habit: Habit = {
      idMaster: 0,
      id: 0,
      category: this.newHabitForm.value.category,
      title: this.newHabitForm.value.title,
      completed: false,
      completedAt: '',
      allDay: this.newHabitForm.value.allDay,
      startDate: this.newHabitForm.value.startDate,
      endDate: this.newHabitForm.value.endDate,
      actualGoal: this.newHabitForm.value.actualGoal,
      goal: this.newHabitForm.value.goal,
      goalType: this.newHabitForm.value.goalType,
      customGoalType: this.newHabitForm.value.customGoalType,
      frequency: this.newHabitForm.value.frequency,
      remind: this.newHabitForm.value.remind,
      color: eventColor,
    };

    await this.submitNotificationForm(this.newHabitForm.value.remind);

    if (this.isHabitToEdit) {
      habit.id = parseInt(this.route.snapshot.params['id']);
      habit.idMaster = parseInt(this.route.snapshot.params['idMaster']);
      this.editHabit(habit);
    } else {
      habit.id = Date.now(); //Verrà rigenerato poi nel servizio
      habit.idMaster = this.genereateIdMaster();
      this.submit(habit);
    }
  }

  private genereateIdMaster() {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  async submit(newHabit: Habit) {
    const repetitionDates = this.habitService.generateRepetitionDates(
      new Date(newHabit.startDate),
      newHabit.frequency,
      newHabit.endDate ? new Date(newHabit.endDate) : undefined
    );

    await this.habitService.setHabits(newHabit, repetitionDates);
    this.habitService.notifyNewHabitAdded();
    this.newHabitForm.reset();
    this.selectedDays = [];
    this.refreshService.forceRefresh();
    this.router.navigate(['/tabs/dashboard']);
  }

  async editHabit(editedHabit: Habit) {
    const repetitionDates = this.habitService.generateRepetitionDates(
      new Date(editedHabit.startDate),
      editedHabit.frequency,
      editedHabit.endDate ? new Date(editedHabit.endDate) : undefined
    );

    await this.habitService.editHabit(editedHabit, repetitionDates);
    this.habitService.notifyNewHabitAdded();
    this.newHabitForm.reset();
    this.selectedDays = [];
    this.refreshService.forceRefresh();
    this.router.navigate(['/tabs/dashboard']);
  }
  // #endregion

  // #region Manage DELETE with Dialog
  showDialog() {
    this.visible = true;
  }

  visible: boolean = false;
  hideDialog(event: boolean) {
    this.visible = event;
  }

  deleteFutureEvents: boolean = false;
  onDeleteFutureEvents(event: boolean) {
    this.deleteFutureEvents = event;
  }

  confirmDelete: boolean = false;
  onDeleteEvent(event: boolean) {
    this.confirmDelete = event;
    this.manageDelete(this.confirmDelete);
  }

  manageDelete(confirmDelete: boolean) {
    if (confirmDelete && !this.deleteFutureEvents) {
      this.deleteHabit();
    } else if (confirmDelete && this.deleteFutureEvents) {
      this.deleteFutureHabits();
    }
  }
  deleteHabit() {
    const habitId = this.route.snapshot.params['id'];
    if (!habitId) {
      return;
    }
    this.habitService.removeHabit(habitId).then(() => {
      this.refreshService.forceRefresh();
      this.router.navigate(['/tabs/dashboard']);
    });
  }

  deleteFutureHabits() {
    const habitIdMater = this.route.snapshot.params['idMaster'];
    if (!habitIdMater) {
      return;
    }
    this.habitService.removeFutureHabits(habitIdMater).then(() => {
      this.refreshService.forceRefresh();
      this.router.navigate(['/tabs/dashboard']);
    });
  }

  // #endregion
}
