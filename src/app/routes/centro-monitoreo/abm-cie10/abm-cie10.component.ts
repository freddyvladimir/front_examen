import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CentroMonitoreoService } from '../centro-monitoreo.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DialogCrudComponent } from './dialog-crud/dialog-crud.component';

export interface datosPaciente {
}

@Component({
  selector: 'app-abm-cie10',
  templateUrl: './abm-cie10.component.html',
  styleUrls: ['./abm-cie10.component.scss']
})
export class AbmCie10Component implements OnInit,AfterViewInit {
  sql:any;
  responde:any;
  
  displayedColumns: string[] = [
    'serial',
    'alfa',
    'descripcion',
    'fecha'
  ];
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
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
        consulta: "select * from sp_lst_cie10_centro_monitoreo()"
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
    const params_listar_cie10 = {};
    this.http.listaCie10(params_listar_cie10).subscribe(res => {
      this.responde = res.success.data;
      console.log(this.responde);
      if (this.responde != null) {
        this.dataCie = this.responde;
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
    console.log(data);
  }

  editarRegistro(datos: any) {    
    const dialogRef = this.dialog.open(DialogCrudComponent, {
      disableClose: true,
      width: '70%',
      data: { tipo: 'UPDATE', campos: datos },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.listarMedicamentos();
      this.toastr.info('Registro almacenado', '', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true,
        newestOnTop: false,
        extendedTimeOut: 0,
        tapToDismiss: false,
        //positionClass: "toast-bottom-left"
      });
    });
  }

  nuevoRegistro(){
    const dialogRef = this.dialog.open(DialogCrudComponent, {
      disableClose: true,
      width: '70%',
      data: { tipo: 'NEW', campos: {} },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.listarMedicamentos();
      this.toastr.info('Registro almacenado', '', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true,
        newestOnTop: false,
        extendedTimeOut: 0,
        tapToDismiss: false,
        //positionClass: "toast-bottom-left"
      });
    });
  }

  eliminarRegistro(datos: any){
    console.log(datos);
    /*try {
      this.sql = {
        consulta: "select * from sp_abm_cie10_monitoreo("+datos.id_cie_10+",$$null$$,$$null$$,1,$$D$$)"
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          console.log("this.responde.success.data[0].sp_dinamico",this.responde.success.data[0].sp_dinamico);          
          this.listarMedicamentos();
          this.toastr.info('Registro eliminado', '', {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
            newestOnTop: false,
            extendedTimeOut: 0,
            tapToDismiss: false,
            //positionClass: "toast-bottom-left"
          });
        } else {
        }
      });
    } catch (error) {
    }*/
    var id = "";
    id = datos.id_cie_10;
    const params_eliminar_registro = {
      "n": id,
      "namee": "null",
      "datos": "null",
      "num": 1,
      "datosCie": "D"
    };
    this.http.eliminarCie10(params_eliminar_registro).subscribe(res => {
      this.responde = res.success.data;
      if (this.responde != null) {
        console.log("this.responde",this.responde);          
        this.listarMedicamentos();
        this.toastr.info('Registro eliminado', '', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true,
          newestOnTop: false,
          extendedTimeOut: 0,
          tapToDismiss: false,
        });
      } else {
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
