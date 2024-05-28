/*import{Component, OnInit, Inject}from '@angular/core';import{FormBuilder, Validators}from '@angular/forms';import{ParametricasService}from '../../parametricas.service';import{MatDialogRef, MAT_DIALOG_DATA}from '@angular/material/dialog';@Component({selector: 'app-delete-consultorio', templateUrl: './delete-consultorio.component.html', styleUrls: ['./delete-consultorio.component.scss']})export class DeleteConsultorioComponent implements OnInit{constructor( @Inject(MAT_DIALOG_DATA) public data:{descripcion: string, id: number}, private fb: FormBuilder, public parametricasService: ParametricasService, public dialogRef: MatDialogRef < DeleteConsultorioComponent > , ){}ngOnInit(): void{}onSubmitDelete(){this.parametricasService.deleteConsultorio(this.data.id).subscribe(resp=>{this.dialogRef.close('true');});}}*/

import {
  Component,
  OnInit,
  Inject
} from '@angular/core';
import {
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  ParametricasService
} from '../../parametricas.service';
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-consultorio',
  templateUrl: './delete-consultorio.component.html',
  styleUrls: ['./delete-consultorio.component.scss']
})
export class DeleteConsultorioComponent implements OnInit {

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: {
          descripcion: string,
          id: number
      },
      private fb: FormBuilder,
      public parametricasService: ParametricasService,
      public dialogRef: MatDialogRef < DeleteConsultorioComponent > , ) {}

  ngOnInit(): void {}

  onSubmitDelete() {
      this.parametricasService.deleteConsultorio(this.data.id).subscribe(resp => {
          this.dialogRef.close('true');
      });
  }

}
