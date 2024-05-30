import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabCalendarMonthPage } from './tab-calendar-multiple-view.page';

const routes: Routes = [
  {
    path: '',
    component: TabCalendarMonthPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabCalendarMonthPageRoutingModule {}
