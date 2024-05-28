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
  selector: 'app-page-reporte-ecografia',
  templateUrl: './page-reporte-ecografia.component.html',
  styleUrls: ['./page-reporte-ecografia.component.scss']
})
export class PageReporteEcografiaComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  IDUSUARIO = 1548;
  NOMBRE_HOSPITAL = 'hospital la merced'
  US_PATERNO = '';
  US_MATERNO = '';
  US_NOMBRE = '';
  fechaActualImp:any;

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
    console.log(dateRangeStart.value);
    console.log(dateRangeEnd.value);
    let sql = {
      idhospital: this.CODIGO_HOSPITAL,
      fecha_ini: dateRangeStart.value,
      idusuario: this.IDUSUARIO,
      fecha_fin: dateRangeEnd.value
    };
    this.http.lista_servicios_reporte_diario_ecografia(sql).subscribe(res => {
      this.responde = res as { message: string };
      console.log(this.responde);
      if (this.responde.success.data != null) {
        this.listaAtenciones = this.responde.success.data;
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
      console.log(this.responde);
      if (this.responde.success.data != null) {
      } else {
      }
    });

  }

  reimprimirAtencion(datos: any) {
    console.log(datos);
    //this.popupWin = window.open('', '_blank', '"outerWidth=600,width=500,innerWidth=400,resizable,scrollbars,status');
    this.popupWin = window.open('', '_blank', 'width=800,height=800');
    this.popupWin.document.open();
    this.popupWin.document.write('<html><head></head><body onload="window.print()">' + this.generarDocumentoLaboratorios(datos) + '<br><br></html>');
    this.popupWin.document.close();


  };
  
  generarDocumentoLaboratorios (datos:any) {
    var red;
    var cadenasHallazgos = "";
    var cadenasConclusiones = "";
    var solicitudesRa = JSON.parse(datos.vdatos_data);
    console.log(solicitudesRa);
    var cadenax = [];
    for (var i = 0; i < solicitudesRa.length; i++) {
      console.log(solicitudesRa[0].conclusion);
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
        console.log(cadenax[j]);
        cadenasHallazgos += `
                <p>`+ cadenax[j] + `</p>
            `;
      }
    }

    for (var i = 0; i < solicitudesRa.length; i++) {
      console.log(solicitudesRa[0].conclusion);
      var cadenay = solicitudesRa[0].conclusion.split("\n");
      cadenasConclusiones += `
                <p><b>`+ solicitudesRa[0].descripcion + ` : </b></p>
            `;
      for (var j = 0; j < cadenay.length; j++) {
        console.log(cadenay[j]);
        cadenasConclusiones += `
                <p>`+ cadenay[j] + `</p>
            `;
      }
      console.log(cadenax);
    }

    console.log(cadenasHallazgos);
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

  imprimirNuevaHoja () {
    console.log('Hoja Nueva');
    //this.popupWin = window.open('', '_blank', '"outerWidth=600,width=500,innerWidth=400,resizable,scrollbars,status');
    this.popupWin = window.open('', '_blank', 'width=800,height=800');
    this.popupWin.document.open();
    this.popupWin.document.write('<html><head></head><body onload="window.print()">' + this.generarRegistroResultadosNuevaHoja() + '<br><br></html>');
    this.popupWin.document.close();
  }

  generarRegistroResultadosNuevaHoja (){
    var data_table2 = "";
    this.listaAtenciones = {};
    var tamañoPrimero = this.listaAtenciones.length;
    var  printContents;
    if(0 <= 100){
        var calculo = 17 - tamañoPrimero;
        console.log(calculo);
        console.log(this.listaAtenciones.length);
        for (var j = 1; j < 17; j ++) {
          data_table2 = data_table2 + `
                  <tr height="50px">
                      <td style="border: solid 1px;" align="center">`+j+`</td>
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
                            DE TURNO: `+this.US_PATERNO+` `+this.US_MATERNO+` `+this.US_NOMBRE+`<br> FECHA:`+this.fechaActualImp+`</span></font></p>
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
                      `+ data_table2+ `
                    </table>
                    <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="left"></p>
                    </table>
                </body>
        </html>`;
    }
    else{
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
      fs.saveAs(blob, 'Reporte diario de ecografía.xlsx');
    });
  }

  private async _createTable(dataTable: any[]): Promise<void> {
    const sheet = this._workbook.addWorksheet('Reporte diario de ecografía');
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
    titleCell.value = 'Reporte diario de ecografía';
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
      ['A'+ (index+8), 'B'+ (index+8), 'C'+ (index+8), 'D'+ (index+8), 'E'+ (index+8), 'F'+ (index+8), 'G'+ (index+8), 'H'+ (index+8), 'I'+ (index+8), 'J'+ (index+8), 'K'+ (index+8)].forEach(element => {
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

}
