import { ButtonModule } from 'primeng/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEditHabitComponent } from './add-edit-habit.component';
import { BadgeModule } from 'primeng/badge';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { NavigationHeaderComponentModule } from '../_shared/components/navigation-header/navigation-header.module';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDeleteModalComponent } from './confirm-delete-modal/confirm-delete-modal.component';
import { TooltipModule } from 'primeng/tooltip';

const primeNgModules = [
  CheckboxModule,
  ButtonModule,
  DividerModule,
  BadgeModule,
  InputTextModule,
  FloatLabelModule,
  CalendarModule,
  DropdownModule,
  ColorPickerModule,
  InputSwitchModule,
  InputNumberModule,
  DialogModule,
  TooltipModule
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NavigationHeaderComponentModule,
    ...primeNgModules,
  ],
  declarations: [AddEditHabitComponent, ConfirmDeleteModalComponent],
  exports: [AddEditHabitComponent],
})
export class AddEditHabitComponentModule {}
