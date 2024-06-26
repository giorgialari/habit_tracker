import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

import { CommonCalendarHeaderComponentModule } from '../_shared/components/common-calendar-header/common-calendar-header.module';
import { CommonCardHabitModule } from '../_shared/components/common-card-habit/common-card-habit.module';
import { SettingsComponent } from './settings.component';
import { SettingsRountingModule } from './settings-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ButtonModule,
    CommonCalendarHeaderComponentModule,
    SettingsRountingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    SharedModule,
    CommonCardHabitModule,
  ],
  declarations: [SettingsComponent],
  exports: [SettingsComponent],
})
export class SettingsComponentModule {}
