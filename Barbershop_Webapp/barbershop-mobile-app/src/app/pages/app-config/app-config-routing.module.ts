import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppConfigPage } from './app-config.page';

const routes: Routes = [
  {
    path: '',
    component: AppConfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppConfigPageRoutingModule {}
