import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { ButtonModule } from 'primeng/button';

//PrimeNG modules


const primeNgModules = [
  ButtonModule
]

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    ...primeNgModules
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
