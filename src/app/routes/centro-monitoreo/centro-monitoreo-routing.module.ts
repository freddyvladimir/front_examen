import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonitoreoComponent } from '../centro-monitoreo/monitoreo/monitoreo.component';
import { PantallaComponent } from '../centro-monitoreo/pantalla/pantalla.component';
import { AbmCie10Component } from './abm-cie10/abm-cie10.component';
import { AtencionComponent } from './atencion/atencion.component';
import { ReporteGeneralComponent } from './reporte-general/reporte-general.component';
import { PacientesRegistradosComponent } from './pacientes-registrados/pacientes-registrados.component';

const routes: Routes = [
  { path: 'atencion', component: AtencionComponent },
  { path: 'monitoreo', component: MonitoreoComponent },
  { path: 'pantalla', component: PantallaComponent },
  { path: 'abmcie10', component: AbmCie10Component },
  { path: 'reportegenerar', component: ReporteGeneralComponent },
  { path: 'registropacientes', component: PacientesRegistradosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CentroMonitoreoRoutingModule {}
