import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { ConsultaExternaService } from '../../consulta-externa.service';

export interface DialogData {
  campos: any;
}

export interface HistoricoData {
}

const ELEMENT_DATA: HistoricoData[] = [];

@Component({
  selector: 'app-dialog-historico-atenciones',
  templateUrl: './dialog-historico-atenciones.component.html',
  styleUrls: ['./dialog-historico-atenciones.component.scss']
})
export class DialogHistoricoAtencionesComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  codigosocial = 35;
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
    private http: ConsultaExternaService,
    public dialogRef: MatDialogRef<DialogHistoricoAtencionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

  }

  displayedColumns: string[] = [
    'especialidad',
    'medico',
    'fecha_atencion',
    'vtipo_estado',
  ];

  dataSource = ELEMENT_DATA;

  ngOnInit(): void {
    this.listarHistoricos();
  }

  listarHistoricos(){
    try {
      this.sql = {
        consulta: "select * from reporte_reserva("+this.CODIGO_HOSPITAL+", $$"+this.codigosocial+"$$)"
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          console.log("reporte_reserva", this.responde.success.data[0].sp_dinamico);
          this.dataSource = this.responde.success.data[0].sp_dinamico;
        } else {
          this.dataSource = [];
        }
      });
    } catch (error) {
    }
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

}
