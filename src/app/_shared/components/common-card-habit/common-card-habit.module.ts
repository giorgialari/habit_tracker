import { ButtonModule } from 'primeng/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CommonCardHabitComponent } from './common-card-habit.component';
import { CardModule } from 'primeng/card';
import { KnobModule } from 'primeng/knob';
import { SharedModule } from '../../modules/shared.module';

const primeNgModules = [ButtonModule, CardModule, KnobModule];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ...primeNgModules,
    SharedModule,
  ],
  declarations: [CommonCardHabitComponent],
  exports: [CommonCardHabitComponent],
})
export class CommonCardHabitModule {}
