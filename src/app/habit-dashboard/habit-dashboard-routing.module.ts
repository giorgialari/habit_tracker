import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HabitDashboardComponent } from './habit-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: HabitDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HabitDashboardRoutingModule { }
