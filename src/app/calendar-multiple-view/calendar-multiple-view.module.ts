import { ButtonModule } from 'primeng/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarMultipleViewComponent } from './calendar-multiple-view.component';
import { NavigationHeaderComponentModule } from '../_shared/components/navigation-header/navigation-header.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';


const primeNgModules = [
  ButtonModule
];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule,
    NavigationHeaderComponentModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    ...primeNgModules],
  declarations: [CalendarMultipleViewComponent],
  exports: [CalendarMultipleViewComponent]
})
export class CalendarMultipleViewComponentModule { }
