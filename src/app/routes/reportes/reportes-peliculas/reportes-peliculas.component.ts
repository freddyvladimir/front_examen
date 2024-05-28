import { Component, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PeliculasService } from '../../peliculas/peliculas.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';


export interface enfermeriaData {
}

@Component({
  selector: 'app-reportes-peliculas',
  templateUrl: './reportes-peliculas.component.html',
  styleUrls: ['./reportes-peliculas.component.scss']
})
export class ReportesPeliculasComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  value = '';
  displayedColumns: string[] = [
    'serial',
    'usuario',
    'peliculas',
    'calificaciones'
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
    this.http.reportesPeliculas().subscribe(res => {
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
