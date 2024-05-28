import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HemodialisisService } from '../../hemodialisis.service';
export interface DialogData {
  campos: any;
}
@Component({
  selector: 'app-dialog-asignar-maquina',
  templateUrl: './dialog-asignar-maquina.component.html',
  styleUrls: ['./dialog-asignar-maquina.component.scss']
})
export class DialogAsignarMaquinaComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  variable_opcion: string = "";
  variable_id: number = 0;
  newForm1: FormGroup;
  valorx: any;
  aux: any;
  comboSave: any;
  idCombo: any;
  variable_combo: any;
  response: any = [];
  variable_paciente_no_asignado: any;
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    //campos : [],
    parametro_id: string,
    opcion_estado: string,
    pacid: number,          // PACIENTE ID  REVISAR
    ficha_clinica: string,
    paterno: string,
    materno: string,
    nombres: string,
    codigo: string,
    hospital: number,
    servicio: string,
  },
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogAsignarMaquinaComponent>,
    private HemodialisisService: HemodialisisService) {

    this.aux = this.data;
   // console.log("Datos del DATA vaciado al AUX", this.aux);
  //  console.log("Datos del DATA vaciado al AUX1111", this.comboSave);
    this.newForm1 = this.fb.group({
      matricula_paciente: [this.aux.campos.codigo, Validators.required],
      n_paterno: [this.aux.campos.paterno, Validators.required],
      n_materno: [this.aux.campos.materno, Validators.required],
      n_nombre: [this.aux.campos.nombres, Validators.required],
      hospital: [this.aux.campos.cenid, Validators.required],
      servicio: [''],
      pacid: [this.aux.campos.pacid, Validators.required],
    });
  }

  ngOnInit(): void {
    this.combo(this.CODIGO_HOSPITAL);
    this.paciente_no_asignado(this.CODIGO_HOSPITAL);
  //  console.log("valor de la data", this.data);
  //  console.log("Mostrando el valor del NEW FOrm despues del click", this.newForm1.value);

  }
  combo(idhosp: any) {
    this.HemodialisisService.lst_maquinas(idhosp).subscribe(res => {
      this.variable_combo = res.success.data;
      this.comboSave = res.success.data;
     // console.log("Parametros MAquinas", this.comboSave);
      // console.log("Recuperando parametro de Maquina especifico anidado", this.variable_combo[0].maqdatos[0].maq_codigo);
    });
  }
  paciente_no_asignado(idhosp: any) {
    this.HemodialisisService.lst_noAsignados(idhosp).subscribe(res => {
      this.response = res.success.data;
      //console.log("Lista Pacientes no Asignados :", this.aux);
    })
  }
  onSubmit(parametro: any) {
   // console.log("--------**************--------- Mostrando el valor del NEW FOrm1 despues del click", this.newForm1.value);
    let xxx = {
      _as_id: 0,
      _pac_id: this.newForm1.value.pacid,
      _cen_id: this.CODIGO_HOSPITAL,
      _maq_id: this.idCombo,
      opcion: "I",
    }
    this.HemodialisisService.lst_abm_noAsignados(xxx).subscribe(resp => {
      this.dialogRef.close('true');
    });
  //  console.log("Mostrando el contenido de LET despues del cambio o creacion --->", xxx);
  }
  //  {
  //"_as_id": 0,  - --------------- ??? nro de registro
  //"_pac_id": 7,   --------------- paciente ID ok
  //"_cen_id": 5,   --------------- Hospital 
  //"_maq_id": 3,   ------- maquina ID
  //"opcion": "I"   ------- opciones
  //}
  valueCombo(dato: any) {
    this.idCombo = dato;
  //  console.log("VALOR DE COMBO :", this.idCombo);
  }
}
