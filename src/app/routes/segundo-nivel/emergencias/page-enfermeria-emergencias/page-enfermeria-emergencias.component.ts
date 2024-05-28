import { Component, AfterViewInit, ViewChild, } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MtxPopoverPositionEnd, MtxPopoverPositionStart } from '@ng-matero/extensions/popover';
import { MatStepper } from '@angular/material/stepper';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

import { EmergenciasService } from '../emergencias.service';

export interface EnfermeriaData {
}

export interface Turno {
  tptrn_id: string;
  tptrn_descripcion: string;
}

@Component({
  selector: 'app-page-enfermeria-emergencias',
  templateUrl: './page-enfermeria-emergencias.component.html',
  styleUrls: ['./page-enfermeria-emergencias.component.scss']
})
export class PageEnfermeriaEmergenciasComponent implements AfterViewInit {

  selectedTurnos = new FormControl();
  turnos: Turno[] = [];
  selectedValue: any;

  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  value = '';
  //////////servicios/////////
  sql: any;
  responde: any;

  isEditable = false;
  isLinear = true;

  //////////servicios/////////
  displayedColumns: string[] = [
    'serial',
    'dtspslid',
    'vhcl_codigoseg',
    'vprs_fecha_atencion',
    'vpaciente',
    'vtconsulta',
    'tipopaciente',
    'vprs_estado_prestacion_enfermera',
    'vpres_medico',
    'atender'
  ];

  currentSignosVitales = {
    "peso": "",
    "altura": "",
    "temperaturaAxilar": "",
    "temperaturaRectal": "",
    "temperaturaOral": "",
    "temperaturaAuricular": "",
    "frecuenciaCardiaca": "",
    "presionArterial": "",
    "frecuenciaRespiratoria": "",
    "saturacionOxigeno": "",
    "genero": "M"
  }

  dataSource: MatTableDataSource<EnfermeriaData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  datos_enfermeria: any = [];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  fecha = new Date();
  //idhsp = 5;
  idusu = 1;

  paciente_seleccionado: any;
  listado: boolean = true;
  detalle: boolean = false;
  datos: any = [];
  data_fichas: any;
  id_servicio: any;
  numero_ficha: any;
  codigo_ficha: any;
  inicio_hora: any;
  fin_hora: any;
  doctor_seleccionado: any;


  //////////fechas/////////
  cadena: any;
  mes: any;
  dia: any;
  fech_mod: any;


  //////////fechas/////////
  items = ['item1', 'item2', 'item3', 'item4'];
  opciones: String = '';

  constructor(private toastr: ToastrService, public dialog: MatDialog, private http: EmergenciasService) {
    //this.lista_atencion_enfermeria(this.fecha);
    this.dataSource = new MatTableDataSource();
  }

  seleccionar_fecha(dateRangeStart: HTMLInputElement) {
    console.log(dateRangeStart.value);
    this.lista_atencion_enfermeria(this.CODIGO_HOSPITAL, dateRangeStart.value, this.idusu);
  }

  lista_atencion_enfermeria(idhsp: any, fecha: any, idusu: any) {
    console.log("Hospital", idhsp);
    console.log("FECHAAAA", fecha);
    console.log("usuario", idusu);
    this.http.lst_atencion_enfermeria(idhsp, fecha, idusu).subscribe(resp => {
      this.responde = resp;
      console.log("this.correlativo", this.responde);


      if (this.responde.success.data != null) {
        this.datos_enfermeria = this.responde.success.data;

        this.dataSource = new MatTableDataSource(this.datos_enfermeria);
        this.ngAfterViewInit();
      } else {
        this.datos_enfermeria = [];
        this.dataSource = new MatTableDataSource(this.datos_enfermeria);
        this.ngAfterViewInit();
      }
    });
  }

  ngAfterViewInit() {
    this.opciones = 'listado';
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log("filterValue", filterValue);
    let campo = parseInt(filterValue);
    if (isNaN(campo)) {
      if (filterValue.indexOf(' ') >= 0) {
        let nombres = filterValue.split(' ');
      }
    } else {
      if (filterValue.length > 4) {
        console.log("NUMERICO", campo);
      }
    }
  }

  recargar() {
    this.dataSource = new MatTableDataSource(this.datos_enfermeria);
    this.ngAfterViewInit();
  }

  /*seleccion(data:any){
    console.log("data",data);
    this.paciente_seleccionado = data;
    this.listado = false;
    this.opciones = 'detalle';
  }*/

  atender_paciente(dataEnf: any) {
    console.log("DATA de enfermeria", dataEnf);
    this.paciente_seleccionado = dataEnf;
    //this.listado = false;
    this.opciones = 'detalle';
  }

  retornar() {
    //this.listado = true;
    this.opciones = 'listado';
  }

  insertarEnfermeriaEmergencia() {
    /*currentSignosVitales = {
      "peso": "78.79",
      "altura": "1.60",
      "temperaturaAxilar": "38",
      "temperaturaRectal": "36",
      "temperaturaOral": "36",
      "temperaturaAuricular": "38",
      "frecuenciaCardiaca": "16",
      "presionArterial": "95",
      "frecuenciaRespiratoria": "12",
      "saturacionOxigeno": "92",
      "genero": "F"
    }*/
    var params = {
      "vidpersona": 92497,
      "idpres": 1388736,
      "vid_enf": 1,
      "vedad": "40 años 0 meses 15 dias",
      "vpeso": this.currentSignosVitales.peso.replace(".",","),
      "vestatura": this.currentSignosVitales.altura,
      "vusuario_id": 1,
      "vpulso": "10",
      "vtemperatura":  this.currentSignosVitales.temperaturaAxilar+"/"+ this.currentSignosVitales.temperaturaOral+"/"+ this.currentSignosVitales.temperaturaRectal+"/-/",
      "vpresion": "1/1",
      "vfrecuencia": "",
      "vmasa": "-1200.00",
      "vsaturacion": "1",
      "vtipotemp": "A/O/R/-/",
      "vclasftriaje": 1,
      "vnrocubiculo": "23",
      "vhoraatencion": "13:10:00",
      "vfechaatencion": "2022-06-14",
      "vtipopaciente": 0,
      "vllencapilar": "12",
      "vreferidode": "",
      "vreferidodealguna": 0,
      "vhoratriaje": "02:08:00"
    }

    this.http.insertarEnfermeriaEmergencia(params).subscribe(res => {
      console.log(params);
    });
  }

  
 

}
