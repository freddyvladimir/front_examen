import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesPeliculasComponent } from './reportes-peliculas/reportes-peliculas.component';


const routes: Routes = [
  { path: 'reporte-peliculas', component: ReportesPeliculasComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
