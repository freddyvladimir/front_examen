import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormBuilder, Validators } from '@angular/forms';
import { ServiciosComplementariosService } from '../../../servicios-complementarios.service';

@Component({
  selector: 'app-dialog-buttom',
  templateUrl: './dialog-buttom.component.html',
  styleUrls: ['./dialog-buttom.component.scss']
})
export class DialogButtomComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  variable_opcion: string = "";
  variable_id: number = 0;
  newForm = this.fb.group({
    xdescripcion: [this.data.scdescripcion, Validators.required],
    xcuaderno: [this.data.sccuaderno, Validators.required],
  });
  variable_combo: any;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    sccuaderno: number,
    scdescripcion: string,
    idservicios: number,
    opcion_estado: string
    },
    private fb: FormBuilder,
    private dialogRef: MatDialogRef < DialogButtomComponent >,
    private ServiciosComplementariosService: ServiciosComplementariosService) {}

  ngOnInit(): void {
    this.combo();
    console.log(this.data.opcion_estado);
    if(this.data.opcion_estado=="crear"){
      this.variable_opcion = "I";
    }
    if(this.data.opcion_estado=="editar"){
      this.variable_opcion = "U";
      this.variable_id = this.data.idservicios;
    }
    if(this.data.opcion_estado=="eliminar"){
      this.variable_opcion = "D";
      this.variable_id = this.data.idservicios;
    }
  }
  
  combo() {
    var combo = {
      "vhsp_id": this.CODIGO_HOSPITAL
    }
    this.ServiciosComplementariosService.lista_servicios_complementarios_combo(combo).subscribe(res => {
    this.variable_combo = res.success.data;
    });
  }

  onSubmit(parametro:any){
      const body = this.newForm.value;
      body.xid = this.variable_id;
      body.xhospital = this.CODIGO_HOSPITAL;
      body._usr_id = 1;
      body.opcion = this.variable_opcion;
      body.xcuaderno = parseInt(body.xcuaderno);
      for(var i=0; i<this.variable_combo.length; i++){
          if(this.variable_combo[i].scomdescripcion==body.xdescripcion){
            body.xdescripcion = this.variable_combo[i].scomid;
            break;
          }  
      }
      this.ServiciosComplementariosService.lista_servicios_complementarios_abm(body).subscribe(resp => {
        this.dialogRef.close('true');
      });
    
  }

 

}
