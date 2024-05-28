import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesPeliculasComponent } from './reportes-peliculas/reportes-peliculas.component';


@NgModule({
  declarations: [
    ReportesPeliculasComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReportesRoutingModule
  ]
})
export class ReportesModule { }
