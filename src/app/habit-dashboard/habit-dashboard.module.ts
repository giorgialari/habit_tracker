import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Custom components
import { HabitDashboardComponent } from './habit-dashboard.component';

// Routing module
import { HabitDashboardRoutingModule } from './habit-dashboard-routing.module';

const angularModules = [
  CommonModule
];

const customModules = [
  HabitDashboardRoutingModule
];

@NgModule({
  declarations: [HabitDashboardComponent],
  exports: [HabitDashboardComponent],
  imports: [
    ...angularModules,
    ...customModules
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HabitDashboardModule { }