import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CentroMonitoreoService } from '../../centro-monitoreo.service';

export interface DialogData {
  campos: any;
}

@Component({
  selector: 'app-dialog-crud',
  templateUrl: './dialog-crud.component.html',
  styleUrls: ['./dialog-crud.component.scss']
})

export class DialogCrudComponent implements OnInit {
  sql:any;
  responde:any;

  datos:any = [];
  tipoBock:boolean = false;
  datosModificables:any;
  constructor(private toastr: ToastrService,private http: CentroMonitoreoService,public dialogRef: MatDialogRef<DialogCrudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.datosModificables = data;
    }

  ngOnInit(): void {
    console.log(this.datosModificables);
    
    if (this.datosModificables.tipo == 'NEW') {
      this.tipoBock = false;
      this.registroNuevo();
    } else {
      this.tipoBock = true;
      this.editarRegistro(this.datosModificables.campos);
    }
  }

  registroNuevo(){    
  }

  editarRegistro(data:any){
    console.log(data);
    this.datos.alfa = data.alfa;
    this.datos.descripcion = data.descripcion;
    this.datos.id = data.id_cie_10;
  }

  crearNuevo(){
    /*try {
      this.sql = {
        consulta: "select * from sp_abm_cie10_monitoreo(null,$$"+this.datos.alfa +"$$,$$"+this.datos.descripcion+"$$,1,$$I$$)"
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          console.log("this.responde.success.data[0].sp_dinamico",this.responde.success.data[0].sp_dinamico);          
        } else {
        }
      });
    } catch (error) {
    }*/
    const params_crear_registro = {
      "n": "null",
      "namee": this.datos.alfa,
      "datos": this.datos.descripcion,
      "num": 1,
      "datosCie": "I"
    };
    this.http.insertarCie10(params_crear_registro).subscribe(res => {
      this.responde = res.success.data;
      console.log(this.responde);
    });  
  }

  modificarRegistro(){
    /*try {
      this.sql = {
        consulta: "select * from sp_abm_cie10_monitoreo("+this.datos.id+",$$"+this.datos.alfa +"$$,$$"+this.datos.descripcion+"$$,1,$$U$$)"
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          console.log("this.responde.success.data[0].sp_dinamico",this.responde.success.data[0].sp_dinamico);          
        } else {
        }
      });
    } catch (error) {
    }*/
    const params_modificar_registro = {
      "n": this.datos.id,
      "namee": this.datos.alfa,
      "datos": this.datos.descripcion,
      "num": 1,
      "datosCie": "U"
    };
    this.http.editarCie10(params_modificar_registro).subscribe(res => {
      this.responde = res.success.data;
      console.log(this.responde);
    });
  }

}
