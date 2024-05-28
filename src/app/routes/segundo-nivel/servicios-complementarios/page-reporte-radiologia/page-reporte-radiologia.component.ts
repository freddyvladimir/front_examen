import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ServiciosComplementariosService } from '../servicios-complementarios.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export interface UserData {
}

@Component({
  selector: 'app-page-reporte-radiologia',
  templateUrl: './page-reporte-radiologia.component.html',
  styleUrls: ['./page-reporte-radiologia.component.scss']
})
export class PageReporteRadiologiaComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  IDUSUARIO = 1552;
  NOMBRE_HOSPITAL = 'hospital la merced'
  US_PATERNO = 'PATERNO';
  US_MATERNO = 'MATERNO';
  US_NOMBRE = 'NOMBRES';
  fechaActualImp: any = '29-11-2021';

  responde: any;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  displayedColumns: string[] = ['serial', 'vfechareporte', 'vhcl_codigoseg', 'vdtspsl_paterno', 'vdtspsl_materno', 'vdtspsl_nombres', 'vdtspsl_edad', 'vtp_tipo_paciente', 'vdtspsl_genero', 'vsc_sol_area_solicitante', 'vsc_sol_esp_descripcion', 'vsc_sol_descripcion_medico',];
  dataSource: MatTableDataSource<UserData>;
  listaAtenciones: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  popupWin: any;
  private _workbook!: Workbook;



  PLACARADIOLOGICA18X24 = true;
  PLACARADIOLOGICA20X25 = false;
  PLACARADIOLOGICA24X30 = false;
  PLACARADIOLOGICA25X30 = false;
  PLACARADIOLOGICA30X40 = false;
  PLACARADIOLOGICA35X35 = false;
  PLACARADIOLOGICA35X43 = false;
  PLACARADIOLOGICA3X4 = false;
  PLACAPERIAPICALPEDIATRICA = false;
  vtptrn_descripcion:any;
  constructor(private http: ServiciosComplementariosService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
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

  seleccionar_fecha(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    let sql = {
      idhospital: this.CODIGO_HOSPITAL,
      fecha_ini: dateRangeStart.value,
      fecha_fin: dateRangeEnd.value,
      idusuario: this.IDUSUARIO
    };
    this.http.lista_service_reporte_diario_radiologia(sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data != null) {
        this.listaAtenciones = this.responde.success.data;
        this.vtptrn_descripcion = this.listaAtenciones[0].vtptrn_descripcion;
        this.dataSource = new MatTableDataSource(this.listaAtenciones);
        this.ngAfterViewInit();
      } else {
        this.listaAtenciones = [];
        this.dataSource = new MatTableDataSource(this.listaAtenciones);
        this.ngAfterViewInit();
      }
    });

  }

  generarReporte() {
    let sql = {
      idhospital: this.CODIGO_HOSPITAL,
      idusuario: this.IDUSUARIO
    };
    this.http.reporte_entrega_resultados_ecografia(sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data != null) {
      } else {
      }
    });

  }

  reimprimirAtencion(datos: any) {
    this.popupWin = window.open('', '_blank', 'width=800,height=800');
    this.popupWin.document.open();
    this.popupWin.document.write('<html><head></head><body onload="window.print()">' + this.generarDocumentoLaboratorios(datos) + '<br><br></html>');
    this.popupWin.document.close();
  };

  generarDocumentoLaboratorios(datos: any) {
    var red;
    var cadenasHallazgos = "";
    var cadenasConclusiones = "";
    var solicitudesRa = JSON.parse(datos.vdatos_data);
    var cadenax = [];
    for (var i = 0; i < solicitudesRa.length; i++) {
      if (solicitudesRa[0].hallazgos == 'undefined') {
        solicitudesRa[0].hallazgos = '';
        cadenax = [];
      }
      else {
        cadenax = solicitudesRa[0].hallazgos.split("\n");
      }
      if (solicitudesRa[0].conclusion == 'undefined') {
        solicitudesRa[0].hallazgos = '';
        var cadenax = [];

      }
      else {
        cadenax = solicitudesRa[0].hallazgos.split("\n");
      }
      cadenasHallazgos += `
                <p><b>`+ solicitudesRa[0].descripcion + ` : </b></p>
            `;
      for (var j = 0; j < cadenax.length; j++) {
        cadenasHallazgos += `
                <p>`+ cadenax[j] + `</p>
            `;
      }
    }

    for (var i = 0; i < solicitudesRa.length; i++) {
      var cadenay = solicitudesRa[0].conclusion.split("\n");
      cadenasConclusiones += `
                <p><b>`+ solicitudesRa[0].descripcion + ` : </b></p>
            `;
      for (var j = 0; j < cadenay.length; j++) {
        cadenasConclusiones += `
                <p>`+ cadenay[j] + `</p>
            `;
      }
    }

    if (this.CODIGO_HOSPITAL == "1") {
      red = "RED 3 NORTE CENTRAL";
    }

    if (this.CODIGO_HOSPITAL == "2") {
      red = "RED 5 SUR";
    }

    if (this.CODIGO_HOSPITAL == "3") {
      red = "RED 2 NOR ESTE";
    }

    if (this.CODIGO_HOSPITAL == "5") {
      red = "RED 1 SUR OESTE";
    }

    var printContents = `
        <!DOCTYPE html>
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
              border: black 1px solid;
            }

            .font1 {
              font-size: 10px;
            }

            .font2 {
              font-size: 9px;
            }

            #container {
                width:100%;
                text-align:center;
            }

            #left {
                float:left;
                width:49%;
                padding: 2px;
            }

            #left2 {
                float:left;
                width:69%;
                padding: 2px;
            }

            #center {
                display: inline-block;
                margin:0 auto;
                width:0%;
                padding: 1px;
            }

            #right {
                float:right;
                width:100%;
                padding: 2px
            }

            #right2 {
                float:right;
                width:29%;
                padding: 2px
            }

            .complete {
                display: inline-block;
                width: 99%;
            }
            .between {
                margin-top: 0px;
                margin-bottom: 0px;
                margin-left:10px;
                margin-right:10px;
            }
            .parent
            { 
                display:-moz-box; 
                display:-webkit-box; 
                display:-ms-flexbox; 
                display:box;
                width:100%;
            }
            .child2
            {
                -moz-box-flex:5.0; 
                -webkit-box-flex:5.0; 
                -ms-flex:9.0; 
                box-flex:9.0;
            }
        </style>
    </head>
    <body>
        <div class="font1">
        <div id="container">
            <div id="left">
                
            </div>
            
            <div id="right">

                <table width="100%" class="font2">
                    <tr>
                        <td width="15%" align="center">
                            <img style='float:left;' src='../../../assets/images/logoGamlp.png' width='70' height='50' alt='IMAGEN' border='0' align='left'>
                        </td>
                        <td width="80%" align="center">
                            <b>REPORTE DE RESULTADOS DE EXAMENES DE <BR> LABORATORIO IMAGENOLOGIA/ GABINETE Y SERVICIO DE <BR> SANGRE SEGURA</b>
                        </td>
                        <td width="15%" align="center">
                            <img style='float:left;' src='../../../assets/images/logohospitales.png' width='70' height='50' alt='IMAGEN' border='0' align='right'>
                        </td>
                    </tr>
                </table>
                <div>
                    <table width="100%" class="font2">
                        <tr>
                            <td colspan="2" width="50%" class="border2" align="left">RED: `+ red + ` </td>
                            <td width="50%" class="border2" align="left">MUNICIPIO: LA PAZ</td>
                        </tr>
                        <tr>
                            <td colspan="3" class="border2" align="left">SERVICIO: ECOGRAFIA </td>
                        </tr>

                        <tr>
                            <td colspan="2" width="50%" class="border2" align="left">FECHA DE REPORTE: `+ datos.vfechareporte + `</td>
                            <td width="50%" class="border2" align="left">Nª REGISTRO: `+ datos.vhcl_codigoseg + ` </td>
                        </tr>
                        <tr>
                            <td width="60%" align="left" class="border2">NOMBRE: `+ (datos.vdtspsl_paterno + ` ` + datos.vdtspsl_materno + ` ` + datos.vdtspsl_nombres).toUpperCase() + ` </td>
                            <td width="20%" align="left" class="border2">EDAD: `+ datos.vdtspsl_edad.toUpperCase() + `</td> 
                            <td width="50%" align="left" class="border2">SEXO: `+ datos.vdtspsl_genero.toUpperCase() + `</td>  
                        </tr>
                        <tr>
                            <td colspan="3" class="border2" align="left">ESTABLECIMIENTO SOLICITANTE: `+ this.NOMBRE_HOSPITAL.toUpperCase() + ` </td>
                        </tr>
                        <tr>
                            <td colspan="3" class="border2" align="left">MEDICO SOLICITANTE: `+ datos.vsc_sol_descripcion_medico.toUpperCase() + ` </td>
                        </tr>
                    </table>
                </div>
                <div class="complete">
                    <div class="container border1">
                    <div style="border: solid 1px;">
                        <table width="100%" style="padding: 5px;" class="font2">
                            <tr>
                              <td valign= "top" align="left"><b>HALLAZGOS:</b> <br>`+ cadenasHallazgos.toUpperCase() + `</td>
                            </tr> 
                            <tr>
                              <td valign= "top" align="left"><b>CONCLUSIONES:</b> <br>`+ cadenasConclusiones.toUpperCase() + ` </td>
                            </tr>                      
                        </table>
                    </div>
                    <br>
                    <div style="border: solid 1px;">
                        <div align="left" style="padding-left: 5px;"><b>SERVICIO DE BANCO DE SANGRE - BOLSAS ENTREGADAS:</b></div>

                        <table width="100%" class="font1">
                            <tr>
                                <td align="left" width="80%" widstyle="padding-left: 5px;"><b>GRUPO SANGUINEO y FACTOR Rh:</b></td>
                                <td style="border: solid 1px;" width="10%" align="center">AB+</td>
                                <td  width="10%" align="center">&nbsp;</td>
                            </tr>
                        </table>

                      <!-- <hr align="center" noshade="noshade" size="2" width="100%"/> -->

                        <table width="100%" align="center" class="font1">
                            <tr>
                                <td width="10%" align="right"></td>
                                <td width="30%" align="right"></td>
                                <td width="5%" align="left" style="border: solid 1px;">Cant.</td>
                                <td width="5%" align="left" style="border: solid 1px;">Nª de Bolsa(s)</td>
                                <td width="30%" align="right"></td>
                                <td width="5%" align="left" style="border: solid 1px;">Cant.</td>
                                <td width="5%" align="left" style="border: solid 1px;">Nª de Bolsa(s)</td>
                                <td width="10%" align="right"></td>
                            </tr>

                            <tr>
                                <td width="10%" align="right"></td>
                                <td width="30%" align="right">Sangre Total</td>
                                <td width="5%" align="center" style="border: solid 1px;"></td>
                                <td width="5%" align="left" style="border: solid 1px;"></td>
                                <td width="30%" align="right">Crioprecipitados</td>
                                <td width="5%" align="center" style="border: solid 1px;"></td>
                                <td width="5%" align="left" style="border: solid 1px;"></td>
                                <td width="10%" align="right"></td>
                            </tr>

                            <tr>
                                <td width="10%" align="right"></td>
                                <td width="30%" align="right">Paquete Globular</td>
                                <td width="5%" align="center" style="border: solid 1px;"></td>
                                <td width="5%" align="left" style="border: solid 1px;"></td>
                                <td width="30%" align="right">Anticuerpos Irregulares</td>
                                <td width="5%" align="center" style="border: solid 1px;"></td>
                                <td width="5%" align="left" style="border: solid 1px;"></td>
                                <td width="10%" align="right"></td>
                            </tr>

                            <tr>
                                <td width="10%" align="right"></td>
                                <td width="30%" align="right">Plasma Fresco Congelado</td>
                                <td width="5%" align="center" style="border: solid 1px;"></td>
                                <td width="5%" align="left" style="border: solid 1px;"></td>
                                <td width="30%" align="right">Plasma Normal</td>
                                <td width="5%" align="center" style="border: solid 1px;"></td>
                                <td width="5%" align="left" style="border: solid 1px;"></td>
                                <td width="10%" align="right"></td>
                            </tr>

                            <tr>
                                <td width="10%" align="right"></td>
                                <td width="30%" align="right">Concentrado de Plaquetas</td>
                                <td width="5%" align="center" style="border: solid 1px;"></td>
                                <td width="5%" align="left" style="border: solid 1px;"></td>
                                <td width="30%" align="right">Globulos Rojos</td>
                                <td width="5%" align="center" style="border: solid 1px;"></td>
                                <td width="5%" align="left" style="border: solid 1px;"></td>
                                <td width="10%" align="right"></td>
                            </tr>

                            <tr>
                                <td width="10%" align="right"></td>
                                <td width="30%" align="right">Aféresis</td>
                                <td width="5%" align="center" style="border: solid 1px;"></td>
                                <td width="5%" align="left" style="border: solid 1px;"></td>
                                <td width="30%" align="right">Otros(Especificar)</td>
                                <td width="5%" align="center" style="border: solid 1px;"></td>
                                <td width="5%" align="left" style="border: solid 1px;"></td>
                                <td width="10%" align="right"></td>
                            </tr>
                            <tr align="right">
                                <td width="10%"></td>
                                <td width="30%"></td>
                                <td width="5%"></td>
                                <td width="5%"></td>
                                <td width="30%"></td>
                                <td width="5%"></td>
                                <td width="5%"></td>
                                <td width="10%"></td>
                            </tr>
                        </table>
                    </div>
                    </div>    
                    
                    <br><br>
                    <table width="100%" class="font1">
                        <tr align="center">
                            <td><hr align="center" noshade="noshade" size="2" width="50%"/></td>
                            <td><hr align="center" noshade="noshade" size="2" width="50%"/></td>
                        </tr>

                        <tr align="center">
                            <td>Firma y Sello del Responsable del<br>reporte o de la entrega</td>
                            <td>Sello<br>Servicio</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        </div>
    </body>
    </html>
        `;
    return printContents;
  };

  imprimirNuevaHoja() {
    //this.popupWin = window.open('', '_blank', '"outerWidth=600,width=500,innerWidth=400,resizable,scrollbars,status');
    this.popupWin = window.open('', '_blank', 'width=800,height=800');
    this.popupWin.document.open();
    this.popupWin.document.write('<html><head></head><body onload="window.print()">' + this.generarRegistroResultadosNuevaHoja() + '<br><br></html>');
    this.popupWin.document.close();
  }

  generarRegistroResultadosNuevaHoja() {
    var data_table2 = "";
    this.listaAtenciones = {};
    var tamañoPrimero = this.listaAtenciones.length;
    var printContents;
    if (0 <= 100) {
      var calculo = 17 - tamañoPrimero;
      for (var j = 1; j < 17; j++) {
        data_table2 = data_table2 + `
                  <tr height="50px">
                      <td style="border: solid 1px;" align="center">`+ j + `</td>
                      <td style="border: solid 1px;" align="center"></td>
                      <td style="border: solid 1px;" align="center"></td>
                      <td style="border: solid 1px;" align="center"></td>
                      <td style="border: solid 1px;" align="center"></td>
                      <td style="border: solid 1px;" align="center"></td>
                      <td style="border: solid 1px;" align="center"></td>
                      <td style="border: solid 1px;" align="center"></td>
                      <td style="border: solid 1px;" align="center"></td>
                      <td style="border: solid 1px;" align="center"></td>
                      <td style="border: solid 1px;" align="center"></td>
                      <td style="border: solid 1px;" align="center"></td>
                      `;
        data_table2 = data_table2 + `</tr>`;
      }
      printContents = `
          <html>
            <head>
            </head>
            <body bgcolor="white" text="black" link="blue" vlink="purple" alink="red">
            <table align="center" border="0" width="100%">
                <tr>
                    <td width="15%" align="center">
                    <img style='float:left;' src='../../../assets/images/logoGamlp.png' width='70' height='50' alt='IMAGEN' border='0' align='left'>
                    </td>
                    <td width="80%" align="center">
                        <p align="center"><font face="Lucida Console"><span style="font-size:20pt;">REGISTRO DE ENTREGA DE RESULTADOS DE ECOGRAFÍA</span></font></p>
                    </td>
                    <td width="15%" align="center">
                            <img style='float:left;' src='../../../assets/images/logohospitales.png' width='70' height='50' alt='IMAGEN' border='0' align='right'>
                    </td>
                </tr>
            </table>
            <div align="left">
                <table style="line-height:100%; margin-top:0; margin-bottom:0;" border="0" width="100%">
                    <tr>
                        <td width="1704">
                            <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="left"><font face="Lucida Console"><span style="font-size:10pt;">ECOGRAFO 
                            DE TURNO: `+ this.US_PATERNO + ` ` + this.US_MATERNO + ` ` + this.US_NOMBRE + `<br> FECHA:` + this.fechaActualImp + `</span></font></p>
                        </td>
                    </tr>
                </table>
            </div>
            <table align="center" border="1" width="100%">
            <tr>
                <td width="29" rowspan="2">
                    <b><p align="center"><font face="Lucida Console"><span style="font-size:8pt;">N°</span></font></p></b>
                </td>
                <td width="84" rowspan="2">
                    <b><p align="center"><font face="Lucida Console"><span style="font-size:8pt;">NUMERO 
                    DE EC</span></font></p></b>
                </td>
                <td width="520" colspan="3">
                    <b><p align="center"><font face="Lucida Console"><span style="font-size:8pt;">NOMBRE 
                    DEL PACIENTE</span></font></p></b>
                </td>
                <td width="130" rowspan="2">
                    <b><p align="center"><font face="Lucida Console"><span style="font-size:8pt;">TIPO DE <br> PACIENTE</span></font></p></b>
                </td>
                <td width="261" rowspan="2">
                    <b><p align="center"><font face="Lucida Console"><span style="font-size:8pt;">TIPO DE ESTUDIO</span></font></p></b>
                </td>
                <td width="261" rowspan="2">
                    <b><p align="center"><font face="Lucida Console"><span style="font-size:8pt;">ESPECIFICACIONES</span></font></p></b>
                </td>
                <td width="170" rowspan="2">
                    <b><p align="center"><font face="Lucida Console"><span style="font-size:8pt;">ÁREA SOLICITANTE</span></font></p></b>
                </td>
                <td width="261" rowspan="2">
                    <b><p align="center"><font face="Lucida Console"><span style="font-size:8pt;">NOMBRE 
                    DE LA PERSONA QUE RECOGE LOS RESULTADOS</span></font></p></b>
                </td>
                <td width="195" rowspan="2">
                    <b><p align="center"><font face="Lucida Console"><span style="font-size:8pt;">FIRMA</span></font></p></b>
                </td>
            </tr>
            <tr>
                <td width="172">
                    <b><p align="center"><font face="Lucida Console"><span style="font-size:8pt;">APELLIDO 
                    PATERNO</span></font></p></b>
                </td>
                <td width="172">
                    <b><p align="center"><font face="Lucida Console"><span style="font-size:8pt;">APELLIDO 
                    MATERNO</span></font></p></b>
                </td>
                <td width="150">
                    <b><p align="center"><font face="Lucida Console"><span style="font-size:8pt;">NOMBRES</span></font></p></b>
                </td>
            </tr>
                      `+ data_table2 + `
                    </table>
                    <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="left"></p>
                    </table>
                </body>
        </html>`;
    }
    else {
      //aqui va cuando es mayor
    }
    return printContents;
  }


  async generarExcel(): Promise<void> {
    this._workbook = new Workbook();
    this._workbook.creator = 'DigiDev';
    await this._createTable(this.listaAtenciones);
    this._workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data]);
      fs.saveAs(blob, 'Reporte diario de radiologia.xlsx');
    });
  }

  private async _createTable(dataTable: any[]): Promise<void> {
    const sheet = this._workbook.addWorksheet('Reporte diario de radiologia');
    sheet.getColumn('A').width = 15;
    sheet.getColumn('B').width = 15;
    sheet.getColumn('C').width = 15;
    sheet.getColumn('D').width = 15;
    sheet.getColumn('E').width = 15;
    sheet.getColumn('F').width = 15;
    sheet.getColumn('G').width = 15;
    sheet.getColumn('H').width = 15;
    sheet.getColumn('I').width = 15;
    sheet.getColumn('J').width = 15;
    sheet.getColumn('K').width = 15;
    sheet.columns.forEach((column) => {
      column.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    });
    //const idImage = await this._getIdImage('./assets/images/logoGamlp.png');
    const idImageGamlp = await this._getIdImage('./assets/images/logoGamlp.png');
    sheet.addImage(idImageGamlp, {
      tl: { col: 0.08, row: 0.2 },
      ext: { width: 128, height: 100 },
    });
    sheet.mergeCells('C3:I3')
    const titleCell = sheet.getCell('F3');
    titleCell.value = 'Reporte diario de radiologia';
    titleCell.style.font = { bold: true, size: 20 };

    const idImageHospital = await this._getIdImage('./assets/images/logohospitales.png');
    sheet.addImage(idImageHospital, {
      tl: { col: 9.99, row: 0.2 },
      ext: { width: 128, height: 100 },
    });

    const headerRow = sheet.getRow(7);
    headerRow.values = [
      'FECHA DE ATENCION',
      'NUMERO DE EC',
      'APELLIDO PATERNO',
      'APELLIDO MATERNO',
      'NOMBRES',
      'EDAD',
      'TIPO DE PACIENTE',
      'GENERO',
      'SERVICIO DE ORIGEN',
      'ESPECIALIDAD',
      'MEDICO SOLICITANTES'
    ];
    headerRow.font = { bold: true, size: 12 };
    const rowsToInsert = sheet.getRows(8, dataTable.length)!;
    for (let index = 0; index < rowsToInsert.length; index++) {
      const itemData = dataTable[index];
      const row = rowsToInsert[index];
      row.values = [
        itemData.vfechareporte,
        parseInt(itemData.vhcl_codigoseg),
        itemData.vdtspsl_paterno,
        itemData.vdtspsl_materno,
        itemData.vdtspsl_nombres,
        itemData.vdtspsl_edad,
        itemData.vtp_tipo_paciente,
        itemData.vdtspsl_genero,
        itemData.vsc_sol_area_solicitante,
        itemData.vsc_sol_esp_descripcion,
        itemData.vsc_sol_descripcion_medico,
      ];
      ['A7', 'B7', 'C7', 'D7', 'E7', 'F7', 'G7', 'H7', 'I7', 'J7', 'K7'].forEach(element => {
        var prueba = sheet.getCell(element);
        prueba.border = { bottom: { style: 'thin' }, top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        prueba.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '09B8B0' }
        }
      });
      ['A' + (index + 8), 'B' + (index + 8), 'C' + (index + 8), 'D' + (index + 8), 'E' + (index + 8), 'F' + (index + 8), 'G' + (index + 8), 'H' + (index + 8), 'I' + (index + 8), 'J' + (index + 8), 'K' + (index + 8)].forEach(element => {
        var prueba = sheet.getCell(element);
        prueba.border = { bottom: { style: 'thin' }, top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
      });

    }
  }

  private async _getIdImage(url: string): Promise<number> {
    const response = await fetch(url);
    const image = this._workbook.addImage({
      buffer: await response.arrayBuffer(),
      extension: 'jpeg',
    });

    return image;
  }


  imprimirReporte() {
    this.popupWin = window.open('', '_blank', '"outerWidth=600,width=500,innerWidth=400,resizable,scrollbars,status');
    this.popupWin.document.open();
    this.popupWin.document.write('<html><head></head><body onload="window.print()">' + this.generarReporteImpresion() + '<br><br></html>');
    this.popupWin.document.close();
  };


  generarReporteImpresion () {
    var informeSITOTAL = 0;
    var informeNOTOTAL = 0;
    var totalLey = 0;
    var totalInstitucional = 0;
    var totalSoat = 0;
    var totalFemenino = 0;
    var totalMasculino = 0;
    var totalExterno = 0;
    var totalConsultaE = 0;
    var totalHospitalizacion = 0;
    var totalEmergencias = 0;
    var totalPLACARADIOLOGICA18X24 = 0;
    var totalPLACARADIOLOGICA20X25 = 0;
    var totalPLACARADIOLOGICA24X30 = 0;
    var totalPLACARADIOLOGICA25X30 = 0;
    var totalPLACARADIOLOGICA30X40 = 0;
    var totalPLACARADIOLOGICA35X35 = 0;
    var totalPLACARADIOLOGICA35X43 = 0;
    var totalPLACARADIOLOGICA3X4 = 0;
    var totalPLACAPERIAPICALPEDIATRICA = 0;
    var totalPLACASVERTICAL = 0;
    var total
    var data_table = "";
    var totalEstudios = 0;


    var tipoPacienteIns = '';
    var tipoPacienteLey = '';
    var tipoPacienteSoat = '';
    var generoM = '';
    var generoF = '';
    var areaExterna = '';
    var areaCE = '';
    var areaHospita = '';
    var areaEmer = '';
    var informeSI = 'X';
    var informeNO = '';
    var tamaño;

    for (var i = 0; i < this.listaAtenciones.length; i++) {
      tamaño = JSON.parse(this.listaAtenciones[i].vdatos_data).length + 1;
      totalEstudios = totalEstudios + JSON.parse(this.listaAtenciones[i].vdatos_data).length;
      
      if (this.listaAtenciones[i].vtp_tipo_paciente == 'INSTITUCIONAL') {
        totalInstitucional = totalInstitucional + 1;
        tipoPacienteIns = 'X';
        tipoPacienteLey = '';
        tipoPacienteSoat = '';
      }
      if (this.listaAtenciones[i].vtp_tipo_paciente == 'SUS - LEY 1152') {
        totalLey = totalLey + 1;
        tipoPacienteIns = '';
        tipoPacienteLey = 'X';
        tipoPacienteSoat = '';
      }
      if (this.listaAtenciones[i].vtp_tipo_paciente == 'SOAT') {
        totalSoat = totalSoat + 1;
        tipoPacienteIns = '';
        tipoPacienteLey = '';
        tipoPacienteSoat = 'X';
      }

      if (this.listaAtenciones[i].vdtspsl_genero == 'MASCULINO') {
        totalMasculino = totalMasculino + 1;
        generoM = 'X';
        generoF = '';
      }

      if (this.listaAtenciones[i].vdtspsl_genero == 'FEMENINO') {
        totalFemenino = totalFemenino + 1;
        generoM = '';
        generoF = 'X';
      }

      if (this.listaAtenciones[i].vsc_sol_area_solicitante == 'ADMISIONES') {
        totalExterno = totalExterno + 1;
        areaExterna = 'X';
        areaCE = '';
        areaHospita = '';
        areaEmer = '';
      }

      if (this.listaAtenciones[i].vsc_sol_area_solicitante == 'CONSULTA EXTERNA') {
        totalConsultaE = totalConsultaE + 1;
        areaExterna = '';
        areaCE = 'X';
        areaHospita = '';
        areaEmer = '';
      }

      if (this.listaAtenciones[i].vsc_sol_area_solicitante == 'EMERGENCIAS') {
        totalEmergencias = totalEmergencias + 1;
        areaExterna = '';
        areaCE = '';
        areaHospita = '';
        areaEmer = 'X';
      }

      if (this.listaAtenciones[i].vsc_sol_area_solicitante == 'INTERNACIONES') {
        totalHospitalizacion = totalHospitalizacion + 1;
        areaExterna = '';
        areaCE = '';
        areaHospita = 'X';
        areaEmer = '';
      }

      if (this.listaAtenciones[i].vsc_requiere_imagenologo == 'SI') {
        informeSI = 'X';
        informeNO = '';
      }

      if (this.listaAtenciones[i].vsc_requiere_imagenologo == 'NO') {
        informeSI = '';
        informeNO = 'X';
      }

      data_table = data_table + `
            <tr>
                <td style="border: solid 1px;" rowspan="`+ tamaño + `" align="center">` + (i + 1) + `</td>
                <td style="border: solid 1px;" rowspan="`+ tamaño + `" align="center">` + this.listaAtenciones[i].vhcl_codigoseg + `</td>
                <td style="border: solid 1px;" rowspan="`+ tamaño + `" align="center">` + this.listaAtenciones[i].vdtspsl_paterno + `</td>
                <td style="border: solid 1px;" rowspan="`+ tamaño + `" align="center">` + this.listaAtenciones[i].vdtspsl_materno + `</td>
                <td style="border: solid 1px;" rowspan="`+ tamaño + `" align="center">` + this.listaAtenciones[i].vdtspsl_nombres + `</td>
                <td style="border: solid 1px;" rowspan="`+ tamaño + `" align="center">` + this.listaAtenciones[i].vdtspsl_edad + `</td>
                <td style="border: solid 1px;" rowspan="`+ tamaño + `" align="center">` + tipoPacienteLey + `</td>
                <td style="border: solid 1px;" rowspan="`+ tamaño + `" align="center">` + tipoPacienteIns + `</td>
                <td style="border: solid 1px;" rowspan="`+ tamaño + `" align="center">` + tipoPacienteSoat + `</td>
                <td style="border: solid 1px;" rowspan="`+ tamaño + `" align="center">` + generoF + `</td>
                <td style="border: solid 1px;" rowspan="`+ tamaño + `" align="center">` + generoM + `</td>
                <td style="border: solid 1px;" rowspan="`+ tamaño + `" align="center">` + areaExterna + `</td>
                <td style="border: solid 1px;" rowspan="`+ tamaño + `" align="center">` + areaCE + `</td>
                <td style="border: solid 1px;" rowspan="`+ tamaño + `" align="center">` + areaHospita + `</td>
                <td style="border: solid 1px;" rowspan="`+ tamaño + `" align="center">` + areaEmer + `</td>
               `;
      if (tamaño - 1 == 0) {
        data_table = data_table + `
            
              
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            `;
      }
      else {

        var PLACARADIOLOGICA18X24 = '';
        var PLACARADIOLOGICA20X25 = '';
        var PLACARADIOLOGICA18X24 = '';
        var PLACARADIOLOGICA20X25 = '';
        var PLACARADIOLOGICA24X30 = '';
        var PLACARADIOLOGICA25X30 = '';
        var PLACARADIOLOGICA30X40 = '';
        var PLACARADIOLOGICA35X35 = '';
        var PLACARADIOLOGICA35X43 = '';
        var PLACARADIOLOGICA3X4 = '';
        var PLACAPERIAPICALPEDIATRICA = '';
        //var totalPLACAPERIAPICALPEDIATRICA = '';



        for (var j = 0; j < tamaño - 1; j++) {
          if (this.listaAtenciones[i].vsc_requiere_imagenologo == 'SI') {
            informeSITOTAL = informeSITOTAL + 1;
          }

          if (this.listaAtenciones[i].vsc_requiere_imagenologo == 'NO') {
            informeNOTOTAL = informeNOTOTAL + 1;
          }
          totalPLACASVERTICAL = totalPLACASVERTICAL + parseInt(this.listaAtenciones[i].vdatos_data[j].cantidad);
          
          if (this.listaAtenciones[i].vdatos_data[j].tamanio == 'PLACA RADIOLOGICA 18 X 24 cm') {
            this.PLACARADIOLOGICA18X24 = true;
            this.PLACARADIOLOGICA20X25 = false;
            this.PLACARADIOLOGICA24X30 = false;
            this.PLACARADIOLOGICA25X30 = false;
            this.PLACARADIOLOGICA30X40 = false;
            this.PLACARADIOLOGICA35X35 = false;
            this.PLACARADIOLOGICA35X43 = false;
            this.PLACARADIOLOGICA3X4 = false;
            this.PLACAPERIAPICALPEDIATRICA = false;

            PLACARADIOLOGICA18X24 = this.listaAtenciones[i].vdatos_data[j].cantidad;
            PLACARADIOLOGICA20X25 = '';
            PLACARADIOLOGICA24X30 = '';
            PLACARADIOLOGICA25X30 = '';
            PLACARADIOLOGICA30X40 = '';
            PLACARADIOLOGICA35X35 = '';
            PLACARADIOLOGICA35X43 = '';
            PLACARADIOLOGICA3X4 = '';
            PLACAPERIAPICALPEDIATRICA = '';



            totalPLACARADIOLOGICA18X24 = totalPLACARADIOLOGICA18X24 + parseInt(this.listaAtenciones[i].vdatos_data[j].cantidad);

          }
          if (this.listaAtenciones[i].vdatos_data[j].tamanio == 'PLACA RADIOLOGICA 20 X 25 cm') {
            this.PLACARADIOLOGICA18X24 = false;
            this.PLACARADIOLOGICA20X25 = true;
            this.PLACARADIOLOGICA24X30 = false;
            this.PLACARADIOLOGICA25X30 = false;
            this.PLACARADIOLOGICA30X40 = false;
            this.PLACARADIOLOGICA35X35 = false;
            this.PLACARADIOLOGICA35X43 = false;
            this.PLACARADIOLOGICA3X4 = false;
            this.PLACAPERIAPICALPEDIATRICA = false;
            PLACARADIOLOGICA18X24 = '';
            PLACARADIOLOGICA20X25 = this.listaAtenciones[i].vdatos_data[j].cantidad;
            PLACARADIOLOGICA24X30 = '';
            PLACARADIOLOGICA25X30 = '';
            PLACARADIOLOGICA30X40 = '';
            PLACARADIOLOGICA35X35 = '';
            PLACARADIOLOGICA35X43 = '';
            PLACARADIOLOGICA3X4 = '';
            PLACAPERIAPICALPEDIATRICA = '';
            totalPLACARADIOLOGICA20X25 = totalPLACARADIOLOGICA20X25 + parseInt(this.listaAtenciones[i].vdatos_data[j].cantidad);
          }
          if (this.listaAtenciones[i].vdatos_data[j].tamanio == 'PLACA RADIOLOGICA 24 X 30 cm') {
            this.PLACARADIOLOGICA18X24 = false;
            this.PLACARADIOLOGICA20X25 = false;
            this.PLACARADIOLOGICA24X30 = true;
            this.PLACARADIOLOGICA25X30 = false;
            this.PLACARADIOLOGICA30X40 = false;
            this.PLACARADIOLOGICA35X35 = false;
            this.PLACARADIOLOGICA35X43 = false;
            this.PLACARADIOLOGICA3X4 = false;
            this.PLACAPERIAPICALPEDIATRICA = false;
            PLACARADIOLOGICA18X24 = '';
            PLACARADIOLOGICA20X25 = '';
            PLACARADIOLOGICA24X30 = this.listaAtenciones[i].vdatos_data[j].cantidad;
            PLACARADIOLOGICA25X30 = '';
            PLACARADIOLOGICA30X40 = '';
            PLACARADIOLOGICA35X35 = '';
            PLACARADIOLOGICA35X43 = '';
            PLACARADIOLOGICA3X4 = '';
            PLACAPERIAPICALPEDIATRICA = '';
            totalPLACARADIOLOGICA24X30 = totalPLACARADIOLOGICA24X30 + parseInt(this.listaAtenciones[i].vdatos_data[j].cantidad);
          }
          if (this.listaAtenciones[i].vdatos_data[j].tamanio == 'PLACA RADIOLOGICA 25 X 30 cm') {
            this.PLACARADIOLOGICA18X24 = false;
            this.PLACARADIOLOGICA20X25 = false;
            this.PLACARADIOLOGICA24X30 = false;
            this.PLACARADIOLOGICA25X30 = true;
            this.PLACARADIOLOGICA30X40 = false;
            this.PLACARADIOLOGICA35X35 = false;
            this.PLACARADIOLOGICA35X43 = false;
            this.PLACARADIOLOGICA3X4 = false;
            this.PLACAPERIAPICALPEDIATRICA = false;
            PLACARADIOLOGICA18X24 = '';
            PLACARADIOLOGICA20X25 = '';
            PLACARADIOLOGICA24X30 = '';
            PLACARADIOLOGICA25X30 = this.listaAtenciones[i].vdatos_data[j].cantidad;
            PLACARADIOLOGICA30X40 = '';
            PLACARADIOLOGICA35X35 = '';
            PLACARADIOLOGICA35X43 = '';
            PLACARADIOLOGICA3X4 = '';
            PLACAPERIAPICALPEDIATRICA = '';
            totalPLACARADIOLOGICA25X30 = totalPLACARADIOLOGICA25X30 + parseInt(this.listaAtenciones[i].vdatos_data[j].cantidad);
          }
          if (this.listaAtenciones[i].vdatos_data[j].tamanio == 'PLACA RADIOLOGICA 30 X 40 cm') {
            this.PLACARADIOLOGICA18X24 = false;
            this.PLACARADIOLOGICA20X25 = false;
            this.PLACARADIOLOGICA24X30 = false;
            this.PLACARADIOLOGICA25X30 = false;
            this.PLACARADIOLOGICA30X40 = true;
            this.PLACARADIOLOGICA35X35 = false;
            this.PLACARADIOLOGICA35X43 = false;
            this.PLACARADIOLOGICA3X4 = false;
            this.PLACAPERIAPICALPEDIATRICA = false;
            PLACARADIOLOGICA18X24 = '';
            PLACARADIOLOGICA20X25 = '';
            PLACARADIOLOGICA24X30 = '';
            PLACARADIOLOGICA25X30 = '';
            PLACARADIOLOGICA30X40 = this.listaAtenciones[i].vdatos_data[j].cantidad;
            PLACARADIOLOGICA35X35 = '';
            PLACARADIOLOGICA35X43 = '';
            PLACARADIOLOGICA3X4 = '';
            PLACAPERIAPICALPEDIATRICA = '';
            totalPLACARADIOLOGICA30X40 = totalPLACARADIOLOGICA30X40 + parseInt(this.listaAtenciones[i].vdatos_data[j].cantidad);
          }
          if (this.listaAtenciones[i].vdatos_data[j].tamanio == 'PLACA RADIOLOGICA 35 X 35 cm') {
            this.PLACARADIOLOGICA18X24 = false;
            this.PLACARADIOLOGICA20X25 = false;
            this.PLACARADIOLOGICA24X30 = false;
            this.PLACARADIOLOGICA25X30 = false;
            this.PLACARADIOLOGICA30X40 = false;
            this.PLACARADIOLOGICA35X35 = true;
            this.PLACARADIOLOGICA35X43 = false;
            this.PLACARADIOLOGICA3X4 = false;
            this.PLACAPERIAPICALPEDIATRICA = false;
            PLACARADIOLOGICA18X24 = '';
            PLACARADIOLOGICA20X25 = '';
            PLACARADIOLOGICA24X30 = '';
            PLACARADIOLOGICA25X30 = '';
            PLACARADIOLOGICA30X40 = '';
            PLACARADIOLOGICA35X35 = this.listaAtenciones[i].vdatos_data[j].cantidad;
            PLACARADIOLOGICA35X43 = '';
            PLACARADIOLOGICA3X4 = '';
            PLACAPERIAPICALPEDIATRICA = '';
            totalPLACARADIOLOGICA35X35 = totalPLACARADIOLOGICA35X35 + parseInt(this.listaAtenciones[i].vdatos_data[j].cantidad);
          }
          if (this.listaAtenciones[i].vdatos_data[j].tamanio == 'PLACA RADIOLOGICA 35 X 43 cm') {
            this.PLACARADIOLOGICA18X24 = false;
            this.PLACARADIOLOGICA20X25 = false;
            this.PLACARADIOLOGICA24X30 = false;
            this.PLACARADIOLOGICA25X30 = false;
            this.PLACARADIOLOGICA30X40 = false;
            this.PLACARADIOLOGICA35X35 = false;
            this.PLACARADIOLOGICA35X43 = true;
            this.PLACARADIOLOGICA3X4 = false;
            this.PLACAPERIAPICALPEDIATRICA = false;
            PLACARADIOLOGICA18X24 = '';
            PLACARADIOLOGICA20X25 = '';
            PLACARADIOLOGICA24X30 = '';
            PLACARADIOLOGICA25X30 = '';
            PLACARADIOLOGICA30X40 = '';
            PLACARADIOLOGICA35X35 = '';
            PLACARADIOLOGICA35X43 = this.listaAtenciones[i].vdatos_data[j].cantidad;
            PLACARADIOLOGICA3X4 = '';
            PLACAPERIAPICALPEDIATRICA = '';
            totalPLACARADIOLOGICA35X43 = totalPLACARADIOLOGICA35X43 + parseInt(this.listaAtenciones[i].vdatos_data[j].cantidad);
          }
          if (this.listaAtenciones[i].vdatos_data[j].tamanio == 'PLACA RADIOLOGICA 3 X 4 cm') {
            this.PLACARADIOLOGICA18X24 = false;
            this.PLACARADIOLOGICA20X25 = false;
            this.PLACARADIOLOGICA24X30 = false;
            this.PLACARADIOLOGICA25X30 = false;
            this.PLACARADIOLOGICA30X40 = false;
            this.PLACARADIOLOGICA35X35 = false;
            this.PLACARADIOLOGICA35X43 = false;
            this.PLACARADIOLOGICA3X4 = true;
            this.PLACAPERIAPICALPEDIATRICA = false;
            PLACARADIOLOGICA18X24 = '';
            PLACARADIOLOGICA20X25 = '';
            PLACARADIOLOGICA24X30 = '';
            PLACARADIOLOGICA25X30 = '';
            PLACARADIOLOGICA30X40 = '';
            PLACARADIOLOGICA35X35 = '';
            PLACARADIOLOGICA35X43 = '';
            PLACARADIOLOGICA3X4 = this.listaAtenciones[i].vdatos_data[j].cantidad;
            PLACAPERIAPICALPEDIATRICA = '';
            totalPLACARADIOLOGICA3X4 = totalPLACARADIOLOGICA3X4 + parseInt(this.listaAtenciones[i].vdatos_data[j].cantidad);
          }
          if (this.listaAtenciones[i].vdatos_data[j].tamanio == 'PLACA PERIAPICAL PEDIATRICA') {
            this.PLACARADIOLOGICA18X24 = false;
            this.PLACARADIOLOGICA20X25 = false;
            this.PLACARADIOLOGICA24X30 = false;
            this.PLACARADIOLOGICA25X30 = false;
            this.PLACARADIOLOGICA30X40 = false;
            this.PLACARADIOLOGICA35X35 = false;
            this.PLACARADIOLOGICA35X43 = false;
            this.PLACARADIOLOGICA3X4 = false;
            this.PLACAPERIAPICALPEDIATRICA = true;
            PLACARADIOLOGICA18X24 = '';
            PLACARADIOLOGICA20X25 = '';
            PLACARADIOLOGICA24X30 = '';
            PLACARADIOLOGICA25X30 = '';
            PLACARADIOLOGICA30X40 = '';
            PLACARADIOLOGICA35X35 = '';
            PLACARADIOLOGICA35X43 = '';
            PLACARADIOLOGICA3X4 = '';
            PLACAPERIAPICALPEDIATRICA = this.listaAtenciones[i].vdatos_data[j].cantidad;
            totalPLACAPERIAPICALPEDIATRICA = totalPLACAPERIAPICALPEDIATRICA + parseInt(this.listaAtenciones[i].vdatos_data[j].cantidad);
          }

          if (this.PLACARADIOLOGICA18X24) {
            total = PLACARADIOLOGICA18X24;
          }
          if (this.PLACARADIOLOGICA20X25) {
            total = PLACARADIOLOGICA20X25;
          }
          if (this.PLACARADIOLOGICA24X30) {
            total = PLACARADIOLOGICA24X30;
          }
          if (this.PLACARADIOLOGICA25X30) {
            total = PLACARADIOLOGICA25X30;
          }
          if (this.PLACARADIOLOGICA30X40) {
            total = PLACARADIOLOGICA30X40;
          }
          if (this.PLACARADIOLOGICA35X35) {
            total = PLACARADIOLOGICA35X35;
          }
          if (this.PLACARADIOLOGICA35X43) {
            total = PLACARADIOLOGICA35X43;
          }
          if (this.PLACARADIOLOGICA3X4) {
            total = PLACARADIOLOGICA3X4;
          }
          if (this.PLACAPERIAPICALPEDIATRICA) {
            total = PLACAPERIAPICALPEDIATRICA;
          }

          data_table = data_table + `

            <tr>
              <td>`+ this.listaAtenciones[i].vsc_sol_esp_descripcion + `</td>
              <td>`+ this.listaAtenciones[i].vsc_sol_descripcion_medico + `</td>
              <td>`+ JSON.parse(this.listaAtenciones[i].vdatos_data)[j].descripcion + `</td>
              <td align="center">`+ informeSI + `</td>
              <td align="center">`+ informeNO + `</td>
              <td>`+ PLACARADIOLOGICA18X24 + `</td>
              <td>`+ PLACARADIOLOGICA20X25 + `</td>
              <td>`+ PLACARADIOLOGICA24X30 + `</td>
              <td>`+ PLACARADIOLOGICA25X30 + `</td>
              <td>`+ PLACARADIOLOGICA30X40 + `</td>
              <td>`+ PLACARADIOLOGICA35X35 + `</td>
              <td>`+ PLACARADIOLOGICA35X43 + `</td>
              <td>`+ PLACARADIOLOGICA3X4 + `</td>
              <td>`+ PLACAPERIAPICALPEDIATRICA + `</td>
              <td>`+ total + `</td>
            </tr>
            `;
        }
      }

      data_table = data_table + `</tr>`;
    }

    var printContents = `
        <html>
            <head>
            </head>
            <body bgcolor="white" text="black" link="blue" vlink="purple" alink="red">
            <table align="center" border="0" width="100%">
              <tr>
                  <td width="15%" align="center">
                        <img style='float:left;' src='../../../assets/images/logoGamlp.png' width='70' height='50' alt='IMAGEN' border='0' align='left'>
                  </td>
                  <td width="80%" align="center">
                        <p align="center"><font face="Lucida Console"><span style="font-size:20pt;">INFORME 
                        DIARIO DEL SERVICIO DE RAYOS X</span></font></p>
                  </td>
                  <td width="15%" align="center">
                        <img style='float:left;' src='../../../assets/images/logohospitales.png' width='70' height='50' alt='IMAGEN' border='0' align='right'>
                  </td>

              </tr>
            </table>
            <div align="left">
              <table style="line-height:100%; margin-top:0; margin-bottom:0;" border="0" width="100%">
                  <tr>
                      <td width="1704">
                          <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="left"><font face="Lucida Console"><span style="font-size:12pt;">RADIOLOGO 
                          DE TURNO:`+ this.US_PATERNO + ` ` + this.US_MATERNO + ` ` + this.US_NOMBRE + `</span></font></p>
                      </td>
                  </tr>
                  <tr>
                      <td width="1704">
                          <p style="lin-height:100%; margin-top:0; margin-bottom:0;" align="left"><font face="Lucida Console"><span style="font-size:12pt;">HORARIO:`+ this.vtptrn_descripcion + `</span></font></p>
                      </td>
                  </tr>
                  <tr>
                      <td width="1704">
                          <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="left"><font face="Lucida Console"><span style="font-size:12pt;">FECHA:`+ this.fechaActualImp + `</span></font></p>
                      </td>
                  </tr>
              </table>
            </div>
            <table border="1" width="100%">
              <tr>
                  <td width="20" rowspan="2">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">N°</span></font></p>
                  </td>
                  <td width="60" rowspan="2">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">NUMERO 
                      DE EC</span></font></p>
                  </td>
                  <td width="80" rowspan="2">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">APELLIDO 
                      PATERNO</span></font></p>
                  </td>
                  <td width="80" rowspan="2">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">APELLIDO 
                      MATERNO</span></font></p>
                  </td>
                  <td width="70" rowspan="2">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">NOMBRES</span></font></p>
                  </td>
                  <td width="40" rowspan="2">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">EDAD</span></font></p>
                  </td>
                  <td width="106" colspan="3">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">TIPO 
                      DE PACIENTE</span></font></p>
                  </td>
                  <td width="68" colspan="2">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">SEXO</span></font></p>
                  </td>
                  <td width="142" colspan="4">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">SERVICIO 
                      DE ORIGEN</span></font></p>
                  </td>
                  <td width="150" rowspan="2">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">ESPECIALIDAD</span></font></p>
                  </td>
                  <td width="150" rowspan="2">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">MEDICO 
                      SOLICITANTE</span></font></p>
                  </td>
                  <td width="151" rowspan="2">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">ESTUDIO 
                      SOLICITADO</span></font></p>
                  </td>
                  <td width="140" colspan="2">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">INFORME 
                      COMPLEMENTARIO</span></font></p>
                  </td>
                  <td width="366" colspan="10">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">TAMAÑO 
                      DE PLACA RADIOGRAFICA</span></font></p>
                  </td>
              </tr>
              <tr>
                  <td width="31" valign="middle" align="center">
                      <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="center"><font face="Lucida Console"><span style="font-size:12pt;">LEY<br/>475<br/><br/> 
                      </span></font></p>
                  </td>
                  <td width="32" align="center" valign="middle">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">INST.</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">SOAT</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">F</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">M</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">EXT.</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">C.E.<br/></span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">HOS.<br/></span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">EMER.</span></font></p>
                  </td>
                  <td width="67" align="center">
                      <p><font face="Lucida Console" ><span style="font-size:12pt;">SI</span></font></p>
                  </td>
                  <td width="67" align="center">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">NO</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">1<br/>8<br/>x<br/>2<br/>4<br/>c<br/>m<br/></span></font></p>
                  </td>
                  <td width="32" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">2<br/>0<br/>x<br/>2<br/>5<br/>c<br/>m<br/></span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">2<br/>4<br/>x<br/>3<br/>0<br/>c<br/>m</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">2<br/>5<br/>x<br/>3<br/>0<br/>c<br/>m</span></font></p>
                  </td>
                  <td width="32" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">3<br/>0<br/>x<br/>4<br/>0<br/>c<br/>m</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">3<br/>5<br/>x<br/>3<br/>5<br/>c<br/>m</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">3<br/>5<br/>x<br/>4<br/>3<br/>c<br/>m</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">O<br/>D<br/>O<br/>N<br/></span></font></p>
                      <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="center"></p>
                      <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="center"><font face="Lucida Console"><span style="font-size:12pt;">3<br/>x<br/>4<br/>c<br/>m</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">P<br/>E<br/>R.<br/></span></font></p>
                      <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="center"></p>
                      <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="center"><font face="Lucida Console"><span style="font-size:12pt;">P<br/>E<br/>D.<br/></span></font></p>           
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">T<br/>O<br/>T<br/>A<br/>L</span></font></p>
                  </td>
              </tr>
              `+ data_table + `
              <tr>
                  <td width="20">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="60">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="80">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="80">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="70">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="40">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" valign="middle" align="center">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="32" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="150">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="150">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="151">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="67">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="67">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="32" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="32" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
              </tr>
              <tr>
                  <td width="20" style="border:0">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="60" style="border:0">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="80" style="border:0">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="80" style="border:0">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="116" colspan="2">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">TOTAL:</span></font></p>
                  </td>

                  <td width="31" valign="middle" align="center">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">`+ totalLey + `</span></font></p>
                  </td>
                  <td width="32" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">`+ totalInstitucional + `</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">`+ totalSoat + `</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">`+ totalFemenino + `</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">`+ totalMasculino + `</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">`+ totalExterno + `</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">`+ totalConsultaE + `</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">`+ totalHospitalizacion + `</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">`+ totalEmergencias + `</span></font></p>
                  </td>
                  <td width="150" style="border:0">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="306" >
                      <p><font face="Lucida Console"><span style="font-size:12pt;">TOTAL:</span></font></p>
                  </td>
                  <td width="306" align="center">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">`+ totalEstudios + `</span></font></p>
                  </td>
                  <td width="67" align="center">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">`+ informeSITOTAL + `</span></font></p>
                  </td>
                  <td width="67" align="center">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">`+ informeNOTOTAL + `</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">`+ totalPLACARADIOLOGICA18X24 + `</span></font></p>
                  </td>
                  <td width="32" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">`+ totalPLACARADIOLOGICA20X25 + `</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">`+ totalPLACARADIOLOGICA24X30 + `</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">`+ totalPLACARADIOLOGICA25X30 + `</span></font></p>
                  </td>
                  <td width="32" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">`+ totalPLACARADIOLOGICA30X40 + `</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">`+ totalPLACARADIOLOGICA35X35 + `</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">`+ totalPLACARADIOLOGICA35X43 + `</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">`+ totalPLACARADIOLOGICA3X4 + `</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">`+ totalPLACAPERIAPICALPEDIATRICA + `</span></font></p>
                  </td>
                  <td width="31" align="center" valign="5u3m middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">`+ totalPLACASVERTICAL + `</span></font></p>
                  </td>
              </tr>
            </table>
            <table border="0" width="100%">
              <tr>
                  <td width="70%">
                      <p align="right">&nbsp;</p>
                      <p align="right">&nbsp;</p>
                  </td>
                  <td width="30%">
                      <p align="center" style="line-height:100%; margin-top:0; margin-bottom:0;">&nbsp;</p>
                      <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="center">&nbsp;</p>
                      <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="center">&nbsp;</p>
                      <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="center">&nbsp;</p>
                      <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="center">&nbsp;</p>
                      <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="center"><font face="Lucida Console"><span style="font-size:12pt;">____________________________________</span></font></p>
                      <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="center"><font face="Lucida Console"><span style="font-size:12pt;">Firma 
                      y sello</span></font></p>
                  </td>
              </tr>
            </table>
            </body>

            </html>

    `;
    return printContents;
  };

}
