import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageAdmisionesComponent } from './page-admisiones/page-admisiones.component';
import { PageCajasComponent } from './page-cajas/page-cajas.component';
import { PageConsultorioComponent } from './page-consultorio/page-consultorio.component';
import { PageEnfermeriaComponent } from './page-enfermeria/page-enfermeria.component';

const routes: Routes = [
  { path: 'admisiones', component: PageAdmisionesComponent },
  { path: 'cajas', component: PageCajasComponent },
  { path: 'enfermeria', component: PageEnfermeriaComponent },
  { path: 'consultorio', component: PageConsultorioComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrimerNivelRoutingModule {}
