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

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.scss'],
})
export class AddNewComponent
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
  // selectedCategoryOptValue = '';
  iconSelectedCategory: string = '';

  colors_categories = COLORS_CATEGORIES;
  selectedColor: any = '';
  // selectedColorOptValue = '';

  defaultIconBackgroundColor = theme.backgroundColor;
  defaultIconTextColor = theme.textColor;

  selectedTime: string = '';
  allDay = false;
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
    private fb: FormBuilder
  ) {
    this.newHabitForm = this.fb.group({
      category: ['', Validators.required],
      title: ['', Validators.required],
      allDay: [this.allDay],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
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
  }
  // #endregion

  // #region Lifecycle Hooks
  ngOnInit() {
    this.newHabitForm.get('startDate')?.valueChanges.subscribe((value) => {
      const startDate = new Date(value);
      // Assicurati che sia un oggetto Date valido
      if (!(startDate instanceof Date && !isNaN(startDate.getTime()))) {
        return;
      }
      // Se la data di inizio cambia, aggiorna la data di fine aggiungendo un'ora se != allDay, altrimenti setta la data di fine a mezzanotte
      const endDate = new Date(value);
      if (!this.allDay) {
        endDate.setHours(endDate.getHours() + 1);
      } else {
        endDate.setHours(23, 59, 59, 0);
      }

      this.newHabitForm.get('endDate')?.setValue(endDate);

      const dayOfWeek = this.getDayOfWeek(value);
      const dayId = this.mapDayOfWeekToId(dayOfWeek);

      this.selectedDays = [dayId];
      this.newHabitForm.get('frequency')?.setValue(this.selectedDays);

      //Setto di default il goal a 1 e il goalType con id 1 (volte)
      this.newHabitForm.get('goal')?.setValue(1);
      const firstGoalType = this.goalTypes.find((g) => g.id === 1);
      this.newHabitForm.get('goalType')?.setValue(firstGoalType?.value);
    });

    this.resetHourIfAllDay();

    this.newHabitForm.valueChanges.subscribe(() => {
      this.mapInfoMessage();
    });
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
      }
    });
  }
  ngAfterViewChecked(): void {
    this.hideIfAllDay();
  }
  // #endregion

  // #region Form Methods
  private resetHourIfAllDay() {
    this.newHabitForm.get('allDay')?.valueChanges.subscribe((value) => {
      this.allDay = value;
      let startDate = this.newHabitForm.value.startDate
        ? new Date(this.newHabitForm.value.startDate)
        : new Date();
      let endDate = this.newHabitForm.value.endDate
        ? new Date(this.newHabitForm.value.endDate)
        : new Date();

      if (value) {
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 0);

        this.newHabitForm
          .get('startDate')
          ?.setValue(startDate ? startDate : '');
        this.newHabitForm.get('endDate')?.setValue(endDate ? endDate : '');
      } else {
        this.newHabitForm.get('startDate')?.setValue('');
        this.newHabitForm.get('endDate')?.setValue('');
      }
    });
  }
  // #endregion

  // #region Info message
  mapInfoMessage() {
    //Se vengono selezionati tutti i giorni, allora mostro "Tutti i giorni",
    //se sono selezionati solo sabato e domenica allora mostro "Weekend",
    // se sono selezionati solo i giorni lavorativi allora mostro "Lun-Ven"
    // altrimenti mostro i giorni selezionati

    if (this.selectedDays.length === 7) {
      this.infoMessage.days = ['giorno']; //ogni giorno
    } else if (
      this.selectedDays.length === 2 &&
      this.selectedDays.includes('sat') &&
      this.selectedDays.includes('sun')
    ) {
      this.infoMessage.days = ['Weekend'];
    } else if (
      this.selectedDays.length === 5 &&
      this.selectedDays.includes('mon') &&
      this.selectedDays.includes('tue') &&
      this.selectedDays.includes('wed') &&
      this.selectedDays.includes('thu') &&
      this.selectedDays.includes('fri')
    ) {
      this.infoMessage.days = ['Lun-Ven'];
    } else {
      this.infoMessage.days = this.selectedDays
        .map((day) => {
          const dayObj = this.days.find((d) => d.id === day);
          return dayObj ? dayObj.name : '';
        })
        .sort((a, b) => {
          return (
            this.days.findIndex((d) => d.name === a) -
            this.days.findIndex((d) => d.name === b)
          );
        });
    }

    this.infoMessage.startDateNoHours = this.newHabitForm.value.startDate
      ? //undefined al posto del locale per evitare problemi di timezone
        new Date(this.newHabitForm.value.startDate).toLocaleDateString(
          undefined,
          {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }
        )
      : '';
    this.infoMessage.endDateNoHours = this.newHabitForm.value.endDate
      ? new Date(this.newHabitForm.value.endDate).toLocaleDateString(
          undefined,
          {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }
        )
      : '';

    this.infoMessage.startHour = this.newHabitForm.value.startDate
      ? new Date(this.newHabitForm.value.startDate).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';
    this.infoMessage.endHour = this.newHabitForm.value.endDate
      ? new Date(this.newHabitForm.value.endDate).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';

    this.infoMessage.goal = this.formatNumber(this.newHabitForm.value.goal);
    const findGoalTypeLabel = this.goalTypes.find((goal) => {
      return goal.value === this.newHabitForm.value.goalType;
    });
    this.infoMessage.goalType =
      findGoalTypeLabel?.label === 'Custom'
        ? this.newHabitForm.value.customGoalType
        : findGoalTypeLabel?.label || '';
  }

  formatNumber(number: any): string {
    return Number(number).toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });
  }

  shouldDisplayMessage(): boolean {
    return (
      this.infoMessage.days.length > 0 &&
      !!this.infoMessage.startDateNoHours &&
      !!this.infoMessage.endDateNoHours &&
      !!this.infoMessage.startHour &&
      !!this.infoMessage.endHour &&
      !!this.infoMessage.goal &&
      !!this.infoMessage.goalType
    );
  }
  getMessageVerb(): string {
    const today = new Date();
    const endDate = new Date(this.infoMessage.endDateNoHours);
    return endDate < today ? 'si è ripetuto' : 'si ripeterà';
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
  // Gestisci l'evento di cancellazione del valore del calendario
  onReminderClear() {
    this.newHabitForm.get('remind')?.setValue(null);
    this.cdRef.detectChanges(); // Aggiorna la vista
  }
  // #endregion

  // #region Helper Methods
  hideIfAllDay() {
    const timePicker = document.querySelector('.p-timepicker');
    if (timePicker && this.allDay) {
      this.renderer.addClass(timePicker, 'hidden');
    }
  }

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
  // #endregion

  // #region Actions SAVE and EDIT
  saveHabit() {
    this.newHabitForm.markAllAsTouched();
    Object.keys(this.newHabitForm.controls).forEach((key) => {
      this.newHabitForm.get(key)?.markAsDirty();
    });
    this.newHabitForm.updateValueAndValidity();
    if (this.newHabitForm.invalid) {
      return;
    }
    const eventColor = this.getEventColor();

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

    if (this.isHabitToEdit) {
      habit.id = parseInt(this.route.snapshot.params['id']);
      habit.idMaster = parseInt(this.route.snapshot.params['idMaster']);
      this.editHabit(habit);
    } else {
      habit.id = Date.now(); //Verrà rigenerato poi nel servizio
      habit.idMaster = this.genereateIdMaster();
      this.submit(habit);
    }
    this.refreshService.forceRefresh();
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
