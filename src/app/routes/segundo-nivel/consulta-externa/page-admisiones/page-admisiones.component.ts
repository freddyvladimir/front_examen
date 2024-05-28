import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ConsultaExternaService } from '../consulta-externa.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SocketIoService } from 'app/routes/socket/socket-io.service';
import { CookieService } from 'ngx-cookie-service';


export interface listaFichas {
}

@Component({
  selector: 'app-page-admisiones',
  templateUrl: './page-admisiones.component.html',
  styleUrls: ['./page-admisiones.component.scss']
})
export class PageAdmisionesComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  IDUSUARIO = 1062;
  opciones: String = '';
  opcionesDetallada: String = '';
  dataSice: any;
  tipoRegistro: any;

  IDpaciente: any;

  sql: any;
  responde: any;

  displayedColumns: string[] = [
    'serial',
    'fecha',
    'servicio',
    'codigo',
  ];
  dataSource: MatTableDataSource<listaFichas>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  listadoFichas:any = [];
  popupWin:any;
  detallesFicha:any;
  tipoAtencion:any;
  constructor(
    private http: ConsultaExternaService,
    private socketWebService: SocketIoService,
    private cookieService: CookieService,
  ) {
    this.dataSource = new MatTableDataSource();
    this.tipoAtencion = {};
    socketWebService.callbackFI.subscribe(res => {
      console.log("--00--->", res);
      if (this.opciones == 'atencionFichas') {
        this.listaFichaAdmisiones();
      }
    })
  }

  ngOnInit(): void {
    this.cookieService.set('CM', 'FICHAS');
    /*this.socketWebService.callbackFI.subscribe(res => {
      console.log("----->", res);
    });*/
    this.listaFichaAdmisiones();
    this.opciones = 'atencionFichas';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  atenderFichasCE(data:any){
    console.log("data----",data);
    this.tipoAtencion = 'CE';
    this.detallesFicha = data;
    this.opciones = 'busqueda';
    this.sql = {
      consulta: 'select * from estadoPrestacion('+this.detallesFicha.vpres_id+',$$LLAMAR$$,$$'+ this.IDUSUARIO +'$$,$$8$$)'
    };
    this.http.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        this.socketWebService.llamarFichas(data);
      }
    });

  }
