import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { EmergenciasService } from '../../emergencias.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';

export interface programaData { }
@Component({
  selector: 'app-page-cie10',
  templateUrl: './page-cie10.component.html',
  styleUrls: ['./page-cie10.component.scss']
})
export class PageCie10Component implements OnInit {
  
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  var_diagnostico_ingreso: string = "";
  var_diagnostico_egreso: string = "";
  value = '';
  displayedColumns: string[] = [
    'id',
    'alfa',
    'descripcion',
    'otradescripcion',
    'acciones'];
  dataSource: MatTableDataSource<programaData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  datos_programacion: any;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  


  constructor(private _snackBar: MatSnackBar, private emergenciasService: EmergenciasService, public dialogRef: MatDialogRef < PageCie10Component > ) {
    this.dataSource = new MatTableDataSource();
   }

  ngOnInit(): void {
    var params_cie = {
      
    }
   
    this.emergenciasService.cie10(params_cie).subscribe(res => {
      var response_buscar = res;    
      this.dataSource = new MatTableDataSource(response_buscar.success.data);
      this.ngAfterViewInit();
      
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

  diagnostico(row:any){
    this.var_diagnostico_ingreso = this.var_diagnostico_ingreso+" "+"*"+row.alfa+"-"+row.descripcion+"-N";
    this._snackBar.open('Agregado con exito', 'ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000,
      panelClass: ['style-success'],
  });
  }

  enviar_diagnostico(){
    this.dialogRef.close(this.var_diagnostico_ingreso);
  }

}
