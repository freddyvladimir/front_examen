import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SemaforosComponent } from './semaforos/semaforos.component';
import { RendimientoComponent } from './rendimiento/rendimiento.component';
import { TendenciaComponent } from './tendencia/tendencia.component';



@NgModule({
  declarations: [
    SemaforosComponent,
    RendimientoComponent,
    TendenciaComponent
  ],
  imports: [
    CommonModule
  ]
})
export class IndicadoresModule { }
