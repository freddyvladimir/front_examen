import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FichasComponent } from './fichas.component';
import { SharedModule } from '@shared';



@NgModule({
  declarations: [FichasComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    FichasComponent
  ]
})
export class FichasModule { }


