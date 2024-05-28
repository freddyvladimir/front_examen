import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ServiciosComplementariosService } from '../../servicios-complementarios.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder} from '@angular/forms';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { DialogButtomComponent } from './dialog-buttom/dialog-buttom.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http'; 

export interface programaData {
}

@Component({
  selector: 'app-servicios-complementarios-lista',
  templateUrl: './servicios-complementarios-lista.component.html',
  styleUrls: ['./servicios-complementarios-lista.component.scss']
})
export class ServiciosComplementariosListaComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  value = '';
  displayedColumns: string[] = [
    'id',
    'servicio',
    'cuaderno',
    'opciones'
  ];
     
  dataSource: MatTableDataSource<programaData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  datos_programacion: any;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });


  constructor(private _snackBar: MatSnackBar, private _bottomSheet: MatBottomSheet,private fb: FormBuilder,private toastr: ToastrService, public dialog: MatDialog, private ServiciosComplementariosService: ServiciosComplementariosService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.lista_servicios_complementarios();
  }
  
  recargar() {
    this.dataSource = new MatTableDataSource(this.datos_programacion);
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

  lista_servicios_complementarios() {
    var params_buscar = {
      "vhsp_id": this.CODIGO_HOSPITAL
    }
    this.ServiciosComplementariosService.lista_servicios_complementarios(params_buscar).subscribe(res => {
      var response_buscar = res;    
      this.dataSource = new MatTableDataSource(response_buscar.success.data);
      this.ngAfterViewInit();
    });
  }
  
  crear(row: any): void {
    this.dialog.open(DialogButtomComponent, {
        width: '550px',
        data: row,
    }).afterClosed().subscribe(result => {
        if (result == "true") {
           this.lista_servicios_complementarios();
           this._snackBar.open('Creado con exito', 'ok', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                duration: 2000,
                panelClass: ['style-success'],
            });
          }
      });
  }

  editar(row:any){
    row.opcion_estado = "editar";
    this.dialog.open(DialogButtomComponent, {
      width: '550px',
      data: row,
    }).afterClosed().subscribe(result => {
        if (result == "true") {
          this.lista_servicios_complementarios();
          this._snackBar.open('Editado con exito', 'ok', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                duration: 2000,
                panelClass: ['style-success'],
            });
        }
      });
  }
  
  eliminar(row:any){
    row.opcion_estado = "eliminar";
    this.dialog.open(DialogButtomComponent, {
      width: '550px',
      data: row,
    }).afterClosed().subscribe(result => {
        if (result == "true") {
          this.lista_servicios_complementarios();
          this._snackBar.open('Eliminado con exito', 'ok', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                duration: 2000,
                panelClass: ['style-success'],
            });
          }
      });
  }

}
