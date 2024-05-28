import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';

import { PeliculasRoutingModule } from './peliculas-routing.module';
import { CrudComponent } from './crud/crud.component';
import { DialogComponent } from './crud/dialog/dialog.component';
import { DialogEliminarComponent } from './crud/dialog-eliminar/dialog-eliminar.component';


@NgModule({
  declarations: [
    CrudComponent,
    DialogComponent,
    DialogEliminarComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PeliculasRoutingModule
  ]
})
export class PeliculasModule { }
