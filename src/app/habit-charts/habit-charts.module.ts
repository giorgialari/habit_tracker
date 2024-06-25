import { ButtonModule } from 'primeng/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HabitChartsComponent } from './habit-charts.component';
import { PanelModule } from 'primeng/panel';
import { ChartModule } from 'primeng/chart';

const primeNgModule = [PanelModule, ChartModule];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ButtonModule,
    ...primeNgModule,
  ],
  declarations: [HabitChartsComponent],
  exports: [HabitChartsComponent],
})
export class HabitChartsComponentModule {}
