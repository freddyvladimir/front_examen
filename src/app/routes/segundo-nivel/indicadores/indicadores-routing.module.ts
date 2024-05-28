import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SemaforosComponent } from './semaforos/semaforos.component';
import { RendimientoComponent } from './rendimiento/rendimiento.component';
import { TendenciaComponent } from './tendencia/tendencia.component';

const routes: Routes = [
  { path: 'semaforo', component: SemaforosComponent },
  { path: 'rendimiento', component: RendimientoComponent },
  { path: 'tendencia', component: TendenciaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndicadoresRoutingModule {}
