import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DialogFromFichasComponent } from './dialog-from-fichas/dialog-from-fichas.component';
import { ParametricasService } from '../parametricas.service';

export interface programaData {
}


@Component({
  selector: 'app-page-programacion-fichas',
  templateUrl: './page-programacion-fichas.component.html',
  styleUrls: ['./page-programacion-fichas.component.scss']
})

export class PageProgramacionFichasComponent implements OnInit,AfterViewInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  value = '';
  displayedColumns: string[] = [
    'serial',
    'ycp_grupo',
    'ymedico',
    //'ytptrn_descripcion',
    //'ytipo_tiempo',
    'ytrn_fecha',
    'dia',
    'ytrn_fichas_precitadas',
    'yfichas_ocupadas',
    'yfichas_libres'];
  dataSource: MatTableDataSource<programaData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  datos_programacion: any;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  fecha_inicio = new Date();
  fecha_fin = new Date();

  sql: any;
  responde: any;

  cadena: any;
  mes: any;
  dia: any;
  fech_mod: any;

  data_envio: any = [];
  data_respuesta: any;
  constructor(private toastr: ToastrService, public dialog: MatDialog, private parametricasService: ParametricasService) {
    this.lista_programacion(this.fecha_inicio, this.fecha_fin);
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
  }
  
  seleccionar_fecha(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    console.log(dateRangeStart.value);
    console.log(dateRangeEnd.value);
    this.lista_programacion(dateRangeStart.value, dateRangeEnd.value);
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
    } else {
      var asignado = fecha;
      var fecselect = new Date(asignado);
      this.mes = fecselect.getMonth() + 1;
      this.dia = fecselect.getDate();
      if (fecselect.getDate() < 10) {
        this.dia = "0" + this.dia;
      }
      if (fecselect.getMonth() < 9) {
        this.mes = "0" + this.mes;
      }
      this.fech_mod = fecselect.getFullYear() + "-" + this.mes + "-" + (this.dia);
    }
    console.log("this.fech_mod",this.fech_mod);
    
    return this.fech_mod;
  }

  lista_programacion(fecha_inicio: any, fecha_fin: any) {
    this.sql = {
      consulta: "select * from busqasignarturnolst($$" + this.comversor(fecha_inicio) + "$$,$$" + this.comversor(fecha_fin) + "$$,"+this.CODIGO_HOSPITAL+")"
    };
    this.parametricasService.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        this.datos_programacion = this.responde.success.data[0].sp_dinamico;
        this.dataSource = new MatTableDataSource(this.datos_programacion);
        this.ngAfterViewInit();
      } else {
        this.datos_programacion = [];
        this.dataSource = new MatTableDataSource(this.datos_programacion);
        this.ngAfterViewInit();
      }
    });
  }

  seleccion(datos: any) {
    console.log("vvvv", datos);
    //ytrn_tptrn_id

    //'+datosCronograma.yhsp_tptrn_id+','+parseInt(datosCronograma.ytrn_tptrn_id)+','+parseInt(datosCronograma.ytrn_fichas_precitadas)+',$$'+datosCronograma.ytipo_tiempo+'$$,$$'+datosCronograma.yhora_inicio+'$$,$$'+datosCronograma.yhora_fin+'$$,'+sessionService.get('IDUSUARIO')+','+idcr+','+datosCronograma.ytrn_hspusr_medico_id+'
    this.toastr.info('Seleccione el dia de atención', 'NOTA', {
      timeOut: 3000,
      progressBar: true,

      closeButton: true,
      newestOnTop: false,
      
      
      extendedTimeOut: 0,
      tapToDismiss: false,
      positionClass: "toast-bottom-left"
      
    });
    //this.toastr.info('message <button type="button" class="btn clear btn-toastr" onclick="toastr.clear()">OK</button>' , 'Studio Message:');
    const dialogRef = this.dialog.open(DialogFromFichasComponent, {
      disableClose: true,
      width: '70%',
      data: { tipo: 'UPDATE', campos: datos },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.data_respuesta = result;
      console.log("this.animal", this.data_respuesta);
      this.lista_programacion(this.fecha_inicio, this.fecha_fin);
    });
  }

  
  eliminarFichas(datos:any) {
    this.sql = {
      consulta: "select * from sp_elimina_turno("+datos.ytrn_id+",1)"
    };
    this.parametricasService.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        this.lista_programacion(this.fecha_inicio, this.fecha_fin);
      }
    });
  }
  openDialog() {
    const dialogRef = this.dialog.open(DialogFromFichasComponent, {
      disableClose: true,
      width: '70%',
      data: { tipo: 'NEW', campos: [] },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.data_respuesta = result;
      console.log("this.animal", this.data_respuesta);
      this.lista_programacion(this.fecha_inicio, this.fecha_fin);
    });
  }

  recargar() {
    this.dataSource = new MatTableDataSource(this.datos_programacion);
    this.ngAfterViewInit();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

}
