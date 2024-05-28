import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormBuilder, Validators } from '@angular/forms';
import { ServiciosComplementariosService } from '../../../servicios-complementarios.service';

@Component({
  selector: 'app-dialogo-servicios-complementarios',
  templateUrl: './dialogo-servicios-complementarios.component.html',
  styleUrls: ['./dialogo-servicios-complementarios.component.scss']
})
export class DialogoServiciosComplementariosComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  variable_opcion: string = "";
  variable_id: number = 0;
  newForm = this.fb.group({
    xsca_sc_id: [this.data.descripcion, Validators.required],
    xsca_id_medico: [this.data.nombremedico, Validators.required],
  });
  variable_combo: any;
  variable_combo_medico: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    descripcion: string,
    nombremedico: string,
    asigid: number,
    opcion_estado: string
    },
    private fb: FormBuilder,
    private dialogRef: MatDialogRef < DialogoServiciosComplementariosComponent >,
    private ServiciosComplementariosService: ServiciosComplementariosService) { }

  ngOnInit(): void {
    this.combo();
    this.combo_medico();
    if(this.data.opcion_estado=="crear"){
      this.variable_opcion = "I";
    }
    if(this.data.opcion_estado=="editar"){
      this.variable_opcion = "U";
      this.variable_id = this.data.asigid;
    }
    if(this.data.opcion_estado=="eliminar"){
      this.variable_opcion = "D";
      this.variable_id = this.data.asigid;
    }
  }

  combo() {
    var combo = {
      "idhospital": this.CODIGO_HOSPITAL
    }
    this.ServiciosComplementariosService.lista_servicios_complementarios_medico_combo(combo).subscribe(res => {
    this.variable_combo = res.success.data;
    });
  }

  combo_medico() {
    var combo = {
      "idhospital": this.CODIGO_HOSPITAL
    }
    this.ServiciosComplementariosService.lista_servicios_complementarios_medico_combo_medicos(combo).subscribe(res => {
    this.variable_combo_medico = res.success.data;
    });
  }

  onSubmit(parametro:any){
    const body = this.newForm.value;
    body.xsca_id = this.variable_id;
    body.xsca_hsp_id = this.CODIGO_HOSPITAL;
    body._usr_id = 1;
    body.opcion = this.variable_opcion;
    for(var i=0; i<this.variable_combo.length; i++){
      if(this.variable_combo[i].scomdescripcion==body.xsca_sc_id){
        body.xsca_sc_id = this.variable_combo[i].scomid;
        break;
      }  
    }
    for(var i=0; i<this.variable_combo_medico.length; i++){
      if(this.variable_combo_medico[i].nombremedico==body.xsca_id_medico){
        body.xsca_id_medico = this.variable_combo_medico[i].usuarioid;
        break;
      }  
    }
    this.ServiciosComplementariosService.lista_servicios_complementarios_medico_combo_abm(body).subscribe(resp => {
      this.dialogRef.close('true');
    });
    console.log("DESCRUIPcion  : ",body.xsca_sc_id);
  }

}
