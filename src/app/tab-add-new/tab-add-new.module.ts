import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TabAddNewPageRoutingModule } from './tab-add-new-routing.module';
import { TabAddNewPage } from './tab-add-new.page';
import { AddNewComponentModule } from '../add-new/add-new.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    // ExploreContainerComponentModule,
    AddNewComponentModule,
    TabAddNewPageRoutingModule
  ],
  declarations: [TabAddNewPage]
})
export class TabAddNewPageModule { }
