import { ButtonModule } from 'primeng/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarMultipleViewComponent } from './calendar-multiple-view.component';
import { NavigationHeaderComponentModule } from '../_shared/components/navigation-header/navigation-header.module';
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
    NavigationHeaderComponentModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    ...primeNgModules,
  ],
  declarations: [
    CalendarMultipleViewComponent,
    _todoHabitsViewComponent,
    ActualGoalModalComponent,
    CalculateKnobValuePipe,
    CalculateKnobColorPipe,
    FormatNumberPipe
  ],
  exports: [
    CalendarMultipleViewComponent,
    _todoHabitsViewComponent,
    ActualGoalModalComponent,
  ],
})
export class CalendarMultipleViewComponentModule {}
