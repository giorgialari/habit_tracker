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
} from '@angular/core';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject, Subscription } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
} from 'angular-calendar';
import { Habit } from '../habit-dashboard/_models/habits.interface';
import { HabitService } from '../_shared/services/habit.service';
import { Gesture, GestureController } from '@ionic/angular';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TabUserOrderService } from '../_shared/services/tab-user-order.service';
import { collapseAnimation } from 'angular-calendar';
import { Router } from '@angular/router';
import { RefreshService } from '../_shared/services/refresh-trigger.service';

export enum CustomCalendarView {
  Month = 'month',
  Week = 'week',
  Day = 'day',
}

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
export class CalendarMultipleViewComponent implements OnInit, OnDestroy {
  @ViewChild('swipeContainer', { static: true }) swipeContainer!: ElementRef;

  view: CustomCalendarView = CustomCalendarView.Month;

  CalendarView = CustomCalendarView;

  viewDate: Date = new Date();

  actions: CalendarEventAction[] = [
    {
      label: '<span class="material-icons">edit</span>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent(event);
      },
    },
  ];

  tabs = [
    {
      id: 1,
      label: 'Day',
      view: CustomCalendarView.Day,
      icon: 'today',
    },
    {
      id: 2,
      label: 'Month',
      view: CustomCalendarView.Month,
      icon: 'calendar_month',
    },
    {
      id: 3,
      label: 'ToDo',
      view: CustomCalendarView.Week,
      icon: 'check',
    },
  ];

  refresh: Subject<any> = new Subject();
  refreshComponentTriggerSubscription = new Subscription();
  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = false;

  constructor(
    private habitService: HabitService,
    private gestureCtrl: GestureController,
    private renderer: Renderer2,
    private tabOrderUserService: TabUserOrderService,
    private refreshService: RefreshService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}
  async ngOnInit() {
    await this.loadTabs();

    this.setupSwipeGesture();

    this.refreshComponentTriggerSubscription = this.refreshService
      .getRefreshTrigger()
      .subscribe(async () => {
        await this.loadHabits();
        this.refreshView();
        this.cd.detectChanges();
      });
  }
  async beforeMonthViewRender() {
    await this.loadHabits();
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

  private async loadHabits() {
    const habits: Habit[] = await this.habitService.getAllHabits();
    this.events = habits.map((habit) => this.mapHabitToEvent(habit));
  }
  private mapHabitToEvent = (habit: Habit): CalendarEvent => {
    return {
      id: habit.id,
      idMaster: habit.idMaster,
      category: habit.category,
      start: new Date(habit.startDate),
      end: habit.endDate ? new Date(habit.endDate) : undefined,
      title: habit.title,
      color: habit.color,
      actions: this.actions,
      allDay: habit.allDay,
      draggable: false,
      resizable: {
        beforeStart: false,
        afterEnd: false,
      },
    } as CalendarEvent;
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
    });
  }

  handleEvent(event: CalendarEvent): void {
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
        // this.viewDate = new Date();
        break;
      case CustomCalendarView.Week:
        this.viewDate = new Date();
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
    this.refreshView();
  }

  goToPreviousView() {
    this.addSwipeClass('right');
    if (this.view === CustomCalendarView.Day) {
      this.viewDate = this.addOneDay(this.viewDate, -1);
    } else if (this.view === CustomCalendarView.Month) {
      this.viewDate = this.addMonths(this.viewDate, -1);
    }
    this.closeOpenMonthViewDay();
    this.refreshView();
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

  refreshView() {
    this.refresh.next({});
    this.cd.detectChanges();
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


  ngOnDestroy(): void {
    this.refreshComponentTriggerSubscription.unsubscribe();
  }

  doSomethingWithCurrentValue(value: any) {
    console.  log(value);
  }
  getOverlayStyle() {
    const isSemi =true;
    const transform = (isSemi ? '' : 'translateY(-50%) ') + 'translateX(-50%)';

    return {
      top: isSemi ? 'auto' : '50%',
      bottom: isSemi ? '5%' : 'auto',
      left: '50%',
      transform,
      fontSize: 125 / 3.5 + 'px',
    };
  }
}
