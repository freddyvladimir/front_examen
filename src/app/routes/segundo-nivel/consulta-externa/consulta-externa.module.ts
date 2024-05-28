import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ConsultaExternaRoutingModule } from './consulta-externa-routing.module';

import { PageAdmisionesComponent } from './page-admisiones/page-admisiones.component';
import { PageCajasComponent } from './page-cajas/page-cajas.component';
import { PageConsultorioComponent } from './page-consultorio/page-consultorio.component';
import { PageEnfermeriaComponent } from './page-enfermeria/page-enfermeria.component';
import { ReservarFichaComponent } from './componentes/reservar-ficha/reservar-ficha.component';
import { PageKardexComponent } from './page-kardex/page-kardex.component';
import { DialogHistoricoAtencionesComponent } from './page-kardex/dialog-historico-atenciones/dialog-historico-atenciones.component';
import { SignosVitalesComponent } from './componentes/signos-vitales/signos-vitales.component';
import { PageRevertirFichaComponent } from './page-revertir-ficha/page-revertir-ficha.component';
import { DialogAdvertenciaComponent } from './page-revertir-ficha/dialog-advertencia/dialog-advertencia.component';
import { PageHojaReferenciaComponent } from './page-hoja-referencia/page-hoja-referencia.component';
import { PageBuscarFichaComponent } from './page-buscar-ficha/page-buscar-ficha.component';
import { BuscarPacienteModule } from '../../componentes/buscar-paciente/buscar-paciente.module';
import { RegistroPacienteComponent } from './componentes/registro-paciente/registro-paciente.component';
import { ReservaEmergenciasComponent } from './componentes/reserva-emergencias/reserva-emergencias.component';
import { AsignacionHemodialisisComponent } from './componentes/asignacion-hemodialisis/asignacion-hemodialisis.component';

import { FichasModule } from '../../componentes/fichas/fichas.module';
import { DatosPacientesModule } from '../../componentes/datos-pacientes/datos-pacientes.module';
import { RenderComponent } from './componentes/render/render.component';

const COMPONENTS: any[] = [
  PageAdmisionesComponent,
  PageCajasComponent,
  ReservarFichaComponent,
  PageConsultorioComponent,
  PageEnfermeriaComponent,
  PageKardexComponent,
  PageRevertirFichaComponent,
  PageKardexComponent,
  DialogHistoricoAtencionesComponent,
  SignosVitalesComponent,
  PageRevertirFichaComponent,
  DialogAdvertenciaComponent,
  PageHojaReferenciaComponent,
  PageBuscarFichaComponent,
  RegistroPacienteComponent,
  ReservaEmergenciasComponent,
  AsignacionHemodialisisComponent
];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [
    SharedModule,
    ConsultaExternaRoutingModule,
    BuscarPacienteModule,
    FichasModule,
    DatosPacientesModule
  ],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC, RenderComponent],
})
export class ConsultaExternaModule { }
