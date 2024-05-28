import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DialogMedicoEspecialidadComponent } from '../page-asignacion-medico-especialidad/dialog-medico-especialidad/dialog-medico-especialidad.component';
import { ParametricasService } from '../parametricas.service';

export interface dataMedicoEspecialidad {
}

@Component({
  selector: 'app-page-asignacion-medico-especialidad',
  templateUrl: './page-asignacion-medico-especialidad.component.html',
  styleUrls: ['./page-asignacion-medico-especialidad.component.scss']
})
export class PageAsignacionMedicoEspecialidadComponent implements OnInit,AfterViewInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  value = '';
  displayedColumns: string[] = [
    'serial',
    'espdescesp',
    'datosmed'
    ];
  dataSource: MatTableDataSource<dataMedicoEspecialidad>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  listaMedicosEspecialidad: any;
    //////////servicios/////////
  sql: any;
  responde: any;
  //////////servicios/////////
  constructor(private toastr: ToastrService, public dialog: MatDialog, private http: ParametricasService) {
    this.listarDatos();
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
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
    this.dataSource = new MatTableDataSource(this.listaMedicosEspecialidad);
    this.ngAfterViewInit();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  listarDatos() {
    this.sql = {
      consulta: "select * from sp_lst_medico_especialidad("+this.CODIGO_HOSPITAL+")"
    };
    this.http.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        this.listaMedicosEspecialidad = this.responde.success.data[0].sp_dinamico;
        this.dataSource = new MatTableDataSource(this.listaMedicosEspecialidad);
        this.ngAfterViewInit();
      } else {
        this.listaMedicosEspecialidad = [];
        this.dataSource = new MatTableDataSource(this.listaMedicosEspecialidad);
        this.ngAfterViewInit();
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogMedicoEspecialidadComponent, {
      disableClose: true,
      width: '50%',
    data: { campos: ""/*this.data_envio*/ },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.listarDatos();
      /*this.data_respuesta = result;
      console.log("this.animal", this.data_respuesta);*/

    });
  }
}
