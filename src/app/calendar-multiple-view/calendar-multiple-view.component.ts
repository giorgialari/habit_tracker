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
import { CardType, CustomCalendarView } from '../_shared/models/enum';
import { TABS } from '../_shared/data/data';
import { CustomCalendarEvent } from '../_shared/models/common.interfaces';
import { KnobService } from '../_shared/services/knob.service';
import { CalendarService } from '../_shared/services/calendar.service';

@Component({
  selector: 'app-calendar-multiple-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './calendar-multiple-view.component.html',
  styleUrls: [
    './calendar-multiple-view.component.scss',
    './_day.component.scss',
    './_month.component.scss',
    './_tabs.component.scss',
    './_week.component.scss',
  ],
  animations: [collapseAnimation],
})
export class CalendarMultipleViewComponent
  implements OnInit, AfterViewChecked, OnDestroy
{
  //#region Properties
  @ViewChild('swipeContainer', { static: true }) swipeContainer!: ElementRef;

  view: CustomCalendarView = CustomCalendarView.Month;

  CalendarView = CustomCalendarView;

  viewDate: Date = new Date();

  visible: boolean = false;

  currentHabit: Habit = {} as Habit;

  @Output() updatedHabits = new EventEmitter<Habit[]>();

  CardType = CardType;

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
    return this.knobService.calculateColor(this.currentKnobValue, 100);
  }
  get displayKnobValue(): number {
    return Math.min(this.currentKnobValue, 100);
  }
  activeDayIsOpen: boolean = false;

  //#endregion

  //#region Lifecycle Hooks
  constructor(
    private habitService: HabitService,
    private calendarService: CalendarService,
    private gestureCtrl: GestureController,
    private renderer: Renderer2,
    private tabOrderUserService: TabUserOrderService,
    private refreshService: RefreshService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private knobService: KnobService
  ) {}

  async ngOnInit() {
    await this.loadTabs();
    await this.loadDayViewState();

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

  ngOnDestroy(): void {
    this.refreshComponentTriggerSubscription.unsubscribe();
  }
  //#endregion

  //#region Habit Handling
  private async loadHabits() {
    const habits: Habit[] = await this.habitService.getAllHabits();
    this.events = habits.map((habit) =>
      this.habitService.mapHabitToEvent(habit, this.actions)
    );
    this.calculateKnobValue();
    this.cd.detectChanges();
  }
  async updateActualGoal(habit: Habit) {
    const habits: Habit[] = await this.habitService.getAllHabits();
    const findHabit = habits.find((h) => h.id === habit.id);

    if (findHabit) {
      findHabit.actualGoal = habit.actualGoal;

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

  async toggleCompletion(habit: Habit, justCompleted: boolean) {
    const habits: Habit[] = await this.habitService.getAllHabits();
    const findHabit = habits.find((h) => h.id === habit.id);
    if (findHabit) {
      // Aggiorna `completedAt` solo se `justCompleted` è true
      if (justCompleted) {
        habit.completedAt = new Date().toLocaleTimeString();
      }
      await this.habitService.setHabit(findHabit);
      this.refreshService.forceRefresh();
    }
  }

  updateHabits(event: Habit[]) {
    this.events = event.map((habit) =>
      this.habitService.mapHabitToEvent(habit, this.actions)
    );
    this.cd.detectChanges();
  }
  private calculateKnobValue() {
    this.currentKnobValue = this.knobService.calculateKnobValue(
      this.events,
      this.viewDate
    );
    this.cd.detectChanges();
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

  //#endregion

  //#region Event Handling
  handleEvent(event: CustomCalendarEvent): void {
    this.router.navigate(['/tabs/edit-habit', event.id, event.idMaster]);
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
  //#endregion

  //#region Navigation & View Management
  setView(view: CustomCalendarView) {
    this.view = view;
    if (view === CustomCalendarView.Day) {
      setTimeout(() => this.scrollToCurrentHour(), 0);
    }

    switch (view) {
      case CustomCalendarView.Day:
        this.scrollToCurrentHour();
        this.calendarService.setDayView(this.switchDayView);
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

  async beforeMonthViewRender() {
    await this.loadHabits();
    this.cd.detectChanges();
  }

  async loadDayViewState() {
    const state = await this.calendarService.getDayView();
    if (state) {
      this.switchDayView = state;
      this.scrollToCurrentHour();
    }
  }
  //#endregion

  //#region Swipe Gesture
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
  async drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tabs, event.previousIndex, event.currentIndex);
    await this.tabOrderUserService.setTabOrder(this.tabs);
  }

  //#endregion

  //#region Utility Methods
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

  hideDialog(event: boolean) {
    this.visible = event;
  }

  showDialog(habit: Habit) {
    this.visible = true;
    this.currentHabit = habit;
  }

  //#endregion
}
