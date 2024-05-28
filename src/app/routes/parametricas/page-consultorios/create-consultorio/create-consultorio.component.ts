/*import{Component, OnInit, NgZone}from '@angular/core';import{FormBuilder, Validators}from '@angular/forms';import{ParametricasService}from '../../parametricas.service';import{MatDialog, MatDialogRef, MAT_DIALOG_DATA}from '@angular/material/dialog';@Component({selector: 'app-create-consultorio', templateUrl: './create-consultorio.component.html', styleUrls: ['./create-consultorio.component.scss']})export class CreateConsultorioComponent implements OnInit{prestaciones: any; newForm=this.fb.group({cnsl_descripcion: [''], cnsl_tipo: [''], cnsl_codigo: [''], cnsl_cp_id: [],}); users: any[]=[]; constructor( public fb: FormBuilder, public parametricasService: ParametricasService, public dialogRef: MatDialogRef < CreateConsultorioComponent > , ){}ngOnInit(): void{const body={"idhsp": 10}; this.parametricasService.postLstHspPrestaciones(body).subscribe(resp=>{this.prestaciones=resp;});}onSubmit(){const body=this.newForm.value; body.cnsl_usuario_id=1; body.cnsl_hsp_id=10; this.parametricasService.postConsultorio(body).subscribe(resp=>{this.dialogRef.close('true');});}}
*/
import {
  Component,
  OnInit,
  NgZone
} from '@angular/core';
import {
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  ParametricasService
} from '../../parametricas.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

@Component({
  selector: 'app-create-consultorio',
  templateUrl: './create-consultorio.component.html',
  styleUrls: ['./create-consultorio.component.scss']
})
export class CreateConsultorioComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  prestaciones: any;
  newForm: any = {};
  
  users: any[] = [];
  idEspecialidad:any;
  constructor(
      public fb: FormBuilder,
      public parametricasService: ParametricasService,
      public dialogRef: MatDialogRef < CreateConsultorioComponent > ,
  ) {
    this.newForm = this.fb.group({
      cnsl_descripcion: [''],
      cnsl_tipo: [''],
      cnsl_codigo: [''],
      cnsl_cp_id: [{value: '',disabled: true}],
  });
  }

  ngOnInit(): void {
      const body = {
          "idhsp": this.CODIGO_HOSPITAL
      };
      this.parametricasService.postLstHspPrestaciones(body).subscribe(resp => {
          this.prestaciones = resp;
      });
  }

  seleccionarEspecialidad(data:any){
    this.idEspecialidad = data;
    this.newForm.get('cnsl_cp_id').setValue(data);
  }
  onSubmit() {
      const body = this.newForm.value;
      body.cnsl_usuario_id = 1;
      body.cnsl_hsp_id = this.CODIGO_HOSPITAL;
      body.cnsl_cp_id = this.idEspecialidad;
      for (let x = 0; x < this.prestaciones.length; x++) {
        if (this.prestaciones[x].id == this.idEspecialidad) {
          body.cnsl_descripcion = this.prestaciones[x].descripcion;
        }
      }
      this.parametricasService.postConsultorio(body).subscribe(resp => {
          this.dialogRef.close('true');
      });
  }
}
