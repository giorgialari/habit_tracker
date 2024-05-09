import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-habit-dashboard',
  templateUrl: './habit-dashboard.component.html',
  styleUrls: ['./habit-dashboard.component.scss'],
})
export class HabitDashboardComponent implements OnInit {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;

  currentDate = new Date();
  weekDays: any = [];
  currentMonth: string = '';

  constructor() {
    this.loadWeekDays();

  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    const swiperEl = this.swiperContainer.nativeElement;
    swiperEl.addEventListener('swiperSlideChange', () => {
      this.updateCurrentMonth();
      console.log('swiperSlideChange');
    });
  }
  updateCurrentMonth() {
    const swiperEl = this.swiperContainer.nativeElement;
    const activeSlideIndex = swiperEl.swiper.activeIndex;
    const activeSlideDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      this.weekDays[activeSlideIndex].date
    );
    this.currentMonth = activeSlideDate.toLocaleString('default', { month: 'long' });
  }
  loadWeekDays() {
    const today = new Date();
    const startOfWeek = this.getStartOfWeek(today);
    const weeksToShow = 52;
    const numDays = weeksToShow * 7;

    this.weekDays = Array.from({ length: numDays }).map((_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + index);
      return {
        date: date.getDate(),
        name: date.toLocaleDateString('en-US', { weekday: 'long' })
      };
    });

    // Imposta il mese corrente in base alla data della prima settimana
    const firstWeekDay = this.weekDays[0];
    const firstWeekDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), firstWeekDay.date);
    // this.currentMonth = firstWeekDate.toLocaleString('default', { month: 'long' });
  }

  getStartOfWeek(date: any) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(date.setDate(diff));
  }
}
