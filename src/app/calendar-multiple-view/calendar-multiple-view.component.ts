import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  OnInit,
  ChangeDetectorRef,
  Renderer2,
  OnDestroy,
  AfterViewChecked,
  Output,
  EventEmitter,
} from '@angular/core';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject, Subscription } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
} from 'angular-calendar';
import { Habit } from '../_shared/models/habits.interface';
import { HabitService } from '../_shared/services/habit.service';
import { Gesture, GestureController } from '@ionic/angular';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TabUserOrderService } from '../_shared/services/tab-user-order.service';
import { collapseAnimation } from 'angular-calendar';
import { Router } from '@angular/router';
import { RefreshService } from '../_shared/services/refresh-trigger.service';
import { CustomCalendarView } from '../_shared/models/enum';
import { TABS } from '../_shared/data/data';
import { CustomCalendarEvent } from '../_shared/models/common.interfaces';
import { ColorService } from '../_shared/services/color.service';

@Component({
  selector: 'app-calendar-multiple-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './calendar-multiple-view.component.html',
  styleUrls: [
    './calendar-multiple-view.component.scss',
    './_month.component.scss',
  ],
  animations: [collapseAnimation],
})
export class CalendarMultipleViewComponent
  implements OnInit, AfterViewChecked, OnDestroy
{
  @ViewChild('swipeContainer', { static: true }) swipeContainer!: ElementRef;

  view: CustomCalendarView = CustomCalendarView.Month;

  CalendarView = CustomCalendarView;

  viewDate: Date = new Date();

  visible: boolean = false;

  currentHabit: Habit = {} as Habit;

  @Output() updatedHabits = new EventEmitter<Habit[]>();

  actions: CalendarEventAction[] = [
    {
      label: '<span class="material-icons">edit</span>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent(event as CustomCalendarEvent);
      },
    },
  ];

  tabs = TABS;

  refresh: Subject<any> = new Subject();
  refreshComponentTriggerSubscription = new Subscription();
  switchDayView = false;
  events: CustomCalendarEvent[] = [];
  currentKnobValue = 0;
  get knobColor(): string {
    return this.colorService.calculateColor(this.currentKnobValue, 100);
  }
  get displayKnobValue(): number {
    return Math.min(this.currentKnobValue, 100);
  }
  activeDayIsOpen: boolean = false;

  constructor(
    private habitService: HabitService,
    private gestureCtrl: GestureController,
    private renderer: Renderer2,
    private tabOrderUserService: TabUserOrderService,
    private refreshService: RefreshService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private colorService: ColorService
  ) {}

  async ngOnInit() {
    await this.loadTabs();

    this.setupSwipeGesture();

    this.refreshComponentTriggerSubscription = this.refreshService
      .getRefreshTrigger()
      .subscribe(async () => {
        await this.loadHabits();
        this.refresh.next({});
        this.cd.detectChanges();
      });
  }

  ngAfterViewChecked() {
    this.calculateKnobValue();
  }

  async beforeMonthViewRender() {
    await this.loadHabits();
    this.cd.detectChanges();
  }
  hideDialog(event: boolean) {
    this.visible = event;
  }

  showDialog(habit: Habit) {
    this.visible = true;
    this.currentHabit = habit;
  }

  async updateActualGoal(habit: Habit) {
    const habits: Habit[] = await this.habitService.getAllHabits();
    const findHabit = habits.find((h) => h.id === habit.id);

    if (findHabit) {
      findHabit.actualGoal = habit.actualGoal;

      await this.habitService.setHabit(findHabit);
      this.refreshService.forceRefresh();
    }
  }

  private async loadTabs() {
    await this.tabOrderUserService.ready();
    const savedTabs = await this.tabOrderUserService.getTabOrder();
    if (savedTabs) {
      this.tabs = savedTabs;
    } else {
      await this.tabOrderUserService.setTabOrder(this.tabs);
    }

    this.view = this.tabs[0]?.view;
    if (this.view === CustomCalendarView.Day) {
      this.scrollToCurrentHour();
    }
  }

  private async loadHabits() {
    const habits: Habit[] = await this.habitService.getAllHabits();
    this.events = habits.map((habit) => this.mapHabitToEvent(habit));
    this.calculateKnobValue();
    this.cd.detectChanges();
  }

  private mapHabitToEvent = (habit: Habit) => {
    return {
      id: habit.id,
      idMaster: habit.idMaster,
      category: habit.category,
      start: new Date(habit.startDate),
      end: habit.endDate ? new Date(habit.endDate) : undefined,
      goal: habit.goal,
      actualGoal: habit.actualGoal,
      goalType: habit.goalType,
      customGoalType: habit.customGoalType,
      title: habit.title,
      color: habit.color,
      actions: this.actions,
      allDay: habit.allDay,
      draggable: false,
      resizable: {
        beforeStart: false,
        afterEnd: false,
      },
    };
  };

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
      this.cd.detectChanges();
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    }) as CustomCalendarEvent[];
  }

  handleEvent(event: CustomCalendarEvent): void {
    this.router.navigate(['/tabs/edit-habit', event.id, event.idMaster]);
  }



  setView(view: CustomCalendarView) {
    this.view = view;
    if (view === CustomCalendarView.Day) {
      setTimeout(() => this.scrollToCurrentHour(), 0);
    }

    switch (view) {
      case CustomCalendarView.Day:
        this.scrollToCurrentHour();
        break;
      case CustomCalendarView.Month:
        break;
      default:
        break;
    }
    this.activeDayIsOpen = false;
    this.refreshService.forceRefresh();
  }

  scrollToCurrentHour(): void {
    this.viewDate = new Date();
    this.cd.detectChanges();
    const hourElement = document.querySelector(`.cal-current-time-marker`);
    if (hourElement) {
      hourElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  setupSwipeGesture() {
    const gesture: Gesture = this.gestureCtrl.create({
      el: this.swipeContainer.nativeElement,
      gestureName: 'swipe',
      onMove: (detail) => {},
      onEnd: (detail) => {
        if (detail.velocityX > 0.3) {
          this.goToPreviousView(); // Swipe right
        } else if (detail.velocityX < -0.3) {
          this.goToNextView(); // Swipe left
        }
      },
    });

    gesture.enable(true);
  }

  goToNextView() {
    this.addSwipeClass('left');
    if (this.view === CustomCalendarView.Day) {
      this.viewDate = this.addOneDay(this.viewDate, 1);
    } else if (this.view === CustomCalendarView.Month) {
      this.viewDate = this.addMonths(this.viewDate, 1);
    }
    this.closeOpenMonthViewDay();
    this.refresh.next(Math.random());
  }

  goToPreviousView() {
    this.addSwipeClass('right');
    if (this.view === CustomCalendarView.Day) {
      this.viewDate = this.addOneDay(this.viewDate, -1);
    } else if (this.view === CustomCalendarView.Month) {
      this.viewDate = this.addMonths(this.viewDate, -1);
    }
    this.closeOpenMonthViewDay();
    this.refresh.next(Math.random());
  }

  addMonths(date: Date, months: number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  }

  addOneDay(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  addSwipeClass(direction: string) {
    const element = this.swipeContainer.nativeElement;
    this.renderer.addClass(element, `swipe-${direction}`);
    setTimeout(() => {
      this.renderer.removeClass(element, `swipe-${direction}`);
    }, 300); // La durata dell'animazione deve corrispondere a quella definita in CSS
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  async drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tabs, event.previousIndex, event.currentIndex);
    await this.tabOrderUserService.setTabOrder(this.tabs);
  }

  updateHabits(event: Habit[]) {
    this.events = event.map((habit) => this.mapHabitToEvent(habit));
    this.cd.detectChanges();
  }
  private calculateKnobValue() {
    // Prendo tutti gli eventi della giornata selezionata
    const eventsOfDay = this.events.filter((event) =>
      isSameDay(event.start, this.viewDate)
    );

    // Se non ci sono eventi, imposta il valore a 0 e termina la funzione
    if (eventsOfDay.length === 0) {
      this.currentKnobValue = 0;
      this.cd.detectChanges();
      return;
    }

    let weightedCompleted = 0; // Somma ponderata dei completamenti
    let totalGoal = 0; // Somma totale dei goal

    eventsOfDay.forEach(event => {
      const actualGoalNormalized = Math.min(event.actualGoal, event.goal); // Normalizza actualGoal a non superare goal
      weightedCompleted += actualGoalNormalized; // Usa il valore normalizzato
      totalGoal += event.goal;
    });

    // Calcola la percentuale finale ponderata
    let finalPercentage = (weightedCompleted / totalGoal) * 100;
    let rounded = Math.round(finalPercentage);

    // Imposta il valore del knob al valore arrotondato
    this.currentKnobValue = rounded;
    this.cd.detectChanges();
  }




  ngOnDestroy(): void {
    this.refreshComponentTriggerSubscription.unsubscribe();
  }
}
