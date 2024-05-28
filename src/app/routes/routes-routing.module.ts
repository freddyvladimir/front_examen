import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';

import { AdminLayoutComponent } from '@theme/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from '@theme/auth-layout/auth-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './sessions/login/login.component';
import { Error403Component } from './sessions/403.component';
import { Error404Component } from './sessions/404.component';
import { Error500Component } from './sessions/500.component';
import { AuthGuard } from '@core/authentication';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: '403', component: Error403Component },
      { path: '404', component: Error404Component },
      { path: '500', component: Error500Component },      
      //////////////////////////////////////////////////////////////////////////////////////////
      {
        path: 'peliculas',
        loadChildren: () => import('./peliculas/peliculas.module').then(m => m.PeliculasModule),
      },
      {
        path: 'reportes',
        loadChildren: () => import('./reportes/reportes.module').then(m => m.ReportesModule),
      },



      
      {
        path: 'primer-nivel',
        loadChildren: () => import('./primer-nivel/primer-nivel.module').then(m => m.PrimerNivelModule),
      },
      {
        path: 'parametricas',
        loadChildren: () => import('./parametricas/parametricas.module').then(m => m.ParametricasModule),
      },
      {
        path: 'segundo-nivel',
        loadChildren: () => import('./segundo-nivel/consulta-externa/consulta-externa.module').then(m => m.ConsultaExternaModule),
      },
      {
        path: 'hemodialisis',
        loadChildren: () => import('./segundo-nivel/hemodialisis/hemodialisis.module').then(m => m.HemodialisisModule),
      },
      {
        path: 'emergencias',
        loadChildren: () => import('./segundo-nivel/emergencias/emergencias.module').then(m => m.EmergenciasModule),
      },
      {
        path: 'servicios-complementarios',
        loadChildren: () => import('./segundo-nivel/servicios-complementarios/servicios-complementarios.module').then(m => m.ServiciosComplementariosModule),
      },
      {
        path: 'admisiones',
        loadChildren: () => import('./segundo-nivel/admisiones/admisiones.module').then(m => m.AdmisionesModule),
      },
      {
        path: 'centro-monitoreo',
        loadChildren: () => import('./centro-monitoreo/centro-monitoreo.module').then(m => m.CentroMonitoreoModule),
      },
      {
        path: 'indicadores',
        loadChildren: () => import('./segundo-nivel/indicadores/indicadores-routing.module').then(m => m.IndicadoresRoutingModule),
      },
      {
        path: 'reportes-gamlp',
        loadChildren: () => import('./segundo-nivel/reportes-gamlp/reportes-gamlp.module').then(m => m.ReportesGamlpModule),
      },
      {
        path: 'fichas',
        loadChildren: () => import('./fichas/fichas.module').then(m => m.FichasModule),
      }
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent }
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

/*@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})*/

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class RoutesRoutingModule {}
