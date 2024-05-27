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
        loadChildren: () => import('../tab-dashboard/tab-dashboard.module').then(m => m.DashboardPageModule),
        resolve: { setup: SetupResolver } // Usa il resolver per la rotta dashboard
      },
      {
        path: 'calendar-month',
        loadChildren: () => import('../tab-calendar-month/tab-calendar-month.module').then( m => m.TabCalendarMonthPageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule),
        resolve: { setup: SetupResolver }
      },
      {
        path: 'edit-habit/:id',
        loadChildren: () => import('../tab-add-new/tab-add-new.module').then(m => m.TabAddNewPageModule),
        resolve: { setup: SetupResolver }
      },
      {
        path: 'add-new',
        loadChildren: () => import('../tab-add-new/tab-add-new.module').then(m => m.TabAddNewPageModule),
        resolve: { setup: SetupResolver }
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule),
        resolve: { setup: SetupResolver }
      },
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
