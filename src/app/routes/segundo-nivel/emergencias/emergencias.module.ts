import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { EmergenciasRoutingModule } from './emergencias.routing.module';

import { DatosPacientesModule } from 'app/routes/componentes/datos-pacientes/datos-pacientes.module';
import { PageEnfermeriaEmergenciasComponent } from './page-enfermeria-emergencias/page-enfermeria-emergencias.component';
import { PageConsultorioEmergenciasComponent } from './page-consultorio-emergencias/page-consultorio-emergencias.component';
import { PageMedicoEspecialistaComponent } from './page-medico-especialista/page-medico-especialista.component';
import { PageMedicoEmergenciasComponent } from './page-medico-emergencias/page-medico-emergencias.component';
import { PageReporteMedicoComponent } from './page-reporte-medico/page-reporte-medico.component';

import { ConsultaEmergenciaComponent } from './componentes/consulta-emergencia/consulta-emergencia.component';
import { EvolucionOrdenesMedicasComponent } from './componentes/evolucion-ordenes-medicas/evolucion-ordenes-medicas.component';
import { DatosPacienteComponent } from './componentes/datos-paciente/datos-paciente.component';
import { AtencionEnfermeriaComponent } from './componentes/atencion-enfermeria/atencion-enfermeria.component';
import { SignosVitalesComponent } from 'app/routes/componentes/signos-vitales/signos-vitales.component';

import { ExamenesComplementariosComponent } from './componentes/examenes-complementarios/examenes-complementarios.component';
import { DialogReservaFichasComponent } from './componentes/examenes-complementarios/dialog-reserva-fichas/dialog-reserva-fichas.component';
import { ValoracionEspecialidadComponent } from './componentes/valoracion-especialidad/valoracion-especialidad.component';
import { DialogDerivarEspecialidadComponent } from './componentes/valoracion-especialidad/dialog-derivar-especialidad/dialog-derivar-especialidad.component';
import { DialogEvolucionOrdenesMedicasComponent } from './componentes/evolucion-ordenes-medicas/dialog-evolucion-ordenes-medicas/dialog-evolucion-ordenes-medicas.component';
import { PageCie10Component } from './page-consultorio-emergencias/page-cie10/page-cie10.component';
import { PageAdministracionComponent } from '../servicios-complementarios/page-administracion/page-administracion.component';
import { ServiciosComplementariosListaComponent } from '../servicios-complementarios/componentes/servicios-complementarios-lista/servicios-complementarios-lista.component';
import { ServiciosComplementariosListaMedicoComponent } from '../servicios-complementarios/componentes/servicios-complementarios-lista-medico/servicios-complementarios-lista-medico.component';
import { DialogButtomComponent } from '../servicios-complementarios/componentes/servicios-complementarios-lista/dialog-buttom/dialog-buttom.component';
import { DialogoServiciosComplementariosComponent } from '../servicios-complementarios/componentes/servicios-complementarios-lista-medico/dialogo-servicios-complementarios/dialogo-servicios-complementarios.component';




const COMPONENTS: any[] = [
  PageEnfermeriaEmergenciasComponent,
  PageConsultorioEmergenciasComponent,
  PageMedicoEmergenciasComponent,
  PageReporteMedicoComponent,
  DatosPacienteComponent,
  AtencionEnfermeriaComponent,
  SignosVitalesComponent,
  ExamenesComplementariosComponent,
  ValoracionEspecialidadComponent
];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  declarations: [
    ...COMPONENTS, 
    ...COMPONENTS_DYNAMIC,
    SignosVitalesComponent, 
    ConsultaEmergenciaComponent, 
    PageMedicoEspecialistaComponent, 
    EvolucionOrdenesMedicasComponent,
    DialogReservaFichasComponent,
    DialogDerivarEspecialidadComponent,
    DialogEvolucionOrdenesMedicasComponent,

    PageCie10Component, 
    PageAdministracionComponent, 
    ServiciosComplementariosListaComponent, 
    ServiciosComplementariosListaMedicoComponent, 
    DialogButtomComponent, 
    DialogoServiciosComplementariosComponent
  ],
  imports: [
    EmergenciasRoutingModule,
    SharedModule,
    DatosPacientesModule
  ],
})
export class EmergenciasModule { }
