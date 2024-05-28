import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HemodialisisService } from '../hemodialisis.service';
import { DialogAsignarMaquinaComponent } from './dialog-asignar-maquina/dialog-asignar-maquina.component';

export interface noAsignadosData {
}
@Component({
  selector: 'app-page-pacientes-no-asignados',
  templateUrl: './page-pacientes-no-asignados.component.html',
  styleUrls: ['./page-pacientes-no-asignados.component.scss']
})


export class PagePacientesNoAsignadosComponent implements OnInit {

  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  value = '';
  displayedColumns: string[] = [
    'serial',
    'pardescrip',
    'codigo',
    'paterno',
    'materno',
    'nombres',
    'opciones',
  ];
  dataSource: MatTableDataSource<noAsignadosData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  datos_pacientesNoAsignados: any;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  constructor(
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private HemodialisisService: HemodialisisService,
  ) {
    this.dataSource = new MatTableDataSource();
  }
  ngOnInit(): void {
    this.lista_paciente_no_asignado(this.CODIGO_HOSPITAL);
  }
  recargar() {
    this.dataSource = new MatTableDataSource(this.datos_pacientesNoAsignados);
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
  lista_paciente_no_asignado(idhosp: any) {
    this.HemodialisisService.lst_noAsignados(idhosp).subscribe(resp => {
      var response_buscar = resp;
      this.dataSource = new MatTableDataSource(response_buscar.success.data);
      this.ngAfterViewInit();
    })
  }
  AsignaMaquina(row: any): void {
   // console.log("rowwwwwwww",row);
   // row.opcion_estado = "editar";
    this.dialog.open(DialogAsignarMaquinaComponent, {
      width: '550px',
      data: {campos:row},
    }).afterClosed().subscribe(result => {
      if (result == "true") {
        this.lista_paciente_no_asignado(this.CODIGO_HOSPITAL);
        this._snackBar.open('Maquina asignada con exito', 'ok', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 2000,
          panelClass: ['style-success'],
        });
      }
    });
  }

}
