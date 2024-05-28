import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { ConsultaExternaService } from '../consulta-externa.service';

export interface programaData {
}


@Component({
  selector: 'app-page-hoja-referencia',
  templateUrl: './page-hoja-referencia.component.html',
  styleUrls: ['./page-hoja-referencia.component.scss']
})
export class PageHojaReferenciaComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  value = '';
  card_imagen:boolean=false;
  url_imagen:string= "";
  lupa = "30%";
  displayedColumns: string[] = [
    'id',
    'codigo',
    'paciente',
    'tipo',
    'fecha',
    'opciones'
  ];
     
  dataSource: MatTableDataSource<programaData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  lista_hoja_referencia: any=[];

  constructor(
    private api:ConsultaExternaService, 
    private _snackBar: MatSnackBar, 
    private fb: FormBuilder,
    private toastr: ToastrService, 
    public dialog: MatDialog, 
    ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.lista_servicios_complementarios();
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

    const xx = {
      "variable": 2
    }
      this.api.hoja_referencia({"variable": 2}).subscribe(resp => {
        this.lista_hoja_referencia  = resp;
        this.dataSource = new MatTableDataSource(this.lista_hoja_referencia.success.data);
        this.ngAfterViewInit();
        console.log(this.lista_hoja_referencia.success.data);
    });
   
  }

  imagen(row:any){
    this.card_imagen=true;
    console.log(row.vhjr_datos_referencia.URL_HOJA);
    this.url_imagen = row.vhjr_datos_referencia.URL_HOJA;
    this.lupa = "30%";
  }

  cerrarImagen(){
    this.card_imagen=false;
  }

  hoja_referencia_actualizar(row:any){
    if(row.vhjr_validacion=="SI"){
      row.vhjr_validacion="NO";
    }else{
      row.vhjr_validacion="SI";
    }
    const hr_update = {
      "id_hoja_referencia": row.vhjr_id,
      "usuario": 1,
      "habilitado": row.vhjr_validacion
    }
    this.api.hoja_referencia_actualizacion(hr_update).subscribe(resp => {
      this._snackBar.open('Enviado con exito', 'ok', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 4000,
        panelClass: ['style-success'],
      },
      );  
      this.lista_servicios_complementarios();
    },
    error => {
      this._snackBar.open('Error en el servicio', 'error', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 4000,
        panelClass: ['style-e'],
    });
    });
  }
  
  imagenSize(item: any){
    if(item=="mayor" && this.lupa == "30%"){
      this.lupa = "35%";
      return;
    }
    if(item=="mayor" && this.lupa == "35%"){
      this.lupa = "45%";
      return;
    }
    if(item=="menor" && this.lupa == "35%"){
      this.lupa = "30%";
      return;
    }
    if(item=="mayor" && this.lupa == "45%"){
      this.lupa = "55%";
      return;
    }
    if(item=="menor" && this.lupa == "45%"){
      this.lupa = "35%";
      return;
    }
    if(item=="mayor" && this.lupa == "55%"){
      this.lupa = "65%";
      return;
    }
    if(item=="menor" && this.lupa == "55%"){
      this.lupa = "45%";
      return;
    }
    if(item=="menor" && this.lupa == "65%"){
      this.lupa = "55%";
      return;
    }

  }
}
