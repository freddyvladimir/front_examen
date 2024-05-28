import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { PrimerNivelService } from '../primer-nivel.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MtxPopoverPositionEnd, MtxPopoverPositionStart } from '@ng-matero/extensions/popover';
import { MatStepper } from '@angular/material/stepper';
import { ToastrService } from 'ngx-toastr';

export interface datosPaciente {
}

@Component({
  selector: 'app-page-admisiones',
  templateUrl: './page-admisiones.component.html',
  styleUrls: ['./page-admisiones.component.scss']
})
export class PageAdmisionesComponent implements AfterViewInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  value = '';
  //////////servicios/////////
  sql: any;
  responde: any;
  //////////servicios/////////
  displayedColumns: string[] = [
    'serial',
    'cedula',
    'nombres',
    'paterno',
    'materno',
    'sexo'
  ];
  dataSource: MatTableDataSource<datosPaciente>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  datos_paciente:any = [];
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
  navStyle = 'background: #09b8b0;color:#fefeff;';
  constructor(private toastr: ToastrService,private http: PrimerNivelService) {
    this.dataSource = new MatTableDataSource();
  }

  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let campo = parseInt(filterValue);    
    if ( isNaN(campo) ) {      
      if(filterValue.indexOf(' ') >= 0){
        let nombres = filterValue.split(' ');
        this.buscar_paciente('',(nombres[0] || ''),(nombres[1] || ''),(nombres[2] || ''),'NOMBRE');
      }
    }else{
      if (filterValue.length > 4) {
        console.log("NUMERICO",campo);
        this.buscar_paciente(filterValue,'','','','CI');
      }
    }
    
  }

  buscar_paciente(ci:String,nombre:String,paterno:String,materno:String,tipo:String,) {
    try {
      this.sql = {
        consulta: "select * from primer_nivel.sp_buscar_paciente($$"+ci+"$$,$$"+paterno+"$$,$$"+materno+"$$,$$"+nombre+"$$,$$"+tipo+"$$)"
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          console.log("this.responde.success.data[0].sp_dinamico",this.responde.success.data[0].sp_dinamico);
          this.datos_paciente = this.responde.success.data[0].sp_dinamico;
          this.dataSource = new MatTableDataSource(this.datos_paciente);
          this.ngAfterViewInit();
        } else {
          this.datos_paciente = [];
          this.dataSource = new MatTableDataSource(this.datos_paciente);
          this.ngAfterViewInit();
          this.toastr.success('No esxiste el paciente', '', {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
            newestOnTop: false,
            extendedTimeOut: 0,
            tapToDismiss: false
          });
        }
      });
    } catch (error) {
    }
  }

  recargar() {
    this.datos_paciente = [];
    this.dataSource = new MatTableDataSource(this.datos_paciente);
    this.ngAfterViewInit();
  }

  seleccion(data:any){
    console.log("data",data);
    this.paciente_seleccionado = data;
    this.listado = false;
    this.opciones = 'detalle';
  }

  registrarFicha(Item: any){
    console.log("vv",Item);
    console.log(this.paciente_seleccionado.codigo);
    try {
      this.sql = {
        consulta: "select * from primer_nivel.sp_insertar_prestacion_primer_nivel_hospital("+this.paciente_seleccionado.codigo+","+Item.id_servicio+",$$"+Item.fechaSeleccionada+"$$,$$NO$$,"+Item.numero_ficha+","+this.CODIGO_HOSPITAL+","+Item.id_medico+","+Item.id_turno+",$$"+Item.codigo_ficha+"$$,$$1$$,$$"+Item.inicio_hora+"$$,$$"+Item.fin_hora+"$$,$$C$$,$$INSTITUCIONAL$$,$$NO$$)"
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          console.log("this.responde.success.data[0].sp_dinamico",this.responde.success.data[0].sp_dinamico);
          this.retornar();
          this.toastr.success('Ficha reservada', '', {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
            newestOnTop: false,
            extendedTimeOut: 0,
            tapToDismiss: false
          });
        } else {
        }
      });
    } catch (error) {
    }
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

  retornar(){
    this.listado = true;
    this.opciones = '';
  }
  
  /*addItem(newItem: any) {
    console.log("newItem",newItem);
       
    this.items.push(newItem);
    this.registrar_ficha();
  }*/
  
  listarDatos(data:any){
    console.log("data",data);
    this.paciente_seleccionado = data;
    this.listado = false;
    this.opciones = 'registro';
  }

  listarHistorial(data:any){
    console.log("data",data);
    this.paciente_seleccionado = data;
    this.listado = false;
    this.opciones = 'historial';
  }

  login() {
    try {
      this.sql = {
        "usuario": "freddy.mamani",
        "clave": "Vl@dimirdel1al7",
        "sistema": "SIIS"
      };
      this.http.login(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        console.log("this.responde",this.responde);
        
      });
    } catch (error) {
    }
  }
  
}
