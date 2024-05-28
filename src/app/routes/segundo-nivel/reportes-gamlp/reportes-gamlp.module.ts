import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesGamlpRoutingModule } from './reportes-gamlp-routing.module';
import { PagePorHospitalComponent } from './page-por-hospital/page-por-hospital.component';
import { SharedModule } from '@shared/shared.module';
//import { MatTableExporterModule } from 'mat-table-exporter';
import { DialogPorHospitalEspecialidadComponent } from './page-por-hospital/dialog-por-hospital-especialidad/dialog-por-hospital-especialidad.component';
import { DialogPorHospitalEspecialidadMedicoComponent } from './page-por-hospital/dialog-por-hospital-especialidad-medico/dialog-por-hospital-especialidad-medico.component';
//import { SignosVitalesModule } from '../../componentes/signos-vitales/signos-vitales.module';
///import { SignosVitalesComModule } from '../../componentes/signos-vitales-com/signos-vitales-com.module';
import { PageServicioEmergenciasComponent } from './page-servicio-emergencias/page-servicio-emergencias.component';


@NgModule({
  declarations: [
    PagePorHospitalComponent,
    DialogPorHospitalEspecialidadComponent,
    DialogPorHospitalEspecialidadMedicoComponent,
    PageServicioEmergenciasComponent
  ],
  imports: [
    CommonModule,
    ReportesGamlpRoutingModule,
    SharedModule,
    //MatTableExporterModule,
    //SignosVitalesModule,
    //SignosVitalesComModule
  ]
})
export class ReportesGamlpModule { }