//select * from estadoPrestacion(1390350,$$PENDIENTE$$,$$1062$$)
  rellamarFicha(){
    this.socketWebService.llamarFichas(this.detallesFicha);
  }


  atenderFichasEM(){
    this.tipoAtencion = 'EM';
    this.opciones = 'busqueda';
  }

  atenderFichasHE(){
    console.log('ENTRANDO A HEMODIALISIS');
    this.tipoAtencion = 'HE';
    this.opciones = 'busqueda';
  }

  pendienteFicha(){
    this.opciones = 'atencionFichas';
    this.sql = {
      consulta: 'select * from estadoPrestacion('+this.detallesFicha.vpres_id+',$$PENDIENTE$$,$$'+ this.IDUSUARIO +'$$)'
    };
    this.http.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        this.socketWebService.llamarFichas(false);
      }
    });
  }

  nuevoPaciente() {
    this.dataSice = [];
    this.opciones = 'formulario';
    this.tipoRegistro = 'N'+'-'+this.tipoAtencion;
    /*this.tipoRegistro.estado = 'N';
    this.tipoRegistro.validados = this.tipoAtencion;*/
  }

  datosPaciente(data: any) {
    console.log("data", data);
    this.dataSice = data;
    this.opciones = 'formulario';
    this.tipoRegistro = 'M'+'-'+this.tipoAtencion;
    /*this.tipoRegistro.estado = 'M';
    this.tipoRegistro.validados = this.tipoAtencion;*/
  }

  retornar() {
    this.opciones = 'busqueda';
    this.opcionesDetallada = '';
  }
  dataSiiS(id: any) {
    this.IDpaciente = id;
    console.log("this.IDpaciente", this.IDpaciente);

    this.opcionesDetallada = 'tipoAtencion';
    this.opciones = 'datosPersonales';
  }

  fichasConsultaExterna() {
    this.opcionesDetallada = 'reservaFichaConsultaExterna';
    this.opciones = 'datosPersonales';
  }

  fichasEmergencias() {
    this.opcionesDetallada = 'reservaFichaEmergencias';
    this.opciones = 'datosPersonales';
  }

  fichasHemodialisis() {
    console.log("INGRESO POR HEMOOOOOO");
    this.opcionesDetallada = 'reservaHemodialisis';
    this.opciones = 'datosPersonales';
  }


  retornarServicos() {
    this.opcionesDetallada = 'tipoAtencion';
    this.opciones = 'datosPersonales';
  }

  listaFichaAdmisiones() {
    this.sql = {
      hospitalid: this.CODIGO_HOSPITAL,
      idusuario: this.IDUSUARIO
    };
    this.http.listaFichas(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      console.log(this.responde);

      if (this.responde.success.data != null) {
        this.listadoFichas = this.responde.success.data;
        this.dataSource = new MatTableDataSource(this.listadoFichas);
        this.ngAfterViewInit();
      } else {

      }
    });
  }

  recuperarDataFichas(data: any) {
    console.log("fichaseleccionada", data);
    this.sql = {
      consulta: 'select * from sp_insertar_prestacion_referencia (' + this.IDpaciente + ',' + data.id_servicio + ',$$' + data.fechaSeleccionada + '$$,$$' + 'NO' + '$$,' + data.numero_ficha + ',' + this.CODIGO_HOSPITAL + ',' + data.id_medico + ',' + data.id_turno + ',$$' + data.codigo_ficha + '$$,' + this.IDUSUARIO + ',$$' + data.inicio_hora + '$$,$$' + data.fin_hora + '$$,$$' + 'C' + '$$)'
    };
    this.http.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        console.log(this.responde.success.data[0].sp_dinamico);
        this.opcionesDetallada = 'tipoAtencion';
        this.opciones = 'datosPersonales';
      } else {

      }
    });
  }



  imprimirDocumentos () {
    var contenidoImpresion = `<!DOCTYPE html>
      <html>
        <head>
        <style type="text/css">
         .bordertrue {
             width: 100%;
             border: black 1px solid;
             margin-left: auto;
             margin-right: auto;
         }
         .border2 {
             /*width: 100%;*/
             border: black 1px solid;
             /*margin-left: auto;*/
             /*margin-right: auto;*/
         }
         .font1 {
             font-size: 10px;
         }
         .font2 {
             font-size: 9px;
         }
         #container {
             /*padding: 1px;*/
             width: 100%;
             text-align: center;
         }
         #left {
             float: left;
             width: 49%;
             padding: 2px;
         }
         #left2 {
             float: left;
             width: 69%;
             padding: 2px;
         }
         #center {
             display: inline-block;
             margin: 0 auto;
             width: 0%;
             padding: 1px;
         }
         #right {
             float: right;
             width: 100%;
             padding: 2px
         }
         #right2 {
             float: right;
             width: 29%;
             padding: 2px
         }
         .complete {
             display: inline-block;
             width: 99%;
         }
         /*out 1 todo123*/
         .between {
             /*border: 3px dotted #0099CC;*/
             margin-top: 0px;
             margin-bottom: 0px;
             margin-left: 10px;
             margin-right: 10px;
         }
         .parent {
             display: -moz-box;
             /* Firefox */
             display: -webkit-box;
             /* Safari and Chrome */
             display: -ms-flexbox;
             /* Internet Explorer 10 */
             display: box;
             width: 100%;
         }
         .child2 {
             -moz-box-flex: 5.0;
             /* Firefox */
             -webkit-box-flex: 5.0;
             /* Safari and Chrome */
             -ms-flex: 9.0;
             /* Internet Explorer 10 */
             box-flex: 9.0;
         }
        </style>
        </head>
        <body>
        <div class="font1">
         <div id="container">
             <div id="left">
             </div>
             <div id="right">
                 <table width="100%"  border='0' class="font2">
                     <tr>
                         <td width="15%" align="center">
                             <img style='float:left;' src='../../../img/logo1.png' width='50' height='30' alt='IMAGEN'
                                 border='0' align='left'>
                         </td>
                         <td width="80%" align="center">
                             <h3>
                             <center>GOBIERNO AUTONOMO MUNICIPAL DE LA PAZ <br></center>
                             <center><strong> NOMBRE_HOSPITAL</strong><br>
                             <center><strong>HOJA DE ADMISIÓN INTERNACIONES</strong></center>
                             </h3>
                         </td>
                         <td width="15%" align="center">
                             <img style='float:left;' src='../../../img/igob24-7.png' width='50' height='30' alt='IMAGEN'
                                 border='0' align='right'>
                         </td>
                     </tr>
                 </table>
                 <table width="100%"  border='1' class="font2">
                     <tr>
                         <td align="center" colspan = "3">
                             <b>TIPO DE PACIENTE:</b>
                             <BR><BR><BR>
                         </td>
                         <td align="center" colspan = "3">
                             <b>N° EC:</b>
                             <BR><BR><BR>
                         </td>
                     </tr>
                     <tr>
                         <td align="center" colspan = "1">
                         <b>PRIMER APELLIDO</b>
                         <BR><BR><BR>
                         </td>
                         <td align="center" colspan = "2">
                         <b>SEGUNDO APELLIDO</b>
                         <BR><BR><BR>
                         </td>
                         <td align="center" colspan = "3">
                         <b>NOMBRES</b>
                         <BR><BR><BR>
                         </td>
                     </tr>
                     <tr>
                         <td align="center" colspan = "1">
                         <b>FECHA DE NACIMIENTO</b>
                         <BR><BR><BR>
                         </td>
                         <td align="center" colspan = "1">
                         <b>EDAD(año,mes,dia)</b>
                         <BR><BR><BR>
                         </td>
                         <td align="center" colspan = "1">
                         <b>CI</b>
                         <BR><BR><BR>
                         </td>
                         <td align="center" colspan = "1">
                         <b>GÉNERO</b>
                         <BR><BR><BR>
                         </td>
                         <td align="center" colspan = "2">
                         <b>ESTADO CIVIL</b>
                         <BR><BR><BR>
                         </td>
                     </tr>
                     <tr>
                         <td align="center" colspan = "1">
                         <b>SERVICIO</b>
                         <BR><BR><BR>
                         </td>
                         <td align="center" colspan = "1">
                         <b>SALA</b>
                         <BR><BR><BR>
                         </td>
                         <td align="center" colspan = "1">
                         <b>CAMA</b>
                         <BR><BR><BR>
                         </td>
                         <td align="center" colspan = "3">
                         <b>ORIGEN DEL PACIENTE</b>
                         <BR><BR><BR>
                         </td>
                     </tr>
                     </table>
                     <h3>LUGAR DE NACIMIENTO</h3>
                     <table width="100%"  border='1' class="font2">
                     <tr>
                         <td align="center" colspan = "2">
                         <b>NACIONALIDAD</b>
                         <BR><BR><BR>
                         </td>
                         <td align="center" colspan = "2">
                         <b>DEPARTAMENTO</b>
                         <BR><BR><BR>
                         </td>
                         <td align="center" colspan = "2">
                         <b>CIUDAD</b>
                         <BR><BR><BR>
                         </td>
                     </tr>
                     <tr>
                         <td align="center" colspan = "3">
                             <b>EMPRESA DONDE TRABAJA</b>
                             <BR><BR><BR>
                         </td>
                         <td align="center" colspan = "3">
                             <b>OCUPACION QUE EJERCE EN LA EMPRESA</b>
                             <BR><BR><BR>
                         </td>
                     </tr>
                     </table>
                     <h3>DIRECCIÓN HABITUAL</h3>
                     <table width="100%"  border='1' class="font2">
                     <tr>
                         <td align="center" colspan = "1">
                         <b>CIUDAD</b>
                         <BR><BR><BR>
                         </td>
                         <td align="center" colspan = "1">
                         <b>ZONA</b>
                         <BR><BR><BR>
                         </td>
                         <td align="center" colspan = "1">
                         <b>DIRECCIÓN</b>
                         <BR><BR><BR>
                         </td>
                         <td align="center" colspan = "3">
                         <b>N° TELEF.</b>
                         <BR><BR><BR>
                         </td>
                     </tr>
                     </table>
                     <h3>DATOS DE LOS FAMILIARES</h3>
                     <table width="100%"  border='1' class="font2">
                     <tr>
                     <td align="center" colspan = "3">
                         <b>PADRE(APELLIDOS Y NOMBRES)</b>
                         <BR><BR><BR>
                     </td>
                     <td align="center" colspan = "3">
                         <b>MADRE(APELLIDOS Y NOMBRES)</b>
                         <BR>+ ($scope.registro.nomresMdre || "") + <BR><BR>
                     </td>
                     </tr>
                     <tr>
                     <td align="center" colspan = "3">
                         <b>CONYUGE(APELLIDOS Y NOMBRES)</b>
                         <BR>+ ($scope.registro.conyuge || "") + <BR><BR>
                     </td>
                     <td align="center" colspan = "3">
                         <b>OTROS(APELLIDOS Y NOMBRES)</b>
                         <BR>+ ($scope.registro.otras_personas || "") + <BR><BR>
                     </td>
                     </tr>
                     </table>
                     <h3>DATOS DEL ACOMPAÑANTE</h3>
                     <table width="100%"  border='1' class="font2">
                     <tr>
                     <!--td align="center" colspan = "2">
                         <b>APELLIDO PATERNO</b>
                         <BR>+ ($scope.registro.paterno_proximo || "") + <BR><BR>
                     </td-->
                     <td align="center" colspan = "3">
                         <b>APELLIDOS Y NOMBRES</b>
                         <BR>+ ($scope.registro.materno_proximo || "") + <BR><BR>
                     </td>
                     <td align="center" colspan = "3">
                         <b>RELACIÓN</b>
                         <BR>+ ($scope.registro.nombre_proximo || "") + <BR><BR>
                     </td>
                     </tr>
                     <tr>
                         <td align="center" colspan = "1">
                         <b>CIUDAD</b>
                         <BR>+ ($scope.registro.ciudad_proximo || "") + <BR><BR>
                         </td>
                         <td align="center" colspan = "1">
                         <b>ZONA</b>
                         <BR>+ ($scope.registro.zona_proximo || "") + <BR><BR>
                         </td>
                         <td align="center" colspan = "1">
                         <b>DIRECCIÓN</b>
                         <BR>+ ($scope.registro.calle_proximo || "") + <BR><BR>
                         </td>
                         <td align="center" colspan = "3">
                         <b>N° TELEF.</b>
                         <BR>+ ($scope.registro.telefono_proximo || "") + <BR><BR>
                         </td>
                     </tr>
                     <tr>
                     <td align="center" colspan = "3">
                         <b>FECHA</b>
                         <BR> + ($scope.fecha_servidor || "") + <BR><BR>
                     </td>
                     <td align="center" colspan = "3">
                         <b>HORA DE ADMISION</b>
                         <BR> + ($scope.hora_servidor || "") + <BR><BR>
                     </td>
                     </tr>
                     <tr>
                         <td align="center" colspan = "6">
                         <BR><BR><BR>
                         <b>FIRMA Y SELLO</b>
                         </td>
                     </tr>

                 </tr>
                 </table>
                 <div>
                 </div>
             </div>
        </body>
        </html>
        `;
    return contenidoImpresion;
  };


  eventImprimirDocumento () {
    this.popupWin = window.open('', '_blank', 'width=800,height=800');
    this.popupWin.document.open();
    this.popupWin.document.write('<html><head></head><body onload="window.print()">' + this.imprimirDocumentos() + '<br><br></html>');
    this.popupWin.document.close();
  };



}
