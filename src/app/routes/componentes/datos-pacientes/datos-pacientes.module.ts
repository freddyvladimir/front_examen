import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatosPacientesComponent } from './datos-pacientes.component';
import { SharedModule } from '@shared';

const COMPONENTS: any[] = [DatosPacientesComponent];

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    DatosPacientesComponent
  ],
  declarations: [...COMPONENTS]
})
export class DatosPacientesModule { }
