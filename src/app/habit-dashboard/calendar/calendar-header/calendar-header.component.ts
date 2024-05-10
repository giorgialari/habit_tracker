import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarService } from '../../_services/calendar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarHeaderComponent implements OnInit, OnDestroy {
  numberOfDay: any = 0;
  dayOfWeek: any = '';
  currentMonth = '';
  private calendarServiceSubscription: Subscription = new Subscription();

  constructor(private calendarService: CalendarService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.calendarServiceSubscription = this.calendarService.selectedDate.subscribe(date => {
      this.numberOfDay = date.number === 0 ? 'Oggi' : date.number;
      this.dayOfWeek = date.dayOfWeek;
      this.currentMonth = date.month;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.calendarServiceSubscription) {
      this.calendarServiceSubscription.unsubscribe();
    }
  }
}
