import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TabAddNewPageRoutingModule } from './tab-add-edit-habit-routing.module';
import { TabAddNewPage } from './tab-add-edit-habit.page';
import { AddEditHabitComponentModule } from '../add-edit-habit/add-edit-habit.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    // ExploreContainerComponentModule,
    AddEditHabitComponentModule,
    TabAddNewPageRoutingModule
  ],
  declarations: [TabAddNewPage]
})
export class TabAddNewPageModule { }
