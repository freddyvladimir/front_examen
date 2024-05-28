import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { CentroMonitoreoService } from '../centro-monitoreo.service';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export interface UserData {
}

@Component({
  selector: 'app-reporte-general',
  templateUrl: './reporte-general.component.html',
  styleUrls: ['./reporte-general.component.scss']
})
export class ReporteGeneralComponent implements OnInit {
  sql: any;
  responde: any;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  dataReporte: any;
  displayedColumns: string[] = [
    'serial',
    'fecha',
    'horaSolicitud',
    'horaSalida',
    'horaContacto',
    'horaRetorno',
    'diagnosticoIngreso',
    'vtp_tipo_paciente',
    'origen',
    'destino',
    'sexo',
    'edad',
    'tipo_urgencia',
    'guardia_turno'];
  dataSource: MatTableDataSource<UserData>;
  listaAtenciones: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: CentroMonitoreoService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  generarReporte() {

  }
  seleccionarFecha(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    console.log(dateRangeStart);
    console.log(dateRangeEnd);
    if (dateRangeEnd.value) {
      /*try {
        this.sql = {
          consulta: "select * from reporte_atencion_centro_monitoreo($$"+dateRangeStart.value+"$$,$$"+dateRangeEnd.value+"$$)"
        };
        this.http.dinamico(this.sql).subscribe(res => {
          this.responde = res as { message: string };
          if (this.responde.success.data[0].sp_dinamico != null) {
            this.dataReporte = this.responde.success.data[0].sp_dinamico;
            this.dataSource = new MatTableDataSource(this.dataReporte);
            this.ngAfterViewInit();
          } else {
            this.dataReporte = [];
            this.dataSource = new MatTableDataSource(this.dataReporte);
            this.ngAfterViewInit();
          }
        });
      } catch (error) {
      }*/

      const params_listar_reporte = {
        "fechIni": dateRangeStart.value,
        "fechFin": dateRangeEnd.value
      };
      this.http.listaReporte(params_listar_reporte).subscribe(res => {
        this.responde = res.success.data;
        console.log(this.responde);
        if (this.responde != null) {
          this.dataReporte = this.responde;
          this.dataSource = new MatTableDataSource(this.dataReporte);
          this.ngAfterViewInit();
        } else {
          this.dataReporte = [];
          this.dataSource = new MatTableDataSource(this.dataReporte);
          this.ngAfterViewInit();
        }
      });
    }

  }

}
