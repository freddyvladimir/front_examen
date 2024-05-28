import { Component, AfterViewInit, ViewChild } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MtxPopoverPositionEnd, MtxPopoverPositionStart } from '@ng-matero/extensions/popover';
import { MatStepper } from '@angular/material/stepper';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DialogHistoricoAtencionesComponent } from './dialog-historico-atenciones/dialog-historico-atenciones.component';
import { ConsultaExternaService } from '../consulta-externa.service';

export interface kardexData {
}

export interface Turno {
  tptrn_id: string;
  tptrn_descripcion: string;
}

@Component({
  selector: 'app-page-kardex',
  templateUrl: './page-kardex.component.html',
  styleUrls: ['./page-kardex.component.scss']
})


export class PageKardexComponent implements AfterViewInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  selectedTurnos = new FormControl();
  turnos: Turno[] = [];
  selectedValue: any; 
  
  value = '';
  //////////servicios/////////
  sql: any;
  responde: any;
  //////////servicios/////////
  displayedColumns: string[] = [
    'serial',
    'dtspslid',
    'historiacln',
    'vprs_tipo_ficha',
    'vprs_fecha_atencion',
    'vpaciente',
    'vcp_grupo',
    'vprs_codigo_ficha',
    'vtp_tipo_paciente',
    'opciones',
    'historico'
  ];
  dataSource: MatTableDataSource<kardexData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  datos_kardex:any = [];

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

  constructor(private toastr: ToastrService, 
    public dialog: MatDialog, private http: ConsultaExternaService) {
    this.lista_turnos();
    this.lista_atencion_kardex(this.fecha);
    this.dataSource = new MatTableDataSource();
  }

  seleccionar_fecha(dateRangeStart: HTMLInputElement) {
    console.log(dateRangeStart.value);
    this.lista_atencion_kardex(dateRangeStart.value);
  }

  lista_turnos() {
    this.sql = {
      //consulta: "select * from sp_lst_pacientes_asignados_kardexfec("+ 5 +",$$" + this.comversor(fecha) + "$$," + 4 + ")"
      consulta: "select tptrn_id,tptrn_descripcion from  _hsp_tipo_turnos  where tptrn_estado = $$A$$ order by tptrn_id asc"
    };
    this.http.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        this.turnos = this.responde.success.data[0].sp_dinamico;
        console.log(this.turnos);
        //this.dataSource = new MatTableDataSource(this.datos_kardex);
        //this.ngAfterViewInit();
      } else {
        this.turnos = [];
        //this.dataSource = new MatTableDataSource(this.datos_kardex);
        //this.ngAfterViewInit();
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


  lista_atencion_kardex(fecha: any) {
    console.log(this.selectedValue);
    this.sql = {
      consulta: "select * from sp_lst_pacientes_asignados_kardexfec("+ this.CODIGO_HOSPITAL +",$$" + this.comversor(fecha) + "$$," + this.selectedValue + ")"
    };
    this.http.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        this.datos_kardex = this.responde.success.data[0].sp_dinamico;
        this.dataSource = new MatTableDataSource(this.datos_kardex);
        this.ngAfterViewInit();
      } else {
        this.datos_kardex = [];
        this.dataSource = new MatTableDataSource(this.datos_kardex);
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

  /*applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    try {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } catch (error) {

    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }*/


  /*openDialog() {
    const dialogRef = this.dialog.open(DialogFromFichasComponent, {
      disableClose: true,
      width: '70%',
      data: { campos: this.data_envio },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.data_respuesta = result;
      console.log("this.animal", this.data_respuesta);

    });
  }*/

  recargar() {
    this.dataSource = new MatTableDataSource(this.datos_kardex);
    this.ngAfterViewInit();
  }

  seleccion(data:any){
    console.log("data",data);
    this.paciente_seleccionado = data;
    this.listado = false;
    this.opciones = 'detalle';
  }


  listarDatos(data:any){
    console.log("data",data);
    this.listado = false;
    this.opciones = 'registro';
  }


  openDialog() {
    const dialogRef = this.dialog.open(DialogHistoricoAtencionesComponent, {
      disableClose: true,
      width: '50%',
    data: { campos: ""/*this.data_envio*/ },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      /*this.data_respuesta = result;
      console.log("this.animal", this.data_respuesta);*/

    });
  }
}
