import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagePacientesNoAsignadosComponent } from './page-pacientes-no-asignados/page-pacientes-no-asignados.component';
import { PagePacientesAsignadosComponent } from './page-pacientes-asignados/page-pacientes-asignados.component';
import { PageMaquinasComponent } from './page-maquinas/page-maquinas.component';
import { PageHemodialisisEnfermeriaComponent } from './page-hemodialisis-enfermeria/page-hemodialisis-enfermeria.component';
import { PageHemodialisisConsultorioComponent } from './page-hemodialisis-consultorio/page-hemodialisis-consultorio.component';

const routes: Routes = [
  { path: 'maquinas', component: PageMaquinasComponent },
  { path: 'pacientesNoAsignados', component: PagePacientesNoAsignadosComponent },
  { path: 'pacientesAsignados', component: PagePacientesAsignadosComponent },
  { path: 'enfermeria', component: PageHemodialisisEnfermeriaComponent },
  { path: 'consultorio', component: PageHemodialisisConsultorioComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HemodialisisRoutingModule {}