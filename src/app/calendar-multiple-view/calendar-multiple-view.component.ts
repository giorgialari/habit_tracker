import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  AfterViewChecked,
  ViewChild,
  ElementRef,
  OnInit,
  ChangeDetectorRef,
  Renderer2,
} from '@angular/core';
import {
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { Subject } from 'rxjs';
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

export enum CustomCalendarView {
  Month = "month",
  Week = "week",
  Day = "day"
}

@Component({
  selector: 'app-calendar-multiple-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './calendar-multiple-view.component.html',
  styleUrls: ['./calendar-multiple-view.component.scss', './_month.component.scss'],
})
export class CalendarMultipleViewComponent implements OnInit, AfterViewChecked {
  @ViewChild('swipeContainer', { static: true }) swipeContainer!: ElementRef;

  view: CustomCalendarView = CustomCalendarView.Month;

  CalendarView = CustomCalendarView;

  viewDate: Date = new Date();

  actions: CalendarEventAction[] = [
    {
      label: '<span class="material-icons">edit</span>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<span class="material-icons">delete</span>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  tabs = [
    { id: 1, label: 'Day', view: CustomCalendarView.Day },
    { id: 2, label: 'Month', view: CustomCalendarView.Month },
    { id: 3, label: 'ToDo', view: CustomCalendarView.Week }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;


  constructor(
    private habitService: HabitService,
    private gestureCtrl: GestureController,
    private renderer: Renderer2,
    private tabOrderUserService: TabUserOrderService,
    private cd: ChangeDetectorRef) {
    this.loadHabits();
  }
  async ngOnInit() {

    await this.loadTabs();

    this.setupSwipeGesture();
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
    console.log('tabs', this.tabs);
  }

  ngAfterViewChecked() {
    this.activeDayIsOpen = this.events.filter(event => isSameDay(event.start, this.viewDate)).length > 0;

  }

  private async loadHabits() {
    const habits: Habit[] = await this.habitService.getAllHabits();
    this.events = habits.map(habit => this.mapHabitToEvent(habit));
    this.refresh.next({});
  }
  private mapHabitToEvent = (habit: Habit): CalendarEvent => {
    return {
      id: habit.id,
      start: new Date(habit.startDate),
      end: habit.endDate ? new Date(habit.endDate) : undefined,
      title: habit.title,
      color: habit.color, 
      actions: this.actions,
      allDay: false,
      draggable: false,
      resizable: {
        beforeStart: false,
        afterEnd: false,
      },
    };
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
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log('handleEvent', action, event);
    // this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CustomCalendarView) {
    this.view = view;
    if (view === CustomCalendarView.Day) {
      setTimeout(() => this.scrollToCurrentHour(), 0);
    }
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
      onMove: detail => {
      },
      onEnd: detail => {
        if (detail.velocityX > 0.3) {
          this.goToPreviousView(); // Swipe right
        } else if (detail.velocityX < -0.3) {
          this.goToNextView(); // Swipe left
        }
      }
    });

    gesture.enable(true);
  }

  goToNextView() {
    this.addSwipeClass('left');
    this.viewDate = this.addMonths(this.viewDate, 1);
    this.closeOpenMonthViewDay();
    this.refreshView();
  }

  goToPreviousView() {
    this.addSwipeClass('right');
    this.viewDate = this.addMonths(this.viewDate, -1);
    this.closeOpenMonthViewDay();
    this.refreshView();
  }

  addMonths(date: Date, months: number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  }

  refreshView() {
    this.refresh.next({});
    this.cd.detectChanges(); // Forza il rilevamento dei cambiamenti
  }

  addSwipeClass(direction: string) {
    const element = this.swipeContainer.nativeElement;
    this.renderer.addClass(element, `swipe-${direction}`);
    setTimeout(() => {
      this.renderer.removeClass(element, `swipe-${direction}`);
    }, 100); // La durata dell'animazione deve corrispondere a quella definita in CSS
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  async drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tabs, event.previousIndex, event.currentIndex);
    await this.tabOrderUserService.setTabOrder(this.tabs);
  }

}
