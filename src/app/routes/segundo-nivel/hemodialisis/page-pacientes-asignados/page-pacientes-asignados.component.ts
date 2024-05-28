import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MtxPopoverPositionEnd, MtxPopoverPositionStart } from '@ng-matero/extensions/popover';
import { MatStepper } from '@angular/material/stepper';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { HemodialisisService } from '../hemodialisis.service';
import { DialogReasignarMaquinaComponent } from './dialog-reasignar-maquina/dialog-reasignar-maquina.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { DialogRegistroHojaComponent } from './dialog-registro-hoja/dialog-registro-hoja.component';
export interface asignadosData {
}
@Component({
  selector: 'app-page-pacientes-asignados',
  templateUrl: './page-pacientes-asignados.component.html',
  styleUrls: ['./page-pacientes-asignados.component.scss']
})
export class PagePacientesAsignadosComponent implements AfterViewInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  value = '';
  displayedColumns: string[] = [
    'serial',
    'cen_nombre',
    'maq_nombre',
    'maq_serol',
    'pac_cod',
    'par_descrip',
    'pacpat',
    'pacmat',
    'pacnom',
    'nueva_hoja'
  ];
  dataSource: MatTableDataSource<asignadosData>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  datos_pacientesAsignados: any = [];
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  constructor(
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private HemodialisisService: HemodialisisService
  ) {
    this.lista_pacientes_asignados(this.CODIGO_HOSPITAL);
    this.dataSource = new MatTableDataSource();
  }
  lista_pacientes_asignados(idhosp: any) {
    this.HemodialisisService.lst_asignados(idhosp).subscribe(resp => {
      var response_buscar = resp;
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
    this.dataSource = new MatTableDataSource(this.datos_pacientesAsignados);
    this.ngAfterViewInit();
  }
  CambiarMaquina(row: any): void {
    // console.log("Enviando el ROW desde la Pagina-Principal :", row);
    this.dialog.open(DialogReasignarMaquinaComponent, {
      width: '550px',
      data: { campos: row },
    }).afterClosed().subscribe(result => {
      if (result == "true") {
        this.lista_pacientes_asignados(this.CODIGO_HOSPITAL);
        this._snackBar.open('Maquina Editada con éxito', 'ok'), {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 2000,
          panelClass: ['style-success'],
        }
      }
    })
  }
  RegistroHojaHemodialisis(row: any): void {
    // console.log("Enviando el ROW desde la Pagina-Principal :", row);
    this.dialog.open(DialogRegistroHojaComponent, {
      width: '950px',
      data: { campos: row },
    }).afterClosed().subscribe(result => {
      if (result == "true") {
        this.lista_pacientes_asignados(this.CODIGO_HOSPITAL);
        this._snackBar.open('Registro guardado correctamente', 'ok'), {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 2000,
          panelClass: ['style-success'],
        }
      }
    })
  }

}
