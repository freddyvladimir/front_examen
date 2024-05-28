import { Component, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PeliculasService } from '../peliculas.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ToastrService } from 'ngx-toastr';
import { DialogEliminarComponent } from './dialog-eliminar/dialog-eliminar.component';

export interface enfermeriaData {
}

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss']
})
export class CrudComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  value = '';
  displayedColumns: string[] = [
    'serial',
    'titulo',
    'director',
    'genero',
    'anio_lanzamiento',
    'sinopsis'
  ];
  dataSource: MatTableDataSource<enfermeriaData>;
  datos_programacion: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //////////servicios/////////
  sql: any;
  responde: any;
  //////////servicios/////////
  paciente_seleccionado: any;
  listado: boolean = true;
  opciones: String = '';
  constructor(private toastr: ToastrService, private http: PeliculasService, public dialog: MatDialog) {
    //this.listarPacientes();
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.listarPeliculas();
  }

  listarPeliculas() {
    this.http.listaPeliculas().subscribe(res => {
      console.log("-------------------------------------->", res);
      if (res) {
        this.datos_programacion = res;
        this.dataSource = new MatTableDataSource(this.datos_programacion);
        this.ngAfterViewInit();
      } else {
        this.datos_programacion = [];
        this.dataSource = new MatTableDataSource(this.datos_programacion);
        this.ngAfterViewInit();
      }
    });
  }

  listarPacientes() {
    this.sql = {
      consulta: "select * from primer_nivel.sp_listar_atenciones(null," + this.CODIGO_HOSPITAL + ",$$new$$)"
    };
    this.http.dinamico(this.sql).subscribe(res => {
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

  recargar() {
    this.dataSource = new MatTableDataSource(this.datos_programacion);
    this.ngAfterViewInit();
  }

  seleccion(data: any) {
    console.log("data", data);
    this.paciente_seleccionado = data;
    this.listado = false;
    this.opciones = 'detalle';

    const dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
      width: '70%',
      data: { tipo: 'UPDATE', campos: data },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.toastr.info('Registro almacenado', '', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true,
        newestOnTop: false,
        extendedTimeOut: 0,
        tapToDismiss: false,
        //positionClass: "toast-bottom-left"
      });
    });
  }

  retornar() {
    this.listado = true;
    this.opciones = '';
  }

  nuevapelicula() {
    const dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
      width: '70%',
      data: { tipo: 'NEW', campos: {} },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.listarPeliculas();
    });
  }

  delete(row: any) {
    const dialogRef = this.dialog.open(DialogEliminarComponent, {
      width: '350px',
      data: row,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.listarPeliculas();
    });
  }

}
