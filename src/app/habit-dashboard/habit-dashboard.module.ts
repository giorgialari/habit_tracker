import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Custom components
import { HabitDashboardComponent } from './habit-dashboard.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarHeaderComponent } from './calendar/calendar-header/calendar-header.component';
import { MyHabitsComponent } from './my-habits/my-habits.component';

// Routing module
import { HabitDashboardRoutingModule } from './habit-dashboard-routing.module';
import { AddNewHabitComponent } from './add-new-habit/add-new-habit.component';


//PrimeNG
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';

const angularModules = [
  CommonModule,
  FormsModule,
];

const primeNgModules = [
  CheckboxModule,
  ButtonModule,
  DividerModule,
  BadgeModule
];

const customModules = [
  HabitDashboardRoutingModule
];

@NgModule({
  declarations: [
    HabitDashboardComponent,
    CalendarComponent,
    CalendarHeaderComponent,
    MyHabitsComponent,
    AddNewHabitComponent
  ],
  exports: [
    HabitDashboardComponent,
    CalendarComponent,
    CalendarHeaderComponent,
    MyHabitsComponent,
    AddNewHabitComponent
  ],
  imports: [
    ...angularModules,
    ...primeNgModules,
    ...customModules
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HabitDashboardModule { }
