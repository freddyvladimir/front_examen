import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CentroMonitoreoService } from '../centro-monitoreo.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DialigAtencionComponent } from './dialig-atencion/dialig-atencion.component';
import { DialogAtencionHospitalComponent } from './dialog-atencion-hospital/dialog-atencion-hospital.component';

export interface datosPaciente {
}


@Component({
  selector: 'app-atencion',
  templateUrl: './atencion.component.html',
  styleUrls: ['./atencion.component.scss']
})
export class AtencionComponent implements OnInit,AfterViewInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  sql:any;
  responde:any;
  data_lst_atenciones: any = [];
  
  displayedColumns: string[] = [
    'serial',
    'vad_atencion',
    'procedencia',
    'destino',
    'sexo',
    'edad',
    'tipo_urgencia',
    'diagnostico',
    'diagnosticoIngreso',
    'tratamiento'
  ];
  dataCie:any;
  value = '';

  dataSource: MatTableDataSource<datosPaciente>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  
  constructor(private toastr: ToastrService,private http: CentroMonitoreoService,public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
  }
  ngOnInit(): void {
    this.listarMedicamentos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  listarMedicamentos() {
    /*try {
      this.sql = {
        consulta: "select * from lst_atenciones_centro_monitoreo("+this.CODIGO_HOSPITAL+")"
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          this.dataCie = this.responde.success.data[0].sp_dinamico;
          this.dataSource = new MatTableDataSource(this.dataCie);
          this.ngAfterViewInit();
        } else {
          this.dataCie = [];
          this.dataSource = new MatTableDataSource(this.dataCie);
          this.ngAfterViewInit();
        }
      });
    } catch (error) {
    }*/
    const params_lst_atenciones = {
      "hspid": this.CODIGO_HOSPITAL
    };
    this.http.listaAtenciones(params_lst_atenciones).subscribe(res => {
      this.data_lst_atenciones = res.success.data;
      console.log(this.data_lst_atenciones);
      if (this.data_lst_atenciones != null) {
        this.dataCie = this.data_lst_atenciones;
        this.dataSource = new MatTableDataSource(this.dataCie);
        this.ngAfterViewInit();
      } else {
        this.dataCie = [];
        this.dataSource = new MatTableDataSource(this.dataCie);
        this.ngAfterViewInit();
      }
    });
  }

  eliminarRegistro2(data:any){
  }

  editarRegistro(datos: any) {
    if (this.CODIGO_HOSPITAL == '5') {
      const dialogRef = this.dialog.open(DialogAtencionHospitalComponent, {
        disableClose: true,
        width: '50%',
        data: { tipo: 'UPDATE', campos: datos },
      });
      dialogRef.afterClosed().subscribe(result => {
        this.listarMedicamentos();
      });
    }else{
      const dialogRef = this.dialog.open(DialigAtencionComponent, {
        disableClose: true,
        width: '70%',
        data: { tipo: 'UPDATE', campos: datos },
      });
      dialogRef.afterClosed().subscribe(result => {
        this.listarMedicamentos();
      });
    }

  }

  /*nuevoRegistro(){
    const dialogRef = this.dialog.open(DialigAtencionComponent, {
      disableClose: true,
      width: '70%',
      data: { tipo: 'NEW', campos: {} },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.listarMedicamentos();
      this.toastr.info('Registro almacenado', '', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true,
        newestOnTop: false,
        extendedTimeOut: 0,
        tapToDismiss: false,
        positionClass: "toast-bottom-left"
      });
    });
  }*/

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
