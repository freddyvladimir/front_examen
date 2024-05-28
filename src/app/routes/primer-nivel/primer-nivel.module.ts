import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { PrimerNivelRoutingModule } from './primer-nivel-routing.module';

import { PageAdmisionesComponent } from './page-admisiones/page-admisiones.component';
import { PageCajasComponent } from './page-cajas/page-cajas.component';
import { ReservarFichaComponent } from './componentes/reservar-ficha/reservar-ficha.component';
import { DatosPacienteComponent } from './componentes/datos-paciente/datos-paciente.component';
import { RegistroPacienteComponent } from './componentes/registro-paciente/registro-paciente.component';
import { MapaComponent } from './componentes/mapa/mapa.component';
import { PageConsultorioComponent } from './page-consultorio/page-consultorio.component';
import { PageEnfermeriaComponent } from './page-enfermeria/page-enfermeria.component';
import { SignosVitalesComponent } from './componentes/signos-vitales/signos-vitales.component';
import { FormularioMedicoComponent } from './componentes/formulario-medico/formulario-medico.component';
import { HistorialAtencionesComponent } from './componentes/historial-atenciones/historial-atenciones.component';
import { DatosPacientesModule } from '../componentes/datos-pacientes/datos-pacientes.module';
import { FichasModule } from '../componentes/fichas/fichas.module';


const COMPONENTS: any[] = [
  PageAdmisionesComponent,
  PageCajasComponent,
  ReservarFichaComponent,
  DatosPacienteComponent,
  RegistroPacienteComponent,
  MapaComponent,
  PageConsultorioComponent,
  PageEnfermeriaComponent
  
];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [SharedModule, PrimerNivelRoutingModule, DatosPacientesModule, FichasModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC, SignosVitalesComponent, FormularioMedicoComponent, HistorialAtencionesComponent],
})
export class PrimerNivelModule {}