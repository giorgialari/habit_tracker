import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabCalendarMonthPageRoutingModule } from './tab-calendar-month-routing.module';

import { TabCalendarMonthPage } from './tab-calendar-month.page';
import { CalendarMonthComponentModule } from '../calendar-month/calendar-month.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabCalendarMonthPageRoutingModule,
    CalendarMonthComponentModule
  ],
  declarations: [TabCalendarMonthPage]
})
export class TabCalendarMonthPageModule {}
