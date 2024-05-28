import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageAdministracionComponent } from './page-administracion/page-administracion.component';
import { PageReporteEcografiaComponent } from './page-reporte-ecografia/page-reporte-ecografia.component';
import { PageReporteRadiologiaComponent } from './page-reporte-radiologia/page-reporte-radiologia.component';

const routes: Routes = [
  { path: 'administracion', component: PageAdministracionComponent },
  { path: 'reporte-eco', component: PageReporteEcografiaComponent },
  { path: 'reporte-radio', component: PageReporteRadiologiaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiciosComplementariosRoutingModule { }
