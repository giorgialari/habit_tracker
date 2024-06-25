import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { SetupResolver } from '../_shared/resolver/setup.resolver';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../tab-dashboard/tab-dashboard.module').then(
            (m) => m.DashboardPageModule
          ),
        resolve: { setup: SetupResolver },
      },
      {
        path: 'daily-journal',
        loadChildren: () =>
          import(
            '../tab-habit-daily-journal/tab-habit-daily-journal.module'
          ).then((m) => m.TabHabitDailyJournalPageModule),
        resolve: { setup: SetupResolver },
      },
      {
        path: 'edit-habit/:id/:idMaster',
        loadChildren: () =>
          import('../tab-add-edit-habit/tab-add-edit-habit.module').then(
            (m) => m.TabAddNewPageModule
          ),
        resolve: { setup: SetupResolver },
      },
      {
        path: 'add-edit-habit',
        loadChildren: () =>
          import('../tab-add-edit-habit/tab-add-edit-habit.module').then(
            (m) => m.TabAddNewPageModule
          ),
        resolve: { setup: SetupResolver },
      },
      {
        path: 'tab3',
        loadChildren: () =>
          import('../tab3/tab3.module').then((m) => m.Tab3PageModule),
        resolve: { setup: SetupResolver },
      },
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
