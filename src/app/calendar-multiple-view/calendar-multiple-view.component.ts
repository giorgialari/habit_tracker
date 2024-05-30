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
  CalendarView,
} from 'angular-calendar';
import { Habit } from '../habit-dashboard/_models/habits.interface';
import { HabitService } from '../_shared/services/habit.service';
import { Gesture, GestureController } from '@ionic/angular';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-calendar-multiple-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './calendar-multiple-view.component.html',
  styleUrls: ['./calendar-multiple-view.component.scss', './_month.component.scss'],
})
export class CalendarMultipleViewComponent implements OnInit, AfterViewChecked {
  @ViewChild('swipeContainer', { static: true }) swipeContainer!: ElementRef;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

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

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;


  constructor(
    private habitService: HabitService,
    private gestureCtrl: GestureController,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef) {
    this.loadHabits();
  }
  ngAfterViewChecked() {
    this.activeDayIsOpen = this.events.length > 0;
    this.cd.detectChanges();
    console.log('ngAfterViewChecked activeDayIsOpen', this.activeDayIsOpen);
    console.log('ngAfterViewChecked events', this.events);
  }
  ngOnInit() {
    this.setupSwipeGesture();

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
      color: habit.color, // Puoi mappare `habit.color` se definisci colori personalizzati
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
      console.log('dayClicked activeDayIsOpen', this.activeDayIsOpen);
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

  setView(view: CalendarView) {
    this.view = view;
    if (view === CalendarView.Day) {
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
    console.log('closeOpenMonthViewDay activeDayIsOpen', this.activeDayIsOpen);
  }
}
