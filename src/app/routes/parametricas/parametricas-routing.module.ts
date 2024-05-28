import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageProgramacionFichasComponent } from './page-programacion-fichas/page-programacion-fichas.component';
import { PageEspecialidadesComponent } from './page-especialidades/page-especialidades.component';
import { PageConsultoriosComponent } from './page-consultorios/page-consultorios.component';
import { PageAsignacionMedicoEspecialidadComponent } from './page-asignacion-medico-especialidad/page-asignacion-medico-especialidad.component';

const routes: Routes = [
  { path: 'programacion-fichas', component: PageProgramacionFichasComponent },
  { path: 'especialidades', component: PageEspecialidadesComponent },
  { path: 'consultorios', component: PageConsultoriosComponent },
  { path: 'medico-especialidad', component: PageAsignacionMedicoEspecialidadComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParametricasRoutingModule {}
