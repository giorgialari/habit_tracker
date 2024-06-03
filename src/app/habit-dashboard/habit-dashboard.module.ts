import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Custom components
import { HabitDashboardComponent } from './habit-dashboard.component';

// Routing module
import { HabitDashboardRoutingModule } from './habit-dashboard-routing.module';


//PrimeNG
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarMultipleViewComponentModule } from '../calendar-multiple-view/calendar-multiple-view.module';

const angularModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule
];

const primeNgModules = [
  CheckboxModule,
  ButtonModule,
  DividerModule,
  BadgeModule,
  InputTextModule,
  FloatLabelModule,
];

const customModules = [
  HabitDashboardRoutingModule,
  CalendarMultipleViewComponentModule
];

@NgModule({
  declarations: [
    HabitDashboardComponent,
  ],
  exports: [
    HabitDashboardComponent,
  ],
  imports: [
    ...angularModules,
    ...primeNgModules,
    ...customModules
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HabitDashboardModule { }
