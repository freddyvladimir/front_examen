import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ParametricasRoutingModule } from './parametricas-routing.module';

import { PageProgramacionFichasComponent } from './page-programacion-fichas/page-programacion-fichas.component';
import { DialogFromFichasComponent } from './page-programacion-fichas/dialog-from-fichas/dialog-from-fichas.component';
import { PageEspecialidadesComponent } from './page-especialidades/page-especialidades.component';
import { CreateComponent } from './page-especialidades/create/create.component';
import { EditComponent } from './page-especialidades/edit/edit.component';
import { DeleteComponent } from './page-especialidades/delete/delete.component';
import { PageConsultoriosComponent } from './page-consultorios/page-consultorios.component';
import { CreateConsultorioComponent } from './page-consultorios/create-consultorio/create-consultorio.component';
import { EditConsultorioComponent } from './page-consultorios/edit-consultorio/edit-consultorio.component';
import { DeleteConsultorioComponent } from './page-consultorios/delete-consultorio/delete-consultorio.component';
import { PageAsignacionMedicoEspecialidadComponent } from './page-asignacion-medico-especialidad/page-asignacion-medico-especialidad.component';
import { DialogMedicoEspecialidadComponent } from './page-asignacion-medico-especialidad/dialog-medico-especialidad/dialog-medico-especialidad.component';

const COMPONENTS: any[] = [PageProgramacionFichasComponent, DialogFromFichasComponent,PageEspecialidadesComponent, CreateComponent, EditComponent, DeleteComponent, PageConsultoriosComponent, CreateConsultorioComponent, EditConsultorioComponent, DeleteConsultorioComponent, PageAsignacionMedicoEspecialidadComponent];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [SharedModule, ParametricasRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC, DialogMedicoEspecialidadComponent],
})
export class ParametricasModule {}