import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmisionesRoutingModule } from './admisiones-routing.module';
import { PageDuplicadosComponent } from './page-duplicados/page-duplicados.component';
import { SharedModule } from '@shared/shared.module';
import { PageReprogramacionComponent } from './page-reprogramacion/page-reprogramacion.component';
//import { BuscarPacienteComponent  } from 'app/routes/componentes/buscar-paciente/buscar-paciente.component';
import { BuscarPacienteModule } from '../../componentes/buscar-paciente/buscar-paciente.module';

@NgModule({
  declarations: [
    PageDuplicadosComponent,
    PageReprogramacionComponent,
    //BuscarPacienteComponent
  ],
  imports: [
    BuscarPacienteModule,
    CommonModule,
    AdmisionesRoutingModule,
    SharedModule
    
  ]
})
export class AdmisionesModule { }
