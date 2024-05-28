import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ParametricasService } from '../../parametricas.service';

export interface DialogData {
  campos: any;
}
@Component({
  selector: 'app-dialog-medico-especialidad',
  templateUrl: './dialog-medico-especialidad.component.html',
  styleUrls: ['./dialog-medico-especialidad.component.scss']
})
export class DialogMedicoEspecialidadComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  NIVEL_HOSPITAL = 1;

  datos: any = [];

  dataFormulario:any = {};
  disableSelect = new FormControl(false);
  //////////servicios/////////
  sql: any;
  responde: any;
  //////////servicios/////////
  listaEspecialidad:any = [];
  listaMedicos:any = [];
  constructor(
    private toastr: ToastrService,
    private http: ParametricasService,
    public dialogRef: MatDialogRef<DialogMedicoEspecialidadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    }

  ngOnInit(): void {
    this.listarEspecialidades();
    this.listarMedicos();
  }

  guardarRelacion(){
    try {
      this.sql = {
        consulta: "select * from sp_abm_med_esp("+this.dataFormulario.medico+","+this.dataFormulario.especialidad+","+this.CODIGO_HOSPITAL+",1,0,$$I$$)"
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          console.log("sp_abm_med_esp", this.responde.success.data[0].sp_dinamico);
          
        } else {
          
        }
      });
    } catch (error) {
    }
  }

  listarEspecialidades(){
    try {
      this.sql = {
        consulta: "select * from sp_lst_srv_especialidad("+this.CODIGO_HOSPITAL+")"
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          console.log("sp_lst_srv_especialidad", this.responde.success.data[0].sp_dinamico);
          this.listaEspecialidad = this.responde.success.data[0].sp_dinamico;
        } else {
          this.listaEspecialidad = [];
        }
      });
    } catch (error) {
    }
  }

  listarMedicos(){
    try {
      this.sql = {
        consulta: "select * from sp_personas_medico("+this.CODIGO_HOSPITAL+")"
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          console.log("sp_lst_srv_especialidad", this.responde.success.data[0].sp_dinamico);
          this.listaMedicos = this.responde.success.data[0].sp_dinamico;
        } else {
          this.listaMedicos = [];
        }
      });
    } catch (error) {
    }
  }
  


}
