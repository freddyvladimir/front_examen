import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConsultaExternaService } from '../../consulta-externa.service';


export interface DialogData {
  paciente_seleccionado: any;
}


@Component({
  selector: 'app-dialog-advertencia',
  templateUrl: './dialog-advertencia.component.html',
  styleUrls: ['./dialog-advertencia.component.scss']
})
export class DialogAdvertenciaComponent implements OnInit {

  ///////////////  VARIABLES  /////////
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  IDUSUARIO = 1;
  datos_ficha: any;
  data_revertir = [];
  ///////////////  VARIABLES  /////////

  //////////servicios/////////
  sql: any;
  responde: any;
  //////////servicios/////////

  constructor(  public dialogRef: MatDialogRef<DialogAdvertenciaComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData,
                private ConsultaExternaService: ConsultaExternaService) { }

  ngOnInit(): void {
    //console.log('DATOS DEL PADRE', this.data);
    this.datos_ficha = this.data;
    //console.log('DATOS DEL PADRE 2', this.datos_ficha);
  }


  /*revertir(){
    console.log('SI SE REVERTIO');
    console.log('DATOS DEL PADRE 2', this.datos_ficha);
    this.sql = {
      consulta: 'select * from sp_lst_verifica_pacientesficha_revertir('+ this.IDUSUARIO +','+ this.CODIGO_HOSPITAL +','+ this.datos_ficha.vpres_id +','+ this.datos_ficha.vturnoid +','+ this.datos_ficha.vnumero_ficha +')'
    };
    this.ConsultaExternaService.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        this.data_revertir = this.responde.success.data[0].sp_dinamico;
        console.log('LISTADO SERVICIOS', this.data_revertir);
        this.dialogRef.close(true);
      } else {
        this.data_revertir = [];
      }
    });
  }*/

  revertir(){
    console.log('SI SE REVERTIO');
    console.log('DATOS DEL PADRE 2', this.datos_ficha);
    const params_revertir = {
      usuario: this.IDUSUARIO,
      hspid: this.CODIGO_HOSPITAL,
      idpres: this.datos_ficha.vpres_id,
      idturno: this.datos_ficha.vturnoid,
      nroficha: this.datos_ficha.vnumero_ficha
    };
    this.ConsultaExternaService.revertir_ficha(params_revertir).subscribe(res => {
      this.responde = res;
      console.log('RESPUESTA', this.responde);    
      this.data_revertir = this.responde.success.data;
      console.log('LISTADO SERVICIOS', this.data_revertir);
      if (this.responde.success.code == 200) {
        console.log('POR VERDAD');
        this.dialogRef.close(true);
      }else {
        this.data_revertir = [];
      }
    });
  }

}
