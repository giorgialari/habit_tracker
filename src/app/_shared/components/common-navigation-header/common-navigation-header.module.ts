import { ButtonModule } from 'primeng/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CommonNavigationHeaderComponent } from './common-navigation-header.component';


const primeNgModules = [
  ButtonModule
];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, ...primeNgModules],
  declarations: [CommonNavigationHeaderComponent],
  exports: [CommonNavigationHeaderComponent]
})
export class CommonNavigationHeaderComponentModule { }
