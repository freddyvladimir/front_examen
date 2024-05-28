import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagePorHospitalComponent } from './page-por-hospital/page-por-hospital.component';
import { PageServicioEmergenciasComponent } from './page-servicio-emergencias/page-servicio-emergencias.component';

const routes: Routes = [
  { path: 'por-hospital', component: PagePorHospitalComponent},
  { path: 'servicio-emergencias', component: PageServicioEmergenciasComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesGamlpRoutingModule { }


