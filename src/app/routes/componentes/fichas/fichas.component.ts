import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MtxPopoverPositionEnd, MtxPopoverPositionStart } from '@ng-matero/extensions/popover';
import { MatStepper } from '@angular/material/stepper';
import { ToastrService } from 'ngx-toastr';
import { ComponentesService } from '../componentes.service';


@Component({
  selector: 'app-fichas',
  templateUrl: './fichas.component.html',
  styleUrls: ['./fichas.component.scss'],

})
export class FichasComponent implements OnInit {
  @Input() datos_seleccionados: any;

  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  //////////servicios/////////
  sql: any;
  responde: any;
  //////////servicios/////////
  
  lista_especialidades: any = [];
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
  dataReserva: any = [];
  @Output() datosFicha = new EventEmitter<any>();

  constructor(private toastr: ToastrService, private http: ComponentesService) {
    
  }



  guardarFicha(value: any) {
    console.log(value);
    this.datosFicha.emit(value);
  }

  ngOnInit(): void {
    this.listar_especialidades();
  }

  listar_especialidades() {
    try {
      var params_data = {
        "idhospital": this.CODIGO_HOSPITAL,
        "idtiposerguro": 0
      }
      this.http.lista_especialidades(params_data).subscribe(res => {
        this.lista_especialidades = res.success.data;
        console.log(res.success.data);
      });


    } catch (error) {
    }
  }

  listar_fichas(stepper: MatStepper, doc: any) {
    console.log("doc", doc);
    this.doctor_seleccionado = doc;
    try {
      var params_data = {
        "thospital": this.CODIGO_HOSPITAL,
        "turnoid": doc.trn_id //93892
      }
      this.http.lista_fichas(params_data).subscribe(res => {
        this.data_fichas = res.success.data[0].fichas;
        this.id_turno = res.success.data[0].fid;
        this.id_medico = res.success.data[0].ftrnhspmedico_id;
        this.fechaSeleccionada = res.success.data[0].ftrn_fecha;
        stepper.next();
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
        this.toastr.success('Ficha seleccionada ' + datos_ficha.Ficha, 'NOTA', {
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
    this.dataReserva.id_servicio = this.id_servicio
    this.dataReserva.fechaSeleccionada = this.http.comversor(this.fechaSeleccionada)
    this.dataReserva.numero_ficha = this.numero_ficha
    this.dataReserva.id_turno = this.id_turno
    this.dataReserva.id_medico = this.id_medico
    this.dataReserva.codigo_ficha = this.codigo_ficha
    this.dataReserva.inicio_hora = this.inicio_hora
    this.dataReserva.fin_hora = this.fin_hora

  }



  SacarCalendario(stepper: MatStepper, detalle: any) {
    console.log("detalle", detalle);
    this.id_servicio = detalle.vesp_id;
    this.decEspecialidad = detalle.cpgrupo;
    try {
      var params_data = {
        "fecha_inicio": "2023-09-01",
        "fecha_fin": "2023-09-25",
        "mes": "9",
        "anio": "2023",
        "hosp": this.CODIGO_HOSPITAL,
        "espe": detalle.vesp_id, //222,
        "tipo": "S"
        //"tipo": "new"
      }
      this.http.lista_calendario(params_data).subscribe(res => {
        this.calendario = res.success.data[0].calendario;
        console.log("this.calendario------->", JSON.stringify(this.calendario));
        
        for (let i = 0; i < this.calendario.length; i++) {
          const element = this.calendario[i];
        }
        stepper.next();
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
      finalCode = finalCode + makingColorCode[Math.floor(Math.random() * 16)];
    }
    return finalCode;
  }

  getRandomColor() {
    this.ColorCode();
  }



}
