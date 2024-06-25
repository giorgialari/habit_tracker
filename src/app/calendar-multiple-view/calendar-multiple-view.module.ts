import { ButtonModule } from 'primeng/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarMultipleViewComponent } from './calendar-multiple-view.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BadgeModule } from 'primeng/badge';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CardModule } from 'primeng/card';
import { DragDropModule } from '@angular/cdk/drag-drop'; // Importa il modulo DragDrop

import { InputTextModule } from 'primeng/inputtext';
import { _todoHabitsViewComponent } from './_todo-habits-view/_todo-habits-view.component';
import { KnobModule } from 'primeng/knob';
import { DialogModule } from 'primeng/dialog';
import { ActualGoalModalComponent } from './actual-goal-modal/actual-goal-modal..component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalculateKnobValuePipe } from '../_shared/pipes/calculate-knob-value.pipe';
import { CalculateKnobColorPipe } from '../_shared/pipes/calculate-knob-color.pipe';
import { FormatNumberPipe } from '../_shared/pipes/format-number.pipe';
import { CommonNavigationHeaderComponentModule } from '../_shared/components/common-navigation-header/common-navigation-header.module';
import { CommonCalendarHeaderComponentModule } from '../_shared/components/common-calendar-header/common-calendar-header.module';
import { SharedModule } from '../_shared/modules/shared.module';
import { CommonCardHabitModule } from '../_shared/components/common-card-habit/common-card-habit.module';

const angularModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  DragDropModule,
];

const primeNgModules = [
  CheckboxModule,
  ButtonModule,
  DividerModule,
  BadgeModule,
  InputTextModule,
  FloatLabelModule,
  CardModule,
  KnobModule,
  DialogModule,
  InputSwitchModule
];

@NgModule({
  imports: [
    ...angularModules,
    IonicModule,
    CommonNavigationHeaderComponentModule,
    CommonCalendarHeaderComponentModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    ...primeNgModules,
    SharedModule,
    CommonCardHabitModule
  ],
  declarations: [
    CalendarMultipleViewComponent,
    _todoHabitsViewComponent,
    ActualGoalModalComponent
  ],
  exports: [
    CalendarMultipleViewComponent,
    _todoHabitsViewComponent,
    ActualGoalModalComponent,
  ],
})
export class CalendarMultipleViewComponentModule {}
