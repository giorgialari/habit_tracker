import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabAddNewPage } from './tab-add-edit-habit.page';

const routes: Routes = [
  {
    path: '',
    component: TabAddNewPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabAddNewPageRoutingModule {}
