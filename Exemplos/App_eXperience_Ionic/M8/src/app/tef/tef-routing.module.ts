import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TefPage } from './tef.page';

const routes: Routes = [
  {
    path: '',
    component: TefPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TefPageRoutingModule {}
