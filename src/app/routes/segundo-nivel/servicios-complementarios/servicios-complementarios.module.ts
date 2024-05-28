import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { ServiciosComplementariosRoutingModule } from './servicios-complementarios-routing.module';
import { PageReporteEcografiaComponent } from './page-reporte-ecografia/page-reporte-ecografia.component';
import { PageReporteRadiologiaComponent } from './page-reporte-radiologia/page-reporte-radiologia.component';



@NgModule({
  declarations: [
    PageReporteEcografiaComponent,
    PageReporteRadiologiaComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    ServiciosComplementariosRoutingModule,
    
  ]
})
export class ServiciosComplementariosModule { }
