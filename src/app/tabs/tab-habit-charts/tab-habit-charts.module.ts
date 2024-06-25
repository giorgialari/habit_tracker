import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabHabitChartsPage } from './tab-habit-charts.page';

import { Tab3PageRoutingModule } from './tab-habit-charts-routing.module';
import { HabitChartsComponentModule } from 'src/app/habit-charts/habit-charts.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HabitChartsComponentModule,
    Tab3PageRoutingModule
  ],
  declarations: [TabHabitChartsPage]
})
export class TabHabitChartPageModule {}
