import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PrimerNivelService } from '../../primer-nivel.service';
import { MtxPopoverPositionEnd, MtxPopoverPositionStart } from '@ng-matero/extensions/popover';
import { MatStepper } from '@angular/material/stepper';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reservar-ficha',
  templateUrl: './reservar-ficha.component.html',
  styleUrls: ['./reservar-ficha.component.scss']
})
export class ReservarFichaComponent implements OnInit {
  @Input() datos_seleccionados: any;

  CODIGO_HOSPITAL = 10;
  //////////servicios/////////
  sql: any;
  responde: any;
  //////////servicios/////////

  lista_especialidades: any;
  data_fichas: any;

  isEditable = false;
  isLinear = true;

  id_servicio: any;
  id_turno: Number = 0;
  id_medico: Number = 0;
  numero_ficha: any;
  codigo_ficha: any;
  inicio_hora: any;
  fin_hora: any;
  doctor_seleccionado: any = {};
  calendario: any = [];
  enterDelay = 200;
  leaveDelay = 200;
  xOffset = 0;
  yOffset = 0;
  closeOnPanelClick = false;
  triggerOn: 'hover' | 'click' = 'hover';


  positionStart: MtxPopoverPositionStart = 'after';
  positionEnd: MtxPopoverPositionEnd = 'below';
  fechaSeleccionada: any;
  horaAtencion: String = '';
  fichaSeleccionada: String = '';
  decMedico: any = [];
  decEspecialidad: String = '';
  dataReserva:any = [];
  @Output() newItemEvent = new EventEmitter<any>();

  constructor(private toastr: ToastrService, private http: PrimerNivelService) {
    this.listar_especialidades();
  }



  addNewItem(value: any) {
    this.newItemEvent.emit(value);
  }

  ngOnInit(): void {
  }

  listar_especialidades() {
    try {
      this.sql = {
        consulta: "select * from primer_nivel.sp_lst_servicios_especialidad_precio(" + this.CODIGO_HOSPITAL + ",0)"
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          console.log("this.responde.success.data[0].sp_dinamico", this.responde.success.data[0].sp_dinamico);
          this.lista_especialidades = this.responde.success.data[0].sp_dinamico;
        } else {
        }
      });
    } catch (error) {
    }
  }

  listar_fichas(stepper: MatStepper, doc: any) {
    this.doctor_seleccionado = doc;
    try {
      this.sql = {
        consulta: "select * from lst_cronograma_prestacion(" + this.CODIGO_HOSPITAL + "," + this.doctor_seleccionado.trn_id + ")"
        //consulta: "select * from primer_nivel.sp_listar_cronograma_atenciones("+this.CODIGO_HOSPITAL+","+this.doctor_seleccionado.trn_id+")"
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          console.log("listar_fichas", this.responde.success.data[0].sp_dinamico);
          this.data_fichas = this.responde.success.data[0].sp_dinamico[0].fichas;
          this.id_turno = this.responde.success.data[0].sp_dinamico[0].fid;
          this.id_medico = this.responde.success.data[0].sp_dinamico[0].ftrnhspmedico_id;
          this.fechaSeleccionada = this.responde.success.data[0].sp_dinamico[0].ftrn_fecha;
          stepper.next();
        } else {
          this.data_fichas = [];
          this.id_turno = 0;
          this.id_medico = 0;
          this.fechaSeleccionada = '';
        }
      });
    } catch (error) {
    }
  }

  seleccionar_ficha(stepper: MatStepper, datos_ficha: any) {
    switch (datos_ficha.Estado) {
      case datos_ficha.Estado = 'P':
        this.toastr.info('Ficha vencida', 'NOTA', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true,
          newestOnTop: false,
          extendedTimeOut: 0,
          tapToDismiss: false
        });
        break;
      case datos_ficha.Estado = 'O':
        this.toastr.info('Ficha ocupada', 'NOTA', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true,
          newestOnTop: false,
          extendedTimeOut: 0,
          tapToDismiss: false
        });
        break;
      case datos_ficha.Estado = 'L':
        this.toastr.success('Ficha seleccionada '+datos_ficha.Ficha , 'NOTA', {
          timeOut: 2000,
          progressBar: true,
          closeButton: true,
          newestOnTop: false,
          extendedTimeOut: 0,
          tapToDismiss: false
        });
        stepper.next();
        break;
      default:
        break;
    }
    let codigo = datos_ficha.Ficha;
    let numero = codigo.split('/');
    this.numero_ficha = parseInt(numero[1]);
    this.codigo_ficha = datos_ficha.Ficha;
    this.horaAtencion = datos_ficha.Hora;
    this.fichaSeleccionada = datos_ficha.Ficha;
    let horas = datos_ficha.Hora.split(' a ');
    this.inicio_hora = horas[0];
    this.fin_hora = horas[1];
    /*this.toastr.info('Seleccione el dia de atención', 'NOTA', {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
      newestOnTop: false,
      extendedTimeOut: 0,
      tapToDismiss: false,
      positionClass: "toast-bottom-left"
    });*/
    console.log("vv");
    //console.log(this.paciente_seleccionado.codigo);
    console.log(this.id_servicio);
    console.log(this.http.comversor(this.fechaSeleccionada));
    console.log(this.numero_ficha);
    console.log(this.CODIGO_HOSPITAL);
    console.log(this.id_turno);
    console.log(this.id_medico);
    console.log(this.codigo_ficha);
    console.log(this.inicio_hora);
    console.log(this.fin_hora);
    console.log("this.dataReserva",this.dataReserva);
    
    
    this.dataReserva.id_servicio = this.id_servicio
    this.dataReserva.fechaSeleccionada = this.http.comversor(this.fechaSeleccionada)
    this.dataReserva.numero_ficha = this.numero_ficha    
    this.dataReserva.id_turno = this.id_turno
    this.dataReserva.id_medico = this.id_medico
    this.dataReserva.codigo_ficha = this.codigo_ficha
    this.dataReserva.inicio_hora = this.inicio_hora
    this.dataReserva.fin_hora = this.fin_hora

    console.log("this.dataReserva----",this.dataReserva);

  }



  SacarCalendario(stepper: MatStepper, detalle: any) {
    console.log("detalle", detalle);
    this.id_servicio = detalle.vesp_id;
    this.decEspecialidad = detalle.cpgrupo;
    try {
      this.sql = {
        consulta: "select * from primer_nivel.sp_dias_programadas(null,null,$$$$,$$$$," + this.CODIGO_HOSPITAL + "," + this.id_servicio + ",$$new$$)"
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          console.log("this.responde.success.data[0].sp_dinamico", this.responde.success.data[0].sp_dinamico);
          this.calendario = this.responde.success.data[0].sp_dinamico[0].calendario;
          for (let i = 0; i < this.calendario.length; i++) {
            const element = this.calendario[i];
          }
          stepper.next();
        } else {
          this.calendario = [];
        }
      });
    } catch (error) {
    }
  }

  datoMedico(data: any) {
    console.log("entra trn_id", data);
    this.decMedico = data;
  }

  sigiente(stepper: MatStepper) {
    stepper.next();
  }

  anterior(stepper: MatStepper) {
    stepper.previous();
  }

  ColorCode() {
    var makingColorCode = '0123456789ABCDEF';
    var finalCode = '#';
    for (var counter = 0; counter < 6; counter++) {
       finalCode =finalCode+ makingColorCode[Math.floor(Math.random() * 16)];
    }
    return finalCode;
 }
 //Function calling on button click.
 getRandomColor() {
    this.ColorCode();
 }
}
