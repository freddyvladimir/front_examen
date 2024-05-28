import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared';
import { FormsModule } from '@angular/forms';

import { BuscarPacienteComponent  } from './buscar-paciente.component';



@NgModule({
  declarations: [
    BuscarPacienteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    BuscarPacienteComponent
  ]
})

export class BuscarPacienteModule { }
