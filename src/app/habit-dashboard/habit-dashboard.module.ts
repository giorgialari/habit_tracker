import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Custom components
import { HabitDashboardComponent } from './habit-dashboard.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarHeaderComponent } from './calendar/calendar-header/calendar-header.component';

// Routing module
import { HabitDashboardRoutingModule } from './habit-dashboard-routing.module';
import { ButtonModule } from 'primeng/button';

const angularModules = [
  CommonModule,
  ButtonModule
];

const customModules = [
  HabitDashboardRoutingModule
];

@NgModule({
  declarations: [HabitDashboardComponent, CalendarComponent, CalendarHeaderComponent],
  exports: [HabitDashboardComponent, CalendarComponent, CalendarHeaderComponent],
  imports: [
    ...angularModules,
    ...customModules
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HabitDashboardModule { }
