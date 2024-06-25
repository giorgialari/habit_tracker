import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabHabitDailyJournalPage } from './tab-habit-daily-journal.page';

const routes: Routes = [
  {
    path: '',
    component: TabHabitDailyJournalPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabHabitDailyJournalPageRoutingModule {}
