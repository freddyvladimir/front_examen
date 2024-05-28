import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageAdmisionesComponent } from './page-admisiones/page-admisiones.component';
import { PageCajasComponent } from './page-cajas/page-cajas.component';
import { PageConsultorioComponent } from './page-consultorio/page-consultorio.component';
import { PageEnfermeriaComponent } from './page-enfermeria/page-enfermeria.component';
import { PageKardexComponent } from './page-kardex/page-kardex.component';
import { PageRevertirFichaComponent } from './page-revertir-ficha/page-revertir-ficha.component';
import { PageHojaReferenciaComponent } from './page-hoja-referencia/page-hoja-referencia.component';
import { PageBuscarFichaComponent } from './page-buscar-ficha/page-buscar-ficha.component';

const routes: Routes = [
  { path: 'admisiones', component: PageAdmisionesComponent },
  { path: 'cajas', component: PageCajasComponent },
  { path: 'kardex', component: PageKardexComponent },
  { path: 'enfermeria', component: PageEnfermeriaComponent },
  { path: 'consultorio', component: PageConsultorioComponent },
  { path: 'revertirFicha', component: PageRevertirFichaComponent },
  { path: 'hojaReferencia', component: PageHojaReferenciaComponent },
  { path: 'buscarFicha', component: PageBuscarFichaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultaExternaRoutingModule {}
