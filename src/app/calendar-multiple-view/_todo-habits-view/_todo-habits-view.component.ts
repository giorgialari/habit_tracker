import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as moment from 'moment';
import { Subject, Subscription, filter, find } from 'rxjs';
import { CalendarService } from 'src/app/_shared/services/calendar.service';
import { KnobService } from 'src/app/_shared/services/knob.service';
import { HabitService } from 'src/app/_shared/services/habit.service';
import { RefreshService } from 'src/app/_shared/services/refresh-trigger.service';
import { Habit } from 'src/app/_shared/models/habits.interface';
import { CardType } from 'src/app/_shared/models/enum';

@Component({
  selector: 'app-todo-habits-view',
  templateUrl: './_todo-habits-view.component.html',
})
export class _todoHabitsViewComponent implements OnInit, OnDestroy {
  private initSub: Subscription;
  private routerSubscription: Subscription = new Subscription();
  private calendarServiceSubscription: Subscription = new Subscription();
  private refreshComponentTriggerSubscription = new Subscription();
  @Output() updatedHabits = new EventEmitter<Habit[]>();
  CardType = CardType;
  _myHabits: Habit[] = [];
  startDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  currentKnobValue = 0;
  visible: boolean = false;
  currentHabit: Habit = {} as Habit;

  hideDialog(event: boolean) {
    this.visible = event;
  }
  constructor(
    private habitService: HabitService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private calendarService: CalendarService,
    private refreshService: RefreshService,
    private knobService: KnobService
  ) {
    this.initSub = this.habitService.getStorageReady().subscribe((ready) => {
      if (ready) {
        this.loadHabits();
      }
    });

    this.calendarServiceSubscription =
      this.calendarService.selectedDate.subscribe((date) => {
        this.startDate = date.completeDate;
        this.loadHabits();
      });
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(async () => {
        await this.loadHabits(); // Ricarica i dati ogni volta che si verifica una navigazione
      });

    this.refreshComponentTriggerSubscription = this.refreshService
      .getRefreshTrigger()
      .subscribe(async () => {
        await this.loadHabits();
        this.refresh.next({});
        this.cdr.detectChanges();
      });
  }

  async loadHabits() {
    this._myHabits = await this.habitService.getAllHabits();
    // Filtro le abitudini che hanno la startDate uguale a quella selezionata
    this._myHabits = this._myHabits.filter((habit) => {
      const habitStartDate = moment(habit.startDate).startOf('day');
      const selectedStartDate = moment(this.startDate).startOf('day');
      return habitStartDate.isSame(selectedStartDate);
    });
    this.updatedHabits.emit(this._myHabits);
    this.cdr.detectChanges();
  }

  updateActualGoal(habit: Habit) {
    const findHabit = this._myHabits.find((h) => h.id === habit.id);
    if (findHabit) {
      findHabit.actualGoal = habit.actualGoal;
      this.updatedHabits.emit(this._myHabits);
      this.checkIfCompleted(findHabit);
    }
  }

  checkIfCompleted(habit: Habit) {
    const wasCompleted = habit.completed;
    habit.completed = habit.actualGoal >= habit.goal;

    // Passa l'informazione se l'habit è stato appena completato
    this.toggleCompletion(
      habit,
      wasCompleted !== habit.completed && habit.completed
    );
  }

  toggleCompletion(habit: Habit, justCompleted: boolean): void {
    const findHabit = this._myHabits.find((h) => h.id === habit.id);
    if (findHabit) {
      // Aggiorna `completedAt` solo se `justCompleted` è true
      if (justCompleted) {
        habit.completedAt = new Date().toLocaleTimeString();
      }

      // Potresti voler aggiornare l'oggetto in un servizio o stato globale
      this.habitService.setHabit(findHabit);
    }
  }

  resetActualGoal(habit: Habit) {
    const findHabit = this._myHabits.find((h) => h.id === habit.id);
    if (findHabit) {
      habit.actualGoal = 0;
      habit.completed = false;
      habit.completedAt = '';
      this.habitService.setHabit(findHabit);
    }
    this.updatedHabits.emit(this._myHabits);
  }
  showDialog(habit: Habit) {
    this.visible = true;
    this.currentHabit = habit;
  }

  editHabit(habit: Habit) {
    this.router.navigate(['/tabs/edit-habit', habit.id, habit.idMaster]);
  }

  calculateColor(actualGoal: number, goal: number) {
    return this.knobService.calculateColor(actualGoal, goal);
  }
  ngOnDestroy() {
    if (this.initSub) {
      this.initSub.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.calendarServiceSubscription) {
      this.calendarServiceSubscription.unsubscribe();
    }
    if (this.refreshComponentTriggerSubscription) {
      this.refreshComponentTriggerSubscription.unsubscribe();
    }
  }
}
