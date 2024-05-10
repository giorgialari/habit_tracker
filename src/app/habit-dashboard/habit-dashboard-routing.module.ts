import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HabitDashboardComponent } from './habit-dashboard.component';
import { AddNewHabitComponent } from './add-new-habit/add-new-habit.component';

const routes: Routes = [
  {
    path: '',
    component: HabitDashboardComponent
  },
  {
    path: 'add-new-habit',
    component: AddNewHabitComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HabitDashboardRoutingModule { }
