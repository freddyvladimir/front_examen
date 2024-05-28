import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PrimerNivelService } from '../primer-nivel.service';

export interface enfermeriaData {
}

@Component({
  selector: 'app-page-enfermeria',
  templateUrl: './page-enfermeria.component.html',
  styleUrls: ['./page-enfermeria.component.scss']
})
export class PageEnfermeriaComponent implements OnInit,AfterViewInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  value = '';
  displayedColumns: string[] = [
    'serial',
    'fecha',
    'p_nombres',
    'desc_esp',
    'm_nombres',
    'cod_ficha',
    'reserva',
    //'tipo_paciente'
  ];
  dataSource: MatTableDataSource<enfermeriaData>;
  datos_programacion: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //////////servicios/////////
  sql: any;
  responde: any;
  //////////servicios/////////
  paciente_seleccionado:any;
  listado:boolean = true;
  opciones:String = '';
  constructor(private http: PrimerNivelService) {
    this.listarPacientes();
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
  }

  listarPacientes() {
    this.sql = {
      consulta: "select * from primer_nivel.sp_listar_atenciones(null,"+this.CODIGO_HOSPITAL+",$$new$$)"
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
