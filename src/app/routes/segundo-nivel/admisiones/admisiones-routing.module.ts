import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageDuplicadosComponent } from './page-duplicados/page-duplicados.component';
import { PageReprogramacionComponent } from './page-reprogramacion/page-reprogramacion.component';

const routes: Routes = [
  { path: 'duplicados', component: PageDuplicadosComponent },
  { path: 'reprogramacion', component: PageReprogramacionComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AdmisionesRoutingModule { }
