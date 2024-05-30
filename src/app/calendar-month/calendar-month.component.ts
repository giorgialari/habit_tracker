import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  AfterViewChecked,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
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
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-calendar-month',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './calendar-month.component.html',
  styleUrls: ['./calendar-month.component.scss', './_month.component.scss'],
})
export class CalendarMonthComponent implements AfterViewChecked {
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


  constructor(private habitService: HabitService) {
    this.loadHabits();
  }
  ngAfterViewChecked() {
    this.changeDateWithOnlyNumber();
  }

  private changeDateWithOnlyNumber() {
    const dateElements = document.querySelectorAll('.cal-week-view .cal-day-headers span');
    dateElements.forEach((element) => {
      const dateText = element.textContent || '';
      const dateNumber = dateText.slice(-2); // Prende gli ultimi due caratteri
      element.setAttribute('data-day', dateNumber);
    });
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
    }
  }
  dayHeaderClicked({ day, sourceEvent }: { day: any; sourceEvent: MouseEvent }): void {
    const date = day.date; // Ottieni la data dal giorno
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        this.events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
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

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
    this.changeDateWithOnlyNumber();
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
