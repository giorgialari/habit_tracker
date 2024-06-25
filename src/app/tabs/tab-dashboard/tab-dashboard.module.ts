import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HabitDashboardModule } from '../../habit-dashboard/habit-dashboard.module';
import { DashboardPageRoutingModule } from './tab-dashboard.routing.module';
import { DashboardPage } from './tab-dashboard.page';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DashboardPageRoutingModule,
    HabitDashboardModule,
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule { }
