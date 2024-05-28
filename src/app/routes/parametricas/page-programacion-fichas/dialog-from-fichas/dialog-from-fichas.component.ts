import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DateRange, MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER } from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';
import { ParametricasService } from '../../parametricas.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface DialogData {
  campos: any;
}
@Component({
  selector: 'app-dialog-from-fichas',
  templateUrl: './dialog-from-fichas.component.html',
  styleUrls: ['./dialog-from-fichas.component.scss'],
  providers: [MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER]
})
export class DialogFromFichasComponent implements OnInit {
  selected: any | null;
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  NIVEL_HOSPITAL = 1;
  sampleRange: DateRange<any> | any;
  range = new FormGroup({
    start: new FormControl({ disabled: true }),

    end: new FormControl({ disabled: true }),
  });
  fecha_inicio: Date | any;
  fecha_fin: Date | any;
  validador_fechas = true;
  dias_semana: FormGroup | any;
  //////////servicios/////////
  sql: any;
  responde: any;
  //////////servicios/////////
  //////////fechas/////////
  cadena: any;
  mes: any;
  dia: any;
  fech_mod: any;
  //////////fechas/////////  
  datos: any = []; /////Datos de todo el formulario
  data_turnos: any = [];
  data_prestacion: any = [];
  data_servicios: any = [];
  data_medico: any = [];
  data_consultorio: any = [];
  fecha_actual: Date | any;  
  datosModificables:any;
  tipoBock:boolean = false;
  constructor(
    fb: FormBuilder,
    private toastr: ToastrService,
    private parametricasService: ParametricasService,
    public dialogRef: MatDialogRef<DialogFromFichasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    
    this.datosModificables = data;
    //console.log("-----campos------",this.campos);
    
    //data.campos = "loca";
    /*this.fecha_inicio = new Date();
    this.fecha_fin = new Date();*/
    this.refreshDR();
    this.dias_semana = fb.group({
      lunes: [{ value: false, disabled: true }],
      martes: [{ value: false, disabled: true }],
      miercoles: [{ value: false, disabled: true }],
      jueves: [{ value: false, disabled: true }],
      viernes: [{ value: false, disabled: true }],
      sabado: [{ value: false, disabled: true }],
      domingo: [{ value: false, disabled: true }]
    });
    if (this.NIVEL_HOSPITAL == 1) {
      this.listar_servicios_primer_nivel();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  sacar_fecha_actual() {
    try {
      this.sql = {
        consulta: "select now()::Date"
      };
      this.parametricasService.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          this.fecha_actual = this.responde.success.data[0].sp_dinamico[0].now;
          this.fecha_inicio = this.fecha_actual;
          this.fecha_fin = this.fecha_actual;
          this.refreshDR();
          this.seleccionar_la_fecha_actual();
          console.log(this.fecha_inicio, "this.fecha_actual", this.fecha_actual);
        } else {
        }
      });
    } catch (error) {
    }
  }

  seleccionar_la_fecha_actual() {
    this.sql = {
      consulta: "select case when to_char(tmp.fecha,$$d$$)= $$1$$ then $$DOMINGO$$ when to_char(tmp.fecha,$$d$$)= $$2$$ then $$LUNES$$ when to_char(tmp.fecha,$$d$$)= $$3$$ then $$MARTES$$ when to_char(tmp.fecha,$$d$$)= $$4$$ then $$MIERCOLES$$ when to_char(tmp.fecha,$$d$$)= $$5$$ then $$JUEVES$$ when to_char(tmp.fecha,$$d$$)= $$6$$ then $$VIERNES$$ when to_char(tmp.fecha,$$d$$)= $$7$$ then $$SABADO$$ end from (select fecha FROM generate_series($$" + this.fecha_inicio + "$$::Date,$$" + this.fecha_fin + "$$::Date, $$1 day$$) fecha )as tmp ORDER BY tmp.fecha"
    };
    this.parametricasService.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        console.log("this.responde.success.data[0].sp_dinamico-----", this.responde.success.data[0].sp_dinamico);
        this.dias_semana.disable();
        this.dias_semana.reset();
        let campo_recorido = this.responde.success.data[0].sp_dinamico;
        for (let index = 0; index < campo_recorido.length; index++) {          
          if (campo_recorido[index].case == 'LUNES') {
            this.dias_semana.get("lunes").enable();
            this.dias_semana.get("lunes").setValue(true);
          }
          if (campo_recorido[index].case == 'MARTES') {
            this.dias_semana.get('martes').enable();
            this.dias_semana.get("martes").setValue(true);
          }
          if (campo_recorido[index].case == 'MIERCOLES') {
            this.dias_semana.get('miercoles').enable();
            this.dias_semana.get("miercoles").setValue(true);
          }
          if (campo_recorido[index].case == 'JUEVES') {
            this.dias_semana.get('jueves').enable();
            this.dias_semana.get("jueves").setValue(true);
          }
          if (campo_recorido[index].case == 'VIERNES') {
            this.dias_semana.get('viernes').enable();
            this.dias_semana.get("viernes").setValue(true);
          }
          if (campo_recorido[index].case == 'SABADO') {
            this.dias_semana.get('sabado').enable();
            this.dias_semana.get("sabado").setValue(true);
          }
          if (campo_recorido[index].case == 'DOMINGO') {
            this.dias_semana.get('domingo').enable();
            this.dias_semana.get("domingo").setValue(true);
          }
        }
      } else {

      }
    });
  }

  comversor(fecha: any) {
    this.cadena = fecha.toString();
    if (this.cadena.length >= 11) {
      var asignado = fecha;
      var fecselect = new Date(asignado);
      this.mes = fecselect.getMonth() + 1;
      this.dia = fecselect.getDate()
      if (fecselect.getDate() < 10) {
        this.dia = "0" + this.dia;
      }
      if (fecselect.getMonth() < 9) {
        this.mes = "0" + this.mes;
      }
      this.fech_mod = fecselect.getFullYear() + "-" + this.mes + "-" + this.dia;
    } else {
      this.fech_mod = fecha;
    }
    return this.fech_mod;
  }

  ngOnInit(): void {
    this.listar_turnos();
    this.listar_prestaciones();
    console.log("data", this.datosModificables);
    console.log("this.datosModificables------",this.datosModificables.tipo);
    if (this.datosModificables.tipo == 'NEW') {
      this.tipoBock = false;
      this.sacar_fecha_actual();
    } else {
      this.tipoBock = true;
      this.recuperarDatos(this.datosModificables.campos);
    }
    
  }

  recuperarDatos(data:any){
    this.datos.fechaSelec = data.ytrn_fecha;
    this.cargarTurno(data.ytrn_tptrn_id);
    this.datos.turnos = data.ytrn_tptrn_id;
    this.datos.servicios = data.ytrn_hspcat_id+'-'+data.ytipo_tiempo;
    this.listar_medicos(this.datos.servicios);
    this.datos.medico = data.ytrn_hspusr_medico_id;
    this.datos.consultorio = data.ytrn_cnsl_id;

    let horaFin = data.yhora_fin.split(':');
    let horaInicio = data.yhora_inicio.split(':');
    this.datos.hora_inicio = new Date(0, 0, 0, horaInicio[0],horaInicio[1]);
    this.datos.hora_fin = new Date(0, 0, 0, horaFin[0],horaFin[1]);
    this.calcular_cantidad_fichas();
    console.log("this.datos",this.datos);
    
  }
  refreshDR() {
    this.sampleRange = new DateRange((() => {
      let v = new Date(this.fecha_inicio);
      v.setDate(v.getDate());
      return v;
    })(), new Date(this.fecha_fin));
  }

  select(data: any) {
    console.log("data", data);
  }
  mostrar(){
    console.log("datos", this.datos);
  }
  seleccionar_fecha(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    console.log(dateRangeStart.value);
    console.log(dateRangeEnd.value);
    this.fecha_inicio = dateRangeStart.value;
    this.fecha_fin = dateRangeEnd.value;
    this.onChange();
  }

  onChange() {
    console.log("--range--", this.range.get('start')?.value);

    if ((new Date(this.fecha_inicio).getTime() <= new Date(this.fecha_fin).getTime())) {
      this.sql = {
        consulta: "select case when to_char(tmp.fecha,$$d$$)= $$1$$ then $$DOMINGO$$ when to_char(tmp.fecha,$$d$$)= $$2$$ then $$LUNES$$ when to_char(tmp.fecha,$$d$$)= $$3$$ then $$MARTES$$ when to_char(tmp.fecha,$$d$$)= $$4$$ then $$MIERCOLES$$ when to_char(tmp.fecha,$$d$$)= $$5$$ then $$JUEVES$$ when to_char(tmp.fecha,$$d$$)= $$6$$ then $$VIERNES$$ when to_char(tmp.fecha,$$d$$)= $$7$$ then $$SABADO$$ end from (select fecha FROM generate_series($$" + this.comversor(this.fecha_inicio) + "$$::Date,$$" + this.comversor(this.fecha_fin) + "$$::Date, $$1 day$$) fecha )as tmp ORDER BY tmp.fecha"
      };
      this.parametricasService.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          console.log("this.responde.success.data[0].sp_dinamico-----", this.responde.success.data[0].sp_dinamico);
          this.dias_semana.disable();
          this.dias_semana.reset();
          let campo_recorido = this.responde.success.data[0].sp_dinamico;
          for (let index = 0; index < campo_recorido.length; index++) {            
            if (campo_recorido[index].case == 'LUNES') {
              this.dias_semana.get("lunes").enable();
            }
            if (campo_recorido[index].case == 'MARTES') {
              this.dias_semana.get('martes').enable();
            }
            if (campo_recorido[index].case == 'MIERCOLES') {
              this.dias_semana.get('miercoles').enable();
            }
            if (campo_recorido[index].case == 'JUEVES') {
              this.dias_semana.get('jueves').enable();
            }
            if (campo_recorido[index].case == 'VIERNES') {
              this.dias_semana.get('viernes').enable();
            }
            if (campo_recorido[index].case == 'SABADO') {
              this.dias_semana.get('sabado').enable();
            }
            if (campo_recorido[index].case == 'DOMINGO') {
              this.dias_semana.get('domingo').enable();
            }
          }
          this.toastr.info('Seleccione el dia de atención', 'NOTA', {
            timeOut: 3000,
            progressBar: true
          });
        } else {

        }
      });

    } else {
      this.toastr.warning('La fecha final tienen que ser superior a la fecha inicio ', 'ADVERTENCIA', {
        timeOut: 3000,
        progressBar: true
      });
    }
    this.refreshDR();
  }

  listar_turnos() {
    try {
      this.sql = {
        consulta: "select * from cbo_turnos_hospitales (" + this.CODIGO_HOSPITAL + ")"
      };
      this.parametricasService.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          this.data_turnos = this.responde.success.data[0].sp_dinamico;
        } else {
          this.data_turnos = [];
        }
      });
    } catch (error) {

    }
  }

  cargarTurno(turno: any) {
    console.log("range", this.range.value);

    console.log(turno);
    var cont = 1;
    console.log("this.dias_semana----", this.dias_semana.value);
    try {
      this.sql = {
        consulta: "select tptrn_id, tptrn_descripcion,to_char(tptrn_hora_inicio,$$HH24:MI$$)as hora_inicio,to_char(tptrn_hora_fin,$$HH24:MI$$)as hora_fin from _hsp_tipo_turnos where tptrn_id = " + turno + " and tptrn_estado = $$A$$"
      };
      this.parametricasService.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          let horas = this.responde.success.data[0].sp_dinamico;
          console.log("horas-----",horas);
          if (this.datosModificables.tipo == 'NEW') {
            let horaFin = horas[0].hora_fin.split(':');
            let horaInicio = horas[0].hora_inicio.split(':');
            this.datos.hora_inicio = new Date(0, 0, 0, horaInicio[0],horaInicio[1]);
            this.datos.hora_fin = new Date(0, 0, 0, horaFin[0],horaFin[1]);
          }
        }
        else {
        }
      });
    } catch (e) {
    }

  };

  listar_prestaciones() {
    try {
      this.sql = {
        consulta: "select * from cbo_pres_grupo_hospital (" + this.CODIGO_HOSPITAL + ")"
      };
      this.parametricasService.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          this.data_prestacion = this.responde.success.data[0].sp_dinamico;
        } else {
          this.data_prestacion = [];
        }
      });
    } catch (error) {
    }
  }

  listar_servicios(id: any) {
    try {
      this.sql = {
        consulta: "select * from cbo_pres_hospital(" + id + "," + this.CODIGO_HOSPITAL + ")"
      };
      this.parametricasService.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          this.data_servicios = this.responde.success.data[0].sp_dinamico;
        } else {
          this.data_servicios = [];
        }
      });
    } catch (error) {
    }
  }

  listar_servicios_primer_nivel() {
    try {
      this.sql = {
        consulta: "select * from primer_nivel.listar_especialidad_primer_nivel(" + this.CODIGO_HOSPITAL + ")"
      };
      this.parametricasService.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          this.data_servicios = this.responde.success.data[0].sp_dinamico;
        } else {
          this.data_servicios = [];
        }
      });
    } catch (error) {
    }
  }

  listar_medicos(id: any) {
    let codigos = id.split('-');
    let codigo_id = codigos[0];
    this.datos.tiempo = codigos[1];
    try {
      this.sql = {
        consulta: "select * from medicolst(" + codigo_id + "," + this.CODIGO_HOSPITAL + ")"
      };
      this.parametricasService.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          this.data_medico = this.responde.success.data[0].sp_dinamico;
          this.listar_consultorios(codigo_id);
          if (this.datosModificables.tipo == 'NEW') {
            this.calcular_cantidad_fichas();
          }          
        } else {
          this.data_medico = [];
        }
      });
    } catch (error) {
    }
  }

  listar_consultorios(id: any) {
    try {
      this.sql = {
        consulta: "select * from consultorio_servicio_lst(" + this.CODIGO_HOSPITAL + "," + id + ")"
      };
      this.parametricasService.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          this.data_consultorio = this.responde.success.data[0].sp_dinamico;
        } else {
          this.data_consultorio = [];
        }
      });
    } catch (error) {
    }
  }

  calcular_cantidad_fichas() {
    try {
      this.sql = {
        consulta: "select * from sp_calcular_hora($$" + this.parametricasService.comvertir_formato_hora(this.datos.hora_inicio)  + "$$,$$" + this.parametricasService.comvertir_formato_hora(this.datos.hora_fin) + "$$,$$" + this.datos.tiempo + "$$)"
      };
      console.log("this.sql",this.sql);
      
      this.parametricasService.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          this.datos.cantidad_fichas = this.responde.success.data[0].sp_dinamico[0].sp_calcular_hora;
        } else {
          this.datos.cantidad_fichas = "";
        }
      });
    } catch (error) {
    }
  }
  sacarfecha(event: any) {
    console.log("event---", event);
    console.log("event---", event._i);
    let date = new Date();
    let output = String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + date.getFullYear();
    var hoy = new Date(event);
    var hora = hoy.getHours() + ':' + hoy.getMinutes();
  }
  generarFichas() {
    let array = {
      "DOMINGO": (this.dias_semana.controls.domingo.value || false),
      "LUNES": (this.dias_semana.controls.lunes.value || false),
      "MARTES": (this.dias_semana.controls.martes.value || false),
      "MIERCOLES": (this.dias_semana.controls.miercoles.value || false),
      "JUEVES": (this.dias_semana.controls.jueves.value || false),
      "VIERNES": (this.dias_semana.controls.viernes.value || false),
      "SABADO": (this.dias_semana.controls.sabado.value || false)
    }
    let codigos = this.datos.servicios.split('-');
    let codigo_id = codigos[0];
    console.log("************", this.datos);
    var ini = new Date(this.datos.hora_inicio);
    this.datos.hora_inicio = ini.getHours() + ':' + ini.getMinutes();
    var fin = new Date(this.datos.hora_fin);
    this.datos.hora_fin = fin.getHours() + ':' + fin.getMinutes();
    try {
      this.sql = {
        consulta: "select * from sp_abm_turno($$"+JSON.stringify(array)+"$$,$$"+this.comversor(this.fecha_inicio)+"$$,$$"+this.comversor(this.fecha_fin)+"$$,"+this.datos.consultorio+","+this.datos.turnos+","+codigo_id+","+this.datos.medico+",$$"+this.datos.hora_inicio+"$$,$$"+this.datos.hora_fin+"$$,"+this.CODIGO_HOSPITAL+","+this.datos.tiempo+",1)"
      };
      this.parametricasService.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          this.datos.cantidad_fichas = this.responde.success.data[0].sp_dinamico[0].sp_calcular_hora;
        } else {
          this.datos.cantidad_fichas = "";
        }
      });
    } catch (error) {
    }
  }

  modificarFichas(){
    try {
      this.sql = {
        //'+datosCronograma.yhsp_tptrn_id+','+parseInt(datosCronograma.ytrn_tptrn_id)+','+parseInt(datosCronograma.ytrn_fichas_precitadas)+',$$'+datosCronograma.ytipo_tiempo+'$$,$$'+datosCronograma.yhora_inicio+'$$,$$'+datosCronograma.yhora_fin+'$$,'+sessionService.get('IDUSUARIO')+','+idcr+','+datosCronograma.ytrn_hspusr_medico_id+'
        consulta: "select * from sp_modificar_turno_generico("+this.datosModificables.campos.ytrn_tptrn_id+","+this.datosModificables.campos.ytrn_tptrn_id+","+this.NIVEL_HOSPITAL+",$$"+this.datosModificables.campos.ytipo_tiempo+"$$,$$"+this.parametricasService.comvertir_formato_hora(this.datos.hora_inicio)+"$$,$$"+this.parametricasService.comvertir_formato_hora(this.datos.hora_fin)+"$$,1,"+this.datosModificables.campos.ytrn_id+","+this.datos.medico+")"
        //consulta: "select * from sp_abm_turno($$"+JSON.stringify(array)+"$$,$$"+this.comversor(this.fecha_inicio)+"$$,$$"+this.comversor(this.fecha_fin)+"$$,"+this.datos.consultorio+","+this.datos.turnos+","+codigo_id+","+this.datos.medico+",$$"+this.datos.hora_inicio+"$$,$$"+this.datos.hora_fin+"$$,"+this.CODIGO_HOSPITAL+","+this.datos.tiempo+",1)"
      };
      this.parametricasService.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          
        } else {
          
        }
      });
    } catch (error) {
    }
  }

}
