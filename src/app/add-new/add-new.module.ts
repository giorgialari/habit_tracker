import { ButtonModule } from 'primeng/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddNewComponent } from './add-new.component';
import { BadgeModule } from 'primeng/badge';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

const primeNgModules = [
  CheckboxModule,
  ButtonModule,
  DividerModule,
  BadgeModule,
  InputTextModule,
  FloatLabelModule,
  CalendarModule,
  DropdownModule
];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, ButtonModule, ...primeNgModules],
  declarations: [AddNewComponent],
  exports: [AddNewComponent]
})
export class AddNewomponentModule { }
