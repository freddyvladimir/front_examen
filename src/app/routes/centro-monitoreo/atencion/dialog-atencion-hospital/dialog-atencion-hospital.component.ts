import { Component, Inject, OnInit } from '@angular/core';
import { CentroMonitoreoService } from '../../centro-monitoreo.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  campos: any;
}

@Component({
  selector: 'app-dialog-atencion-hospital',
  templateUrl: './dialog-atencion-hospital.component.html',
  styleUrls: ['./dialog-atencion-hospital.component.scss']
})
export class DialogAtencionHospitalComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  responde:any;
  sql:any;
  listaMedicos:any;
  asignacion: FormGroup | any;
  datoSeleccionados:any;
  repuestaServicio:any = [];
  constructor(fb: FormBuilder,private http: CentroMonitoreoService,
    public dialogRef: MatDialogRef<DialogAtencionHospitalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.asignacion = fb.group({
      adecuada: [''],
      justificada: [''],
      oportuna: ['']
    });
  }

  ngOnInit(): void {
    this.listarMedicos();
    this.datoSeleccionados = this.data;
    console.log("this.datoSeleccionados",this.datoSeleccionados);
    
  }

  listarMedicos() {
    try {
      this.sql = {
        consulta: "select * from sp_asignacion_jefe_med_emergencias("+this.CODIGO_HOSPITAL+")"
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          console.log(this.responde.success.data[0].sp_dinamico);
          this.listaMedicos = this.responde.success.data[0].sp_dinamico;
        }
      });
    } catch (error) {
    }
  }


  guardarDatos() {
    
    try {
      this.sql = {
        consulta: "select * from actualizar_atencion_monitoreo_metodologia("+this.datoSeleccionados.campos.vad_id+", $$"+ JSON.stringify(this.asignacion.value)+"$$)"
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          console.log(this.responde.success.data[0].sp_dinamico);
          // select * from sp_insertar_prestacion_emergencias_monitoreo('+sessionService.get('ID_HOSPITAL')+', '+sessionService.get('IDUSUARIO')+', '+dato.idusuario+',$$'+ $scope.pacientes[0].vad_data_solicitud.paciente +'$$,'+ $scope.pacientes[0].vad_id +')
          try {
            this.sql = {
              consulta: "select * from sp_insertar_prestacion_emergencias_monitoreo("+this.CODIGO_HOSPITAL+", 1, "+2025+",$$"+ this.datoSeleccionados.campos.vad_data_solicitud.paciente +"$$,"+ this.datoSeleccionados.campos.vad_id +")"
            };
            this.http.dinamico(this.sql).subscribe(res => {
              this.responde = res as { message: string };
              if (this.responde.success.data[0].sp_dinamico != null) {
                console.log(this.responde.success.data[0].sp_dinamico);
                this.repuestaServicio = this.responde.success.data[0].sp_dinamico[0];
                try {
                  this.sql = {
                    consulta: "select * from sp_insertar_datos_emergencia_consulta_externa1("+this.repuestaServicio.vidpres+", $$"+JSON.stringify(this.datoSeleccionados.campos)+"$$, $$[]$$,$$[]$$,"+this.repuestaServicio.codigo_siis+",1)"
                  };
                  this.http.dinamico(this.sql).subscribe(res => {
                    this.responde = res as { message: string };
                    if (this.responde.success.data[0].sp_dinamico != null) {
                      console.log(this.responde.success.data[0].sp_dinamico);
                      try {
                        this.sql = {
                          consulta: "select * from modificado_atencion_monitoreo("+this.datoSeleccionados.campos.vad_id+")"
                        };
                        this.http.dinamico(this.sql).subscribe(res => {
                          this.responde = res as { message: string };
                          if (this.responde.success.data[0].sp_dinamico != null) {
                            console.log(this.responde.success.data[0].sp_dinamico);
                            this.cerrarModal();
                          }
                        });
                      } catch (error) {
                      }
                    }
                  });
                } catch (error) {
                }
              }
            });
          } catch (error) {
          }
        }
      });
    } catch (error) {
    }
  }

  cerrarModal(){
    this.dialogRef.close();
  }

}
