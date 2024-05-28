import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { CentroMonitoreoRoutingModule } from './centro-monitoreo-routing.module';

import { MonitoreoComponent } from '../centro-monitoreo/monitoreo/monitoreo.component';
import { PantallaComponent } from '../centro-monitoreo/pantalla/pantalla.component';
import { MapaMonitoreoComponent } from './componentes/mapa-monitoreo/mapa-monitoreo.component';
import { AbmCie10Component } from './abm-cie10/abm-cie10.component';
import { DialogCrudComponent } from './abm-cie10/dialog-crud/dialog-crud.component';
import { FormularioAtencionComponent } from './componentes/formulario-atencion/formulario-atencion.component';
import { DialogSolicitudComponent } from './monitoreo/dialog-solicitud/dialog-solicitud.component';
import { AtencionComponent } from './atencion/atencion.component';
import { DialigAtencionComponent } from './atencion/dialig-atencion/dialig-atencion.component';
import { ReporteGeneralComponent } from './reporte-general/reporte-general.component';
import { PacientesRegistradosComponent } from './pacientes-registrados/pacientes-registrados.component';
import { DialogAtencionHospitalComponent } from './atencion/dialog-atencion-hospital/dialog-atencion-hospital.component';

const COMPONENTS: any[] = [
  MonitoreoComponent,
  PantallaComponent,
  MapaMonitoreoComponent,
  AbmCie10Component
];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    CentroMonitoreoRoutingModule
  ],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC, DialogCrudComponent, FormularioAtencionComponent, DialogSolicitudComponent, AtencionComponent, DialigAtencionComponent, ReporteGeneralComponent, PacientesRegistradosComponent, DialogAtencionHospitalComponent],
})
export class CentroMonitoreoModule {}
