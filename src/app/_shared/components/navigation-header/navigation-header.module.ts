import { ButtonModule } from 'primeng/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NavigationHeaderComponent } from './navigation-header.component';


const primeNgModules = [
  ButtonModule
];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, ...primeNgModules],
  declarations: [NavigationHeaderComponent],
  exports: [NavigationHeaderComponent]
})
export class NavigationHeaderComponentModule { }
