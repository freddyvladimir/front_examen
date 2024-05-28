import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageDispensadorComponent } from './page-dispensador/page-dispensador.component';
import { PageMonitorComponent } from './page-monitor/page-monitor.component';
import { PageAdministracionComponent } from './page-administracion/page-administracion.component';

const routes: Routes = [
  { path: 'dispensador', component: PageDispensadorComponent },
  { path: 'monitor', component: PageMonitorComponent },
  { path: 'administracion', component: PageAdministracionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FichasRoutingModule {}
