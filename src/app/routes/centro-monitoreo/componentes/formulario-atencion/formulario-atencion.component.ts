import { Component, OnInit, AfterViewInit, Inject, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DateRange, MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER } from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CentroMonitoreoService } from '../../centro-monitoreo.service';

//import { ComponentesService } from '../componentes.service';


export interface cie10Seleccionados {
}
@Component({
  selector: 'app-formulario-atencion',
  templateUrl: './formulario-atencion.component.html',
  styleUrls: ['./formulario-atencion.component.scss']
})
export class FormularioAtencionComponent implements OnInit, AfterViewInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  @Input() hospital: any;
  @Output() retornarData = new EventEmitter();
  externos: boolean = false;
  cie10Eliminado: any = [];

  sql: any;
  responde: any;

  /* VARIABLES */
  data_fecha: any = [];
  data_hospitales: any = [];
  data_triaje: any = [];
  data_guardia: any = [];
  data_regulador: any = [];
  data_conductor: any = [];
  data_paramedico: any = [];
  data_cie10: any = [];
  data_diagnostico: any = [];
  data_insertar: any = [];
  valorDataHosp: any;
  value = '';
  //datoHora: any;
  datoHoraSalida: any;
  datoHoraContacto: any;
  horaEntregaPaciente: any;
  datoHoraEspera: any;
  datoHoraRetorno: any;
  //datoGuardia: any;
  formDatosSolicitud: any = {};

  datoHoraSalida2: any;
  //formDatosSolicitud: FormGroup;
  habRef: boolean = false;
  habServ: boolean = false;
  habCuent: boolean = false;
  habAsist: boolean = false;

  habReg: boolean = false;
  habAtenPac: boolean = false;
  habSolHosp: boolean = false;

  displayedColumns: string[] = [
    'alfa',
    'descripcion'
  ];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private http: CentroMonitoreoService
  ) {
    this.dataSource = new MatTableDataSource();

    this.formDatosSolicitud = this.fb.group({
      value: [''],
      fecha: ['', [Validators.required]],
      horaSolicitud: [{ value: '' }, [Validators.required]],
      horaSalida: [''],
      tiempoEspera: [''],
      horaContacto: [''],
      horaEntregaPaciente: [''],
      horaRetorno: [''],
      solicitante: ['', [Validators.required]],
      paciente: ['', [Validators.required]],
      origen: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
      destino: [{ value: '' }, [Validators.required]],
      destino2: [{ value: '' }, [Validators.required]],
      edad: ['', [Validators.required]],
      triaje: [''],
      tipo_urgencia: [''],
      tiempo_espera: [''],
      guardia_turno: ['', [Validators.required]],
      unidad: ['', [Validators.required]],
      regulador: ['', [Validators.required]],
      conductor: ['', [Validators.required]],
      paramedico: ['', [Validators.required]],

      ref_coordinada: ['', [Validators.required]],
      noCoordinada: ['', [Validators.required]],
      serv_realizado: ['', [Validators.required]],
      noRealizado: ['', [Validators.required]],
      cuenta_unidad: ['', [Validators.required]],
      sinUnidad: ['', [Validators.required]],
      asistido_x_personal: [{ value: '', disabled: true }, [Validators.required]],
      otroPersonal: [{ value: '', disabled: true }, [Validators.required]],
      diagnostico: [''],
      tratamiento: [''],
      diagnosticoIngreso: ['', [Validators.required]],
      diagnosticoIngresoInicial: ['', [Validators.required]]
    });
  }

  dataSource: MatTableDataSource<cie10Seleccionados>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  recargar() {
    this.dataSource = new MatTableDataSource(this.data_cie10);
    this.ngAfterViewInit();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  obternerDatos() {
    console.log("----this.hospital", this.hospital);

    if (this.hospital.tipo == "NIVEL2") {
      this.habReg = true;
      this.habAtenPac = false;
      this.habSolHosp = false;
      if (this.hospital.campos.hsp_nombre_hospital) {
        this.formDatosSolicitud.get('destino').setValue(this.hospital.campos.hsp_nombre_hospital);
        /////this.formDatosSolicitud.get('destino').disable();
        //this.formDatosSolicitud.get('horaSolicitud').disable();
        /*this.formDatosSolicitud.get("ref_coordinada").disable();
        this.formDatosSolicitud.get("noCoordinada").disable();*/
      } else {
        this.externos = true;
        this.formDatosSolicitud.get("asistido_x_personal").enable();
        this.formDatosSolicitud.get("otroPersonal").enable();
      }
    }
    if (this.hospital.tipo == "UPDATE") {
      this.habReg = false;
      this.habAtenPac = true;
      this.habSolHosp = true;
      this.data_diagnostico = [];
      var armajson = this.hospital.campos.vad_data_solicitud.diagnosticoIngreso.split("\n");
      for (let index = 0; index < armajson.length; index++) {
        const element = armajson[index];
        if (element != '') {
          var armajson2 = element.split("-");
          this.data_diagnostico.push(
            {
              "alfa": armajson2[0],
              "descripcion": armajson2[1],
              "tipo_cie10": "INICIO",
            });
        }
      }
      this.formDatosSolicitud.get('destino').setValue(this.hospital.campos.vad_data_solicitud.destino);
      ///this.formDatosSolicitud.get('destino').disable();
      this.formDatosSolicitud.get('cuenta_unidad').setValue(this.hospital.campos.vad_data_solicitud.cuenta_unidad);
      ///this.formDatosSolicitud.get('cuenta_unidad').disable();
      this.formDatosSolicitud.get('destino2').setValue(this.hospital.campos.vad_data_solicitud.destino2);
      this.formDatosSolicitud.get('diagnostico').setValue(this.hospital.campos.vad_data_solicitud.diagnostico);
      this.formDatosSolicitud.get('diagnosticoIngreso').setValue(this.hospital.campos.vad_data_solicitud.diagnosticoIngreso);
      this.formDatosSolicitud.get('diagnosticoIngresoInicial').setValue(this.hospital.campos.vad_data_solicitud.diagnosticoIngresoInicial);
      this.formDatosSolicitud.get('fecha').setValue(this.hospital.campos.vad_data_solicitud.fecha);
      ///this.formDatosSolicitud.get('fecha').disable();
      this.formDatosSolicitud.get('guardia_turno').setValue(this.hospital.campos.vad_data_solicitud.guardia_turno);
      ///this.formDatosSolicitud.get('guardia_turno').disable();
      this.formDatosSolicitud.get('horaContacto').setValue(this.formato(this.hospital.campos.vad_data_solicitud.horaContacto));
      /////this.formDatosSolicitud.get('horaContacto').disable();
      this.formDatosSolicitud.get('horaEntregaPaciente').setValue(this.formato(this.hospital.campos.vad_data_solicitud.horaEntregaPaciente));
      /////this.formDatosSolicitud.get('horaEntregaPaciente').disable();
      this.formDatosSolicitud.get('horaRetorno').setValue(this.formato(this.hospital.campos.vad_data_solicitud.horaRetorno));
      /////this.formDatosSolicitud.get('horaRetorno').disable();
      this.formDatosSolicitud.get('horaSalida').setValue(this.formato(this.hospital.campos.vad_data_solicitud.horaSalida));
      ///this.formDatosSolicitud.get('horaSalida').disable();
      this.formDatosSolicitud.get('tiempoEspera').setValue(this.formato(this.hospital.campos.vad_data_solicitud.tiempoEspera));
      /////this.formDatosSolicitud.get('tiempoEspera').disable();
      this.formDatosSolicitud.get('horaSolicitud').setValue(this.hospital.campos.vad_data_solicitud.horaSolicitud);
      ///this.formDatosSolicitud.get('horaSolicitud').disable();
      this.formDatosSolicitud.get('noCoordinada').setValue(this.hospital.campos.vad_data_solicitud.noCoordinada);
      ///this.formDatosSolicitud.get('noCoordinada').disable();
      this.formDatosSolicitud.get('noRealizado').setValue(this.hospital.campos.vad_data_solicitud.noRealizado);
      ///this.formDatosSolicitud.get('noRealizado').disable();
      this.formDatosSolicitud.get('paramedico').setValue(this.hospital.campos.vad_data_solicitud.paramedico);
      ///this.formDatosSolicitud.get('paramedico').disable();
      this.formDatosSolicitud.get('ref_coordinada').setValue(this.hospital.campos.vad_data_solicitud.ref_coordinada);
      ///this.formDatosSolicitud.get('ref_coordinada').disable();
      this.formDatosSolicitud.get('serv_realizado').setValue(this.hospital.campos.vad_data_solicitud.serv_realizado);
      ///this.formDatosSolicitud.get('serv_realizado').disable();
      this.formDatosSolicitud.get('sinUnidad').setValue(this.hospital.campos.vad_data_solicitud.sinUnidad);
      ///this.formDatosSolicitud.get('sinUnidad').disable();
      this.formDatosSolicitud.get('solicitante').setValue(this.hospital.campos.vad_data_solicitud.solicitante);
      ///this.formDatosSolicitud.get('solicitante').disable();
      this.formDatosSolicitud.get('paciente').setValue(this.hospital.campos.vad_data_solicitud.paciente);
      ///this.formDatosSolicitud.get('paciente').disable();
      this.formDatosSolicitud.get('sexo').setValue(this.hospital.campos.vad_data_solicitud.sexo);
      ///this.formDatosSolicitud.get('sexo').disable();
      this.formDatosSolicitud.get('origen').setValue(this.hospital.campos.vad_data_solicitud.origen);
      ///this.formDatosSolicitud.get('origen').disable();
      this.formDatosSolicitud.get('edad').setValue(this.hospital.campos.vad_data_solicitud.edad);
      ///this.formDatosSolicitud.get('edad').disable();
      this.formDatosSolicitud.get('tiempo_espera').setValue(this.hospital.campos.vad_data_solicitud.tiempo_espera);
      ///this.formDatosSolicitud.get('tiempo_espera').disable();
      this.formDatosSolicitud.get('tipo_urgencia').setValue(this.hospital.campos.vad_data_solicitud.tipo_urgencia);
      ///this.formDatosSolicitud.get('tipo_urgencia').disable();      
      this.formDatosSolicitud.get('tratamiento').setValue(this.hospital.campos.vad_data_solicitud.tratamiento);
      this.formDatosSolicitud.get('triaje').setValue(this.hospital.campos.vad_data_solicitud.triaje);
      ///this.formDatosSolicitud.get('triaje').disable();
      this.formDatosSolicitud.get('unidad').setValue(this.hospital.campos.vad_data_solicitud.unidad);
      ///this.formDatosSolicitud.get('unidad').disable();
      this.formDatosSolicitud.get('regulador').setValue(this.hospital.campos.vad_data_solicitud.regulador);
      ///this.formDatosSolicitud.get('regulador').disable();
      this.formDatosSolicitud.get('conductor').setValue(this.hospital.campos.vad_data_solicitud.conductor);
      ///this.formDatosSolicitud.get('conductor').disable();      
      this.formDatosSolicitud.get("asistido_x_personal").enable();
      this.formDatosSolicitud.get("otroPersonal").enable();
    }
  }
  formato(data: any) {
    const formatoHora = '';
    try {
      const valor = data.split(':');
      const formatoHora = new Date(0, 0, 0, valor[0], valor[1])
      return formatoHora;
    } catch (error) {
      return formatoHora;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    try {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } catch (error) {
    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.listarFechaActual();
    this.listarCie10();
    this.listarHospitales();
    this.listarTriaje();
    setTimeout(() => {
      this.obternerDatos();
      console.log("*", this.hospital);
    }, 100);    
  }

  listarFechaActual() {
    const params_listar_fecha = {};
    this.http.listaFechaActual(params_listar_fecha).subscribe(res => {
      this.data_fecha = res.success.data;
      this.formDatosSolicitud.get('fecha').setValue(this.data_fecha[0].fecha);
      this.formDatosSolicitud.get('horaSolicitud').setValue(this.data_fecha[0].hora);
    });
  }


  listarCie10() {
    const params_listar_cie10 = {};
    this.http.listaCie10(params_listar_cie10).subscribe(res => {
      this.data_cie10 = res.success.data;
      this.dataSource = new MatTableDataSource(this.data_cie10);
      this.ngAfterViewInit();
    });
  }

  listarHospitales() {
    const params_listar_hospExt = {};
    this.http.listaHospitalesExternos(params_listar_hospExt).subscribe(res => {
      this.data_hospitales = res.success.data;
    });
  }

  seleccionHospitalExterno(dato: any) {
    for (let index = 0; index < this.data_hospitales.length; index++) {
      if (this.data_hospitales[index].hsp_cm_id == dato) {
        this.formDatosSolicitud.get('destino').setValue(this.data_hospitales[index].hsp_cm_descripcion);
      }
    }
  }


  listarTriaje() {
    const params_listar_triaje = {};
    this.http.listaTriaje(params_listar_triaje).subscribe(res => {
      this.data_triaje = res.success.data;
      for (let x = 0; x < this.data_triaje.length; x++) {
        if (this.data_triaje[x].tria_clasificacion == "ROJO") {
          this.data_triaje[x].color = 'background: red;color: white;'
        }
        if (this.data_triaje[x].tria_clasificacion == "NARANJA") {
          this.data_triaje[x].color = 'background: orange;color: white;'
        }
        if (this.data_triaje[x].tria_clasificacion == "AMARILLO") {
          this.data_triaje[x].color = 'background: yellow;color: #020202;'
        }
        if (this.data_triaje[x].tria_clasificacion == "VERDE") {
          this.data_triaje[x].color = 'background: green;color: white;'
        }
        if (this.data_triaje[x].tria_clasificacion == "AZUL") {
          this.data_triaje[x].color = 'background: blue;color: white;'
        }
      }
    });
  }

  seleccionTriaje(dato: any) {
    for (let index = 0; index < this.data_triaje.length; index++) {
      if (this.data_triaje[index].tria_id == dato) {
        this.formDatosSolicitud.get('tipo_urgencia').setValue(this.data_triaje[index].tria_descripcion);
        this.formDatosSolicitud.get('tiempo_espera').setValue(this.data_triaje[index].tria_tiempo_espera);
      }
    }
  }


  seleccionGuardia(dato: any) {
    this.formDatosSolicitud.get('unidad').setValue('Combo 5');
    this.formDatosSolicitud.get('regulador').setValue(dato);
    this.formDatosSolicitud.get('conductor').setValue(dato);
    this.formDatosSolicitud.get('paramedico').setValue(dato);
    this.listarRegulador(dato);
    this.listarConductor(dato);
    this.listarParamedico(dato);
  }

  listarRegulador(dato: any) {
    const params_listar_regulador = {
      "regulador": 'REGULADOR',
      "guardia": dato
    };
    this.http.listaRegulador(params_listar_regulador).subscribe(res => {
      this.data_regulador = res.success.data;
    });
  }

  seleccionRegulador(dato: any) {
  }

  listarConductor(dato: any) {
    const params_listar_conductor = {
      "guardia": dato
    };
    this.http.listaConductor(params_listar_conductor).subscribe(res => {
      this.data_conductor = res.success.data;
    });
  }

  seleccionConductor(dato: any) {
  }

  listarParamedico(dato: any) {
    const params_listar_paramedico = {
      "regulador": 'PARAMEDICO',
      "guardia": dato
    };
    this.http.listaParamedico(params_listar_paramedico).subscribe(res => {
      this.data_paramedico = res.success.data;
    });
  }

  seleccionParamedico(dato: any) {
  }

  fechaAtencion(dateRangeStart: HTMLInputElement) {
  }

  atras() {
  }

  registrarSolicitud() {
    this.formDatosSolicitud.get('horaSalida').setValue(this.datoHoraSalida);
    this.formDatosSolicitud.get('horaContacto').setValue(this.datoHoraContacto);
    this.formDatosSolicitud.get('tiempoEspera').setValue(this.datoHoraEspera);
    this.formDatosSolicitud.get('horaRetorno').setValue(this.datoHoraRetorno);
    this.formDatosSolicitud.get('horaEntregaPaciente').setValue(this.horaEntregaPaciente);
    this.formDatosSolicitud.get('destino').setValue(this.hospital.campos.hsp_nombre_hospital);

    console.log(this.formDatosSolicitud.value);

    const params_insertar_atencion = {
      "hspid": this.hospital.campos.hsp_id,
      "tipoAtencion": "$INTERNACIONES",
      "datosAtencion": this.formDatosSolicitud.value
    };
    console.log(params_insertar_atencion);
    this.http.insertarRegistro(params_insertar_atencion).subscribe(res => {
      this.data_insertar = res.success.data;
      console.log(this.data_insertar);
      this.retornarData.emit();
    });
  }


  verificacion = (array: any, searchedAge: any) => {
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      if (element.alfa === searchedAge) {
        return false;
      }
    }
    return true;
  }

  addDiagnostico(dato: any) {
    var tipo = this.verificacion(this.data_diagnostico, dato.alfa);
    if (tipo) {
      this.data_diagnostico.push(dato);
      for (let x = 0; x < this.data_diagnostico.length; x++) {
        if (this.data_diagnostico[x].tipo_cie10 == 'INICIO') {
          this.data_diagnostico[x].color = 'background: white;';
        } else {
          this.data_diagnostico[x].color = 'background: #96ede9;';
        }
      }

      this.formDatosSolicitud.get('diagnosticoIngreso').setValue(this.formDatosSolicitud.get('diagnosticoIngreso').value + "" + dato.alfa + "-" + dato.descripcion + "\n");
      this.formDatosSolicitud.get('diagnosticoIngresoInicial').setValue(this.formDatosSolicitud.get('diagnosticoIngresoInicial').value + "" + dato.alfa + "-" + dato.descripcion + "\n");
    } else {
      this.toastr.info('Registro ya seleccionado', '', {
        progressBar: true,
        closeButton: true,
        newestOnTop: false,
        tapToDismiss: false
      });
    }
  }

  eliminar_seleccionado(id: any, data: any): void {
    this.data_diagnostico.splice(id, 1);
    if (data.tipo_cie10 == 'INICIO') {
      this.cie10Eliminado.push(data);
    }
  }

  seleccionCheck(dato: any) {
  }

  seleccionSexo(dato: any) {
  }


  seleccionReferencia(dato: any) {
    if (dato == 'SI') {
      this.habRef = false;
    } else {
      this.habRef = true;
    }
  }

  seleccionServicio(dato: any) {
    if (dato == 'SI') {
      this.habServ = false;
    } else {
      this.habServ = true;
    }
  }

  seleccionCuenta(dato: any) {
    if (dato == 'SI') {
      this.habCuent = false;
    } else {
      this.habCuent = true;
    }
  }

  seleccionAsistido(dato: any) {
    if (dato == 'SI') {
      this.habAsist = true;
    } else {
      this.habAsist = false;
    }
  }

  convertirHoraSalida(dato: any) {
    this.datoHoraSalida = this.http.comvertir_formato_hora(dato);
  }

  convertirHoraContacto(dato: any) {
    this.datoHoraContacto = this.http.comvertir_formato_hora(dato);
  }

  convertirhoraEntregaPaciente(dato: any) {
    this.horaEntregaPaciente = this.http.comvertir_formato_hora(dato);
  }

  convertirHoraEspera(dato: any) {
    this.datoHoraEspera = this.http.comvertir_formato_hora(dato);
  }

  convertirHoraRetorno(dato: any) {
    this.datoHoraRetorno = this.http.comvertir_formato_hora(dato);
  }

  derivarHospital() {
    /*try {
      this.sql = {
        consulta: "select * from actualizar_atencion_monitoreo(" + this.hospital.campos.vad_id + ",$$" + JSON.stringify(this.formDatosSolicitud.value) + "$$)"
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          this.retornarData.emit();
        } else {
        }
      });
    } catch (error) {
    }*/

    const params_actualizar_atencion = {
      'num': this.hospital.campos.vad_id,
      'broo': JSON.stringify(this.formDatosSolicitud.value)
    };
    console.log(params_actualizar_atencion);
    this.http.actualizarrRegistro(params_actualizar_atencion).subscribe(res => {
      this.responde = res.success.data;
      console.log(this.responde);
      this.retornarData.emit();
    });
  }

  atenderPaciente() {
    /*try {
      this.sql = {
        consulta: "select * from finalizar_atencion_monitoreo(" + this.hospital.campos.vad_id + ",$$" + JSON.stringify(this.formDatosSolicitud.value) + "$$)"
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          this.retornarData.emit();
        } else {
        }
      });
    } catch (error) {
    }*/
    const params_finalizar_atencion = {
      'num': this.hospital.campos.vad_id,
      'broo': JSON.stringify(this.formDatosSolicitud.value)
    };
    console.log(params_finalizar_atencion);
    this.http.finalizarRegistro(params_finalizar_atencion).subscribe(res => {
      this.responde = res.success.data;
      console.log(this.responde);
      this.retornarData.emit();
    });
  }



}
