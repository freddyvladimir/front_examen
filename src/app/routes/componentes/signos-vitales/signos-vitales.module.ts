import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignosVitalesComponent } from './signos-vitales.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    SignosVitalesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule

  ],
  exports: [
    SignosVitalesComponent
  ]
})
export class SignosVitalesModule { }
