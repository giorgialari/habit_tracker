import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabCalendarMonthPageRoutingModule } from './tab-calendar-multiple-view-routing.module';

import { TabCalendarMonthPage } from './tab-calendar-multiple-view.page';
import { CalendarMultipleViewComponentModule } from '../calendar-multiple-view/calendar-multiple-view.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabCalendarMonthPageRoutingModule,
    CalendarMultipleViewComponentModule
  ],
  declarations: [TabCalendarMonthPage]
})
export class TabCalendarMonthPageModule {}
