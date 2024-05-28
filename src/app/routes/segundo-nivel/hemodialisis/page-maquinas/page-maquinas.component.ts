import { Component, AfterViewInit, ViewChild } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MtxPopoverPositionEnd, MtxPopoverPositionStart } from '@ng-matero/extensions/popover';
import { MatStepper } from '@angular/material/stepper';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogNuevaMaquinaComponent } from './dialog-nueva-maquina/dialog-nueva-maquina.component';
import { HemodialisisService } from '../hemodialisis.service';
import { result } from 'lodash';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
export interface maquinasData {
}
@Component({
  selector: 'app-page-maquinas',
  templateUrl: './page-maquinas.component.html',
  styleUrls: ['./page-maquinas.component.scss']
})
export class PageMaquinasComponent implements AfterViewInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  value = '';
  //////////servicios/////////
  responde: any;
  //////////servicios/////////
  displayedColumns: string[] = [
    'serial',
    'maq_codigo',
    'maq_descripcion',
    'opciones',
  ];
  dataSource: MatTableDataSource<maquinasData>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  datos_maquinas: any;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  fecha = new Date();
  paciente_seleccionado: any;
  listado: boolean = true;
  detalle: boolean = false;
  datos: any = [];
  data_fichas: any;
  opciones: String = '';
  constructor(private _snackBar: MatSnackBar, private toastr: ToastrService, public dialog: MatDialog,
    private http: HemodialisisService,
    private serviciosComplementarios: HemodialisisService,
  ) {
    this.dataSource = new MatTableDataSource();
    this.lista_maquinas(this.CODIGO_HOSPITAL);
  }
  lista_maquinas(idhosp: any) {
    this.http.lst_maquinas(idhosp).subscribe(res => {
      var response_buscar = res;
      this.dataSource = new MatTableDataSource(response_buscar.success.data);
      this.ngAfterViewInit();
    })
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
    this.dataSource = new MatTableDataSource(this.datos_maquinas);
    this.ngAfterViewInit();
  }
  ngOnInit(): void {
    
    this.lista_maquinas(this.CODIGO_HOSPITAL);
  }
  crearDialog(row: any): void {
   // console.log(' Se hizo Click en -crear--- Crear Maquina!!!', row);
    row.opcion_estado = "crear";
    this.dialog.open(DialogNuevaMaquinaComponent, {
      width: '550px',
      data: row,
    }).afterClosed().subscribe(result => {
      if (result == "true") {
        // console.log("---------------", row)
        this.lista_maquinas(this.CODIGO_HOSPITAL);
        this._snackBar.open('Creado con exito', 'ok', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 2000,
          panelClass: ['style-success'],
        });
      }
    });
  }
  editDialog(row: any) {
    //console.log(' Se hizo Click en -editar- EditDialog', row);
    row.opcion_estado = "editar";
    this.dialog.open(DialogNuevaMaquinaComponent, {
      disableClose: true,
      width: '550px',
      data: row,
    }).afterClosed().subscribe(result => {
      if (result == "true") {
        // console.log("LISTA ANTES DE LA ACTUALIZACION", row);
        this.lista_maquinas(this.CODIGO_HOSPITAL);
        this._snackBar.open('Editado con exito', 'ok', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 2000,
          panelClass: ['style-success'],
        });
      }
    });
  }
  eliminar(row: any) {
    // console.log("El row Antes de Eliminar tiene esto", row);
    let xxx = {
      "_maq_id": row.maqid,
      "_cen_id": this.CODIGO_HOSPITAL,
      "_par_id": row.parid,  // esto es del combo de Patologias
      "_maq_data": [
        {
          "maq_codigo": row.maqdatos[0].maq_codigo,
          "maq_descripcion": row.maqdatos[0].maq_descripcion,
        }
      ],
      "opcion": "D"
    }
    //console.log("Mostrando despùes de Eliminar Variable X", xxx);
    this.serviciosComplementarios.lst_abm(xxx).subscribe(resp => {
      // console.log("SE elimino correctamente!!!!");
      this.lista_maquinas(this.CODIGO_HOSPITAL);
    });
  }
}
