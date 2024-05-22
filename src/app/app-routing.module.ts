import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PreventSetupGuard } from './_shared/guards/prevent-setup.guard'; // Importa la nuova guardia

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>  import('./setup/setup.module').then(m => m.SetupComponentModule),
    canActivate: [PreventSetupGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
