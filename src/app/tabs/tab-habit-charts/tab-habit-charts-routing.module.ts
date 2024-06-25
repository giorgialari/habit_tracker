import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabHabitChartsPage } from './tab-habit-charts.page';

const routes: Routes = [
  {
    path: '',
    component: TabHabitChartsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab3PageRoutingModule {}
