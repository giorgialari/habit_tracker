import { ButtonModule } from 'primeng/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HabitDailyJournalComponent } from './habit-daily-journal.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CommonCalendarHeaderComponentModule } from '../_shared/components/common-calendar-header/common-calendar-header.module';
import { KnobModule } from 'primeng/knob';

import { CardModule } from 'primeng/card';
import { SharedModule } from '../_shared/modules/shared.module';
import { CommonCardHabitModule } from '../_shared/components/common-card-habit/common-card-habit.module';

const primeNgModules = [KnobModule, CardModule];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ButtonModule,
    CommonCalendarHeaderComponentModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    ...primeNgModules,
    SharedModule,
    CommonCardHabitModule,
  ],
  declarations: [HabitDailyJournalComponent],
  exports: [HabitDailyJournalComponent],
})
export class HabitDailyJournalComponentModule {}
