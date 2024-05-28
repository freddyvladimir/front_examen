import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogAdvertenciaComponent } from './dialog-advertencia/dialog-advertencia.component';

import { ConsultaExternaService } from '../consulta-externa.service';



export interface revertirFichaData {
}


@Component({
  selector: 'app-page-revertir-ficha',
  templateUrl: './page-revertir-ficha.component.html',
  styleUrls: ['./page-revertir-ficha.component.scss']
})
export class PageRevertirFichaComponent implements OnInit,AfterViewInit {

    /////////  VARIABLES  ///////////
    CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
    value = '';
    paciente_seleccionado: any;
    /////////  VARIABLES  ///////////

    //////////servicios/////////
    sql: any;
    responde: any;
    result: any;
    //////////servicios/////////

  displayedColumns: string[] = [
    'serial',
    'opciones',
    'vficha_codigo',
    'vdescespecialidad',
    'vhcl_codigoseg',
    'vpres_dtspsl_id',
    'vpaciente',
    'vdoctor',
    'vturno',
    'vfecha_atencion',
    'vhora_inicio'
  ];

  dataSource: MatTableDataSource<revertirFichaData>;
  datos_fichasRevertir: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(  private http: ConsultaExternaService, 
                public dialog: MatDialog) { 
    this.dataSource = new MatTableDataSource(); 
    this.listarFichasAtencion();
  }

  ngOnInit(): void {
  }




  /*listarFichasAtencion() {
    this.sql = {
      consulta: 'select * from sp_lst_fichas_revertir('+this.CODIGO_HOSPITAL+')'
    };
    this.http.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        this.datos_fichasRevertir = this.responde.success.data[0].sp_dinamico;
        this.dataSource = new MatTableDataSource(this.datos_fichasRevertir);
        this.ngAfterViewInit();
      } else {
        this.datos_fichasRevertir = [];
        this.dataSource = new MatTableDataSource(this.datos_fichasRevertir);
        this.ngAfterViewInit();
      }
    });
  }*/

  listarFichasAtencion() {
    const params_listar = {
      hspid: this.CODIGO_HOSPITAL
    };
    this.http.listar_fichas(params_listar).subscribe(res => {
      this.responde = res;    
      this.dataSource = new MatTableDataSource(this.responde.success.data);
      this.ngAfterViewInit();
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    try {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } catch (error) {
      console.log('ERROR', error);
    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  recargar() {
    this.dataSource = new MatTableDataSource(this.datos_fichasRevertir);
    this.ngAfterViewInit();
  }


  seleccion(data:any){
    console.log('data',data);
    this.paciente_seleccionado = data;
    //this.listado = false;
    //this.opciones = 'detalle';
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {

    const dialog =  this.dialog.open(DialogAdvertenciaComponent, {
      disableClose: true,
      width: '400px',
      data: this.paciente_seleccionado
      /*enterAnimationDuration,
      exitAnimationDuration,*/
    });

    dialog.afterClosed().subscribe(
      (result) => {
        console.log(result);
        if (result) {
          this.listarFichasAtencion();
        }
      }
    );
  }



}
