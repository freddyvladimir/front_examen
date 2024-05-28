import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { FichasRoutingModule } from "./fichas-routing.module";

import { PageDispensadorComponent } from './page-dispensador/page-dispensador.component';
import { PageMonitorComponent } from './page-monitor/page-monitor.component';
import { PageAdministracionComponent } from './page-administracion/page-administracion.component';



@NgModule({
  declarations: [
    PageDispensadorComponent,
    PageMonitorComponent,
    PageAdministracionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FichasRoutingModule
  ]
})
export class FichasModule { }
