import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { HemodialisisRoutingModule } from './hemodialisis.routing.module';
import { PagePacientesNoAsignadosComponent } from './page-pacientes-no-asignados/page-pacientes-no-asignados.component';
import { PagePacientesAsignadosComponent } from './page-pacientes-asignados/page-pacientes-asignados.component';
import { PageMaquinasComponent } from './page-maquinas/page-maquinas.component';
import { DialogNuevaMaquinaComponent } from './page-maquinas/dialog-nueva-maquina/dialog-nueva-maquina.component';
import { PageHemodialisisEnfermeriaComponent } from './page-hemodialisis-enfermeria/page-hemodialisis-enfermeria.component';
import { PageHemodialisisConsultorioComponent } from './page-hemodialisis-consultorio/page-hemodialisis-consultorio.component';
import { DialogHoraAtencionComponent } from './page-hemodialisis-enfermeria/dialog-hora-atencion/dialog-hora-atencion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogAsignarMaquinaComponent } from './page-pacientes-no-asignados/dialog-asignar-maquina/dialog-asignar-maquina.component';
import { DialogReasignarMaquinaComponent } from './page-pacientes-asignados/dialog-reasignar-maquina/dialog-reasignar-maquina.component';
import { DialogRegistroHojaComponent } from './page-pacientes-asignados/dialog-registro-hoja/dialog-registro-hoja.component';
import { DialogMedicamentosComponent } from './page-hemodialisis-consultorio/dialog-medicamentos/dialog-medicamentos.component';
import { DialogLaboratoriosComponent } from './page-hemodialisis-consultorio/dialog-laboratorios/dialog-laboratorios.component';


const COMPONENTS: any[] = [
  PageMaquinasComponent,
  PagePacientesNoAsignadosComponent,
  PagePacientesAsignadosComponent
];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC,
    PageMaquinasComponent,
    DialogNuevaMaquinaComponent,
    PageHemodialisisEnfermeriaComponent,
    PageHemodialisisConsultorioComponent,
    DialogAsignarMaquinaComponent,
    DialogReasignarMaquinaComponent,
    DialogRegistroHojaComponent,
    DialogHoraAtencionComponent,
    DialogMedicamentosComponent,
    DialogLaboratoriosComponent],
  imports: [
    HemodialisisRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class HemodialisisModule { }
