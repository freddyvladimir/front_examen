
import {
  AfterViewInit,
  Component,
  ViewChild
} from '@angular/core';
import {
  MatPaginator
} from '@angular/material/paginator';
import {
  MatSort
} from '@angular/material/sort';
import {
  MatTableDataSource
} from '@angular/material/table';
import {
  ParametricasService
} from './../parametricas.service';
import {
  MatDialog,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {
  CreateConsultorioComponent
} from './create-consultorio/create-consultorio.component';
import {
  EditConsultorioComponent
} from './edit-consultorio/edit-consultorio.component';
import {
  DeleteConsultorioComponent
} from './delete-consultorio/delete-consultorio.component';

@Component({
  selector: 'app-page-consultorios',
  templateUrl: './page-consultorios.component.html',
  styleUrls: ['./page-consultorios.component.scss']
})
export class PageConsultoriosComponent implements AfterViewInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  datos: any;
  displayedColumns: string[] = ['id', 'hospital', 'descripcion', 'tipo', 'codigo', 'cnsl_cp_id', 'estado', 'fecha_registro', 'fecha_modificado', 'acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: MatTableDataSource < any > = new MatTableDataSource < any > ([]);
  @ViewChild(MatSort) sort = new MatSort();
  constructor(private _snackBar: MatSnackBar, public parametricasService: ParametricasService, public dialog: MatDialog) {

  }

  setData(d: any) {
      this.datos = d;
      this.dataSource = new MatTableDataSource < any > (this.datos);
      this.ngAfterViewInit()
  }

  ngOnInit(): void {
      this.parametricasService.getConsultorio().subscribe(resp => {
          this.setData(resp);
      });
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

  create() {
      this.dialog.open(CreateConsultorioComponent, {
          width: '550px',
      }).afterClosed().subscribe(result => {
          if (result == "true") {
              this.parametricasService.getConsultorio().subscribe(resp => {
                  this.setData(resp);
                  this._snackBar.open('Creado con exito', 'ok', {
                      horizontalPosition: this.horizontalPosition,
                      verticalPosition: this.verticalPosition,
                      duration: 2000,
                      panelClass: ['style-success'],
                  });
              });
          }
      });
  }

  update(row: any): void {
      const dialogRef = this.dialog.open(EditConsultorioComponent, {
          width: '550px',
          data: row,
      });
      dialogRef.afterClosed().subscribe(result => {
          if (result == "true") {
              this.parametricasService.getConsultorio().subscribe(resp => {
                  this.setData(resp);
                  this._snackBar.open('Editado con exito', 'ok', {
                      horizontalPosition: this.horizontalPosition,
                      verticalPosition: this.verticalPosition,
                      duration: 2000,
                      panelClass: ['style-success'],
                  });
              });
          }
      });
  }

  delete(row: any) {
      const dialogRef = this.dialog.open(DeleteConsultorioComponent, {
          width: '350px',
          data: row,
      });
      dialogRef.afterClosed().subscribe(result => {
          if (result == "true") {
              this.parametricasService.getConsultorio().subscribe(resp => {
                  this.setData(resp);
                  this._snackBar.open('Eliminado con exito', 'ok', {
                      horizontalPosition: this.horizontalPosition,
                      verticalPosition: this.verticalPosition,
                      duration: 2000,
                      panelClass: ['style-success'],
                  });
              });
          }
      });
  }

}
