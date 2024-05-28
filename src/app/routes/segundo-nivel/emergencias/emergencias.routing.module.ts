import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageEnfermeriaEmergenciasComponent } from './page-enfermeria-emergencias/page-enfermeria-emergencias.component';
import { PageConsultorioEmergenciasComponent } from './page-consultorio-emergencias/page-consultorio-emergencias.component';
import { PageMedicoEmergenciasComponent } from './page-medico-emergencias/page-medico-emergencias.component';
import { PageMedicoEspecialistaComponent } from './page-medico-especialista/page-medico-especialista.component';
import { PageReporteMedicoComponent } from './page-reporte-medico/page-reporte-medico.component';

const routes: Routes = [
  { path: 'enfermeria', component: PageEnfermeriaEmergenciasComponent },
  { path: 'consultorio', component: PageConsultorioEmergenciasComponent },
  { path: 'medico', component: PageMedicoEmergenciasComponent },
  { path: 'medico-especialista', component:PageMedicoEspecialistaComponent},
  { path: 'reporte-medico', component: PageReporteMedicoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmergenciasRoutingModule {}