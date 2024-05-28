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
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

export interface programaData {
}

@Component({
  selector: 'app-page-buscar-ficha',
  templateUrl: './page-buscar-ficha.component.html',
  styleUrls: ['./page-buscar-ficha.component.scss']
})
export class PageBuscarFichaComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  value = '';
  card_imagen:boolean=false;
  url_imagen:string= "";
  lupa = "30%";
  displayedColumns: string[] = [
    'id',
    'ficha',
    'cancelo',
    'estado',
    'especialidad',
    'sice',
    'siis',
    'paciente',
    'doctor',
    'turno',
    'fecha',
    'hora'
  ];
     
  dataSource: MatTableDataSource<programaData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  lista: any=[];

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
   // this.listar();
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

  listar(type: string, event: MatDatepickerInputEvent<Date>) {
    
    const fechaCadena = JSON.stringify(event.value);
    const fecha = fechaCadena.substring(1, 11);

    const buscar_ficha = {
      "idhospital": this.CODIGO_HOSPITAL,
      "tfecha": fecha
    }
    this.api.buscar_ficha(buscar_ficha).subscribe(resp => {
        this.lista  = resp;
        this.dataSource = new MatTableDataSource(this.lista.success.data);
        this.ngAfterViewInit();
    });
   
  }

}
