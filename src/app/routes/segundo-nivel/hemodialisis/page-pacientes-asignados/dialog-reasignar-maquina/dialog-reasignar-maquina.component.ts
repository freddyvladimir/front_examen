import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HemodialisisService } from '../../hemodialisis.service';
export interface DialogData {
  campos: any;
}
@Component({
  selector: 'app-dialog-reasignar-maquina',
  templateUrl: './dialog-reasignar-maquina.component.html',
  styleUrls: ['./dialog-reasignar-maquina.component.scss']
})
export class DialogReasignarMaquinaComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  hosp = this.CODIGO_HOSPITAL;
  newForm: FormGroup;
  //campos : [];
  aux: any;
  idCombo: any;
  variable_combo: any;
  response: any = [];
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    pacid: number,
    paterno: string,
    materno: string,
    nombres: string,
    codigo: string,
    hospital: number,
    servicio: string,
    asid: number,
  },
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogReasignarMaquinaComponent>,
    private HemodialisisServices: HemodialisisService) {
    this.aux = this.data;
    this.newForm = this.fb.group({
      matricula_paciente: [this.aux.campos.pac_cod, Validators.required],
      n_paterno: [this.aux.campos.pacpat, Validators.required],
      n_materno: [this.aux.campos.pacmat, Validators.required],
      n_nombre: [this.aux.campos.pacnom, Validators.required],
      hospital: [this.aux.campos.cen_nombre, Validators.required],
      servicio: [''],
      pacid: [this.aux.campos.pacid, Validators.required],
      maqid: [this.aux.campos.maqid, Validators.required],
      asid: [this.aux.campos.asid, Validators.required],
    })
  }
  ngOnInit(): void {
    this.combo(this.CODIGO_HOSPITAL);
    this.pacientes_asignados(this.CODIGO_HOSPITAL);
   // console.log("valor de aux ", this.aux);
   // console.log("Codigo Hospital", this.hosp);
  }
  combo(idhosp: any) {
    this.HemodialisisServices.lst_maquinas(idhosp).subscribe(res => {
      this.variable_combo = res.success.data;
     // console.log("Datos de la Variable combo  :", this.variable_combo);
    })
  }
  pacientes_asignados(idhosp: any) {
    this.HemodialisisServices.lst_asignados(idhosp).subscribe(res => {
      this.response = res.success.data;
      //     console.log("Lista de Pacientes Asignados  : ", this.response);
    })
  }
  onSubmit(parametro: any) {
    console.log("//////---------  Mostrando datos del NewForm", this.newForm.value);
    let body = {
      _as_id: this.newForm.value.asid,
      _pac_id: this.newForm.value.pacid,
      _cen_id: this.CODIGO_HOSPITAL,
      _maq_id: this.idCombo,
      opcion: "U",
    }
    this.HemodialisisServices.lst_abm_noAsignados(body).subscribe(resp => {
      this.dialogRef.close('true');
    });
  //  console.log("Mostrando el contenido de LET despues del cambio o creacion --->", body);
  }
  //{
  //   "_as_id": 0,
  //   "_pac_id": 7,
  //  "_cen_id": 5,
  //   "_maq_id": 3,
  //   "opcion": "I"
  // }
  valueCombo(dato: any) {
    this.idCombo = dato;
  //  console.log("VALOR DE COMBO :", this.idCombo);
  }
}
