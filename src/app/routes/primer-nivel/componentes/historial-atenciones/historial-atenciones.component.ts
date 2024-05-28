import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PrimerNivelService } from '../../primer-nivel.service';

export interface enfermeriaData {
}

@Component({
  selector: 'app-historial-atenciones',
  templateUrl: './historial-atenciones.component.html',
  styleUrls: ['./historial-atenciones.component.scss']
})
export class HistorialAtencionesComponent implements OnInit,AfterViewInit {
  CODIGO_HOSPITAL = 10;
  @Input() codigoPaciente: any;
  displayedColumns: string[] = [
    'serial',
    'vatn_dtspsl_id',
    'vprs_nombres',
    'vesp_desc_especialidad',
    'vatn_origen_reserva',
    'vatn_fecha_atencion'
  ];
  dataSource: MatTableDataSource<enfermeriaData>;
  datos_programacion: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //////////servicios/////////
  sql: any;
  responde: any;
  //////////servicios/////////
  constructor(private http: PrimerNivelService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.listarPacientes();
  }

  listarPacientes() {
    this.sql = {
      consulta: "select * from primer_nivel.sp_listar_historial("+this.codigoPaciente+")"
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

}
