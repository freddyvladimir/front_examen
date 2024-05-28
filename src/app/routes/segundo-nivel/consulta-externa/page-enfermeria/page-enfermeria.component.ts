import { Component, AfterViewInit, ViewChild } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MtxPopoverPositionEnd, MtxPopoverPositionStart } from '@ng-matero/extensions/popover';
import { MatStepper } from '@angular/material/stepper';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

import { ConsultaExternaService } from '../consulta-externa.service';

export interface EnfermeriaData {
}
export interface Turno {
  thtrnid: number;
  thtrn_descripcion: string;
  vtptrn_codigo: string;
}
@Component({
  selector: 'app-page-enfermeria',
  templateUrl: './page-enfermeria.component.html',
  styleUrls: ['./page-enfermeria.component.scss']
})

export class PageEnfermeriaComponent implements AfterViewInit {


  selectedTurnos = new FormControl();
  turnos: Turno[] = [];
  selectedValue: any; 


  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  value = '';
  //////////servicios/////////
  sql: any;
  responde: any;
  //////////servicios/////////
  displayedColumns: string[] = [
    'serial',
    'dtspslid',
    'vcod_segsocial',
    'vprs_fecha_atencion',
    'vpaciente',
    'vcp_grupo',
    'vmedico',
    'vprs_codigo_ficha',
    'vhcl_tp_id',
    'vhcl_tipo_pac',
    'opciones',
    'atencion'
  ];
  dataSource: MatTableDataSource<EnfermeriaData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  datos_enfermeria:any = [];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  fecha = new Date();

  paciente_seleccionado:any;
  listado:boolean = true;
  detalle:boolean = false;
  datos: any = [];
  data_fichas:any;


  id_servicio:any;
  numero_ficha:any;
  codigo_ficha:any;
  inicio_hora:any;
  fin_hora:any;
  doctor_seleccionado:any;
  //////////fechas/////////
  cadena: any;
  mes: any;
  dia: any;
  fech_mod: any;
  //////////fechas/////////
  items = ['item1', 'item2', 'item3', 'item4'];
  opciones:String = '';

  constructor(private toastr: ToastrService, public dialog: MatDialog, private http: ConsultaExternaService) {
    this.lista_turnos();
    this.lista_atencion_enfermeria(this.fecha);
    this.dataSource = new MatTableDataSource();
  }

  seleccionar_fecha(dateRangeStart: HTMLInputElement) {
    console.log(dateRangeStart.value);
    this.lista_atencion_enfermeria(dateRangeStart.value);
  }

  lista_turnos() {
    this.sql = {
      consulta: "select * from cbo_turnos_hospitales("+ this.CODIGO_HOSPITAL +")"
    };
    this.http.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        this.turnos = this.responde.success.data[0].sp_dinamico;
        console.log(this.turnos);
      } else {
        this.turnos = [];
      }
    });
  }


  comversor(fecha: any) {
    console.log("fecha-----<>",fecha);
    
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
    } 
    console.log("this.fech_mod",this.fech_mod);
    
    return this.fech_mod;
  }


  lista_atencion_enfermeria(fecha: any) {
    console.log(this.selectedValue);
    this.sql = {
      consulta: "select * from sp_lst_pacientes_asignadosfecha("+ this.CODIGO_HOSPITAL +",$$" + this.comversor(fecha) + "$$," + this.selectedValue + ")"
    };
    this.http.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        this.datos_enfermeria = this.responde.success.data[0].sp_dinamico;
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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log("filterValue", filterValue);
    let campo = parseInt(filterValue);    
    if ( isNaN(campo) ) {      
      if(filterValue.indexOf(' ') >= 0){
        let nombres = filterValue.split(' ');
      }
    }else{
      if (filterValue.length > 4) {
        console.log("NUMERICO",campo);
      }
    }
  }

  seleccion(data:any){
    console.log("data",data);
    this.paciente_seleccionado = data;
    this.listado = false;
    this.opciones = 'detalle';
  }

  retornar(){
    this.listado = true;
    this.opciones = '';
  }

}
