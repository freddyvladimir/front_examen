import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';
import { HemodialisisService } from '../../hemodialisis.service';


export interface laboratorioData {
  serial: string,
}

@Component({
  selector: 'app-dialog-laboratorios',
  templateUrl: './dialog-laboratorios.component.html',
  styleUrls: ['./dialog-laboratorios.component.scss']
})
export class DialogLaboratoriosComponent implements OnInit {

  responde: any;
  ELEMENT_DATA: laboratorioData[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  dataMedicamentos: any = [];
  datosPaciente: any = [];

  displayedColumns: string[] = ['serial', 'opciones', 'fecha', 'tiempo'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  popupWin: any;
  idHoj: any;
  meses: any = [];
  trimestres: any = [];
  semestres: any = [];
  anuales: any = [];
  laboratorio1: any = [];
  laboratorio2: any = [];
  laboratorio3: any = [];
  laboratorio4: any = [];

  
  constructor(
    private hemodialisisService: HemodialisisService,
    public dialogRef: MatDialogRef < DialogLaboratoriosComponent >,
    @Inject(MAT_DIALOG_DATA) public data: laboratorioData
  ) { 
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    console.log("INGRESO MODAL LABORATORIO");
    console.log(this.data);
    this.listarLaboratorios(this.data);
  }

  listarLaboratorios(datoss : any) {
    console.log("ID", datoss);
    this.idHoj = datoss.idHoja;
    console.log(this.idHoj);
    //this.dataMedicamentos = datoss.medicamentos;
    this.datosPaciente = datoss.datosPaciente;
    var params = {
      "num": this.idHoj
    }
    this.hemodialisisService.lstImpriLaboratorio(params).subscribe(res => {
      this.responde = res.success.data;
      console.log("RES IMPRESION", this.responde);
      this.dataSource = new MatTableDataSource < any > (this.responde);
      console.log(this.dataSource);
    });
  }

  getImprimirLab(dato : any) {
    console.log("imprimir", dato);    
    this.popupWin = window.open('', '_blank', '"outerWidth=600,width=500,innerWidth=400,resizable,scrollbars,status');
    this.popupWin.document.open();
    this.popupWin.document.write('<html><head></head><body onload="window.print()">' + this.generarReporteImpresion(dato) + '<br><br></html>');
    this.popupWin.document.close();
  }

  
  generarReporteImpresion(dato: any) {
    console.log("imprimir DATOS", dato);  
    // a
    this.laboratorio1 = [
        { cod: 1, labo: "Globulos Rojos" },
        { cod: 2, labo: "Globulos Blancos" },
        { cod: 3, labo: "Ematocrito" },
        { cod: 4, labo: "Hemoglobina" },
        { cod: 5, labo: "Plaquetas" },
        { cod: 6, labo: "Glicemia" },
        { cod: 7, labo: "Creatinina" },
        { cod: 8, labo: "NUS" },
        { cod: 9, labo: "Sodio" },
        { cod: 10, labo: "Calcio" },
        { cod: 11, labo: "Fosforo" },
        { cod: 12, labo: "Potasio" },
        { cod: 13, labo: "Sericos" },
        { cod: 14, labo: "TGO" },
        { cod: 15, labo: "TGP" },
        { cod: 16, labo: "Acido Urico" },
        { cod: 17, labo: "Proteinas Totales" },
        { cod: 18, labo: "Cloro" },
        { cod: 42, labo: "Hemograma Completo" }
    ];
  
    // b
    this.laboratorio2 = [
        { cod: 19, labo: "Colesterol" },
        { cod: 20, labo: "Trigliceridos" },
        { cod: 21, labo: "HDL" },
        { cod: 22, labo: "LDL" },
        { cod: 23, labo: "VLDL" },
        { cod: 24, labo: "Albumina" },
        { cod: 25, labo: "Ferritina" },
        { cod: 26, labo: "% De Saturación De Transferencia" },
        { cod: 29, labo: "Anti HVC" },
        { cod: 30, labo: "Hierro Serico" },
        { cod: 31, labo: "Urea" },
        { cod: 32, labo: "Fosfatasa Alcalina" },
        { cod: 35, labo: "Antigenos de Superficie VHB" },
        { cod: 36, labo: "Antigenos Core VHB" },
        { cod: 37, labo: "VIH" }
    ];
  
    // c
    this.laboratorio3 = [ { cod: 38, labo: "PTH" } ];
  
    // d
    this.laboratorio4 = [
        { cod: 39, labo: "Rx" },
        { cod: 40, labo: "Ecografia" },
        { cod: 41, labo: "Valoración" }
    ];

    var data_table = "";
    var aux1 = [];
    var labo1234 = [];
    var periodo = "";
    console.log(dato.labdatos[0].lab_periodo.split(" "));
    periodo = dato.labdatos[0].lab_periodo.split(" ");
    console.log(dato.labdatos[0].lab_laboratorios);
    console.log(JSON.parse(JSON.stringify(dato.labdatos[0].lab_laboratorios)));
    
    if (periodo[0] == 'mensual') {
        aux1 = dato.labdatos[0].lab_laboratorios;
        labo1234 = this.laboratorio1;
    } else if (periodo[0] == 'trimestre') {
        aux1 = dato.labdatos[0].lab_laboratorios;
        labo1234 = this.laboratorio2;
    } else if (periodo[0] == 'semestre') {
        aux1 = dato.labdatos[0].lab_laboratorios;
        labo1234 = this.laboratorio3;
    } else if (periodo[0] == 'anual') {
        aux1 = dato.labdatos[0].lab_laboratorios;
        labo1234 = this.laboratorio4;
    }

    
    for (var i = 0; i < Math.trunc(labo1234.length / 2); i ++) {
        var var1 =  "", var2 = "", cont = 0;
        for (var j = 0; j < aux1.length; j ++) {
            if (labo1234[i*2].cod == aux1[j].plabid && cont < 1) {
                var1 = "X";
                aux1.splice (j,1);
                cont ++;
            }

            if (j < aux1.length) {
                if (labo1234[(i*2)+1].cod == aux1[j].plabid && cont < 2) {
                    var2 = "X";
                    aux1.splice (j,1);
                    cont ++;
                }
            }
        }

        data_table += `
                <tr>
                    <td style="border: solid 1px;" align="center">`+var1+`</td>
                    <td colspan="3">`+labo1234[2*i].labo+`</td>
                    <td style="border: solid 1px;" align="center">`+var2+`</td>
                    <td colspan="3">`+labo1234[(2*i)+1].labo+`</td>
                </tr>
        `;
    }

    if (labo1234.length % 2 != 0) {
        var1 = "";
        for (var j = 0; j < aux1.length; j ++) {
            if (labo1234[labo1234.length-1].cod == aux1[j].plabid) {
                var1 = "X";
                aux1.splice (j,1);
                break;
            }
        }
        data_table += `
                <tr>
                    <td style="border: solid 1px;" align="center">`+var1+`</td>
                    <td colspan="3">`+labo1234[labo1234.length-1].labo+`</td>
                    <td></td>
                    <td colspan="3"></td>
                </tr>
        `;
    }

    var estilo_prioridad = "";
    console.log(dato.labdatos[0].lab_soltransf);
    if (dato.labdatos[0].lab_soltransf == "urgente") {
        estilo_prioridad = `
            body {
              font-size: 16px;
            }
            body:after {
              content: "URGENTE"; 
              font-size: 10em;  
              /*color: rgba(52, 166, 214, 0.4);*/
              color: rgba(52, 166, 214, 0.4);
              z-index: 9999;
            
              display: flex;
              align-items: center;
              justify-content: center;
              position: fixed;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
                
              -webkit-pointer-events: none;
              -moz-pointer-events: none;
              -ms-pointer-events: none;
              -o-pointer-events: none;
              pointer-events: none;

              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              -o-user-select: none;
              user-select: none;
            }
        `;
    }
    console.log(this.datosPaciente);    

    var nombre_completo = this.datosPaciente.nombres + " " +this.datosPaciente.paterno + " " +this.datosPaciente.materno;
    var arrayEdad = this.datosPaciente.hjedad.split(" ");
    console.log(arrayEdad);
    var edad = arrayEdad[0] + " " + arrayEdad[1];

    var  printContents = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Laboratorios</title>
        <style type="text/css">
            .border1 {
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
              font-size: 8px;
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
                width:49%;
                padding: 2px
            }

            #right2 {
                float:right;
                width:29%;
                padding: 2px
            }

            .complete {
                display: inline-block;
                width:99%;
                padding: 2px;
            }
        /*out 1 todo123*/
            .between {
                /*border: 3px dotted #0099CC;*/
                margin-top: 0px;
                margin-bottom: 0px;
                margin-left:10px;
                margin-right:10px;
            }
            .parent
            { 
                display:-moz-box; /* Firefox */
                display:-webkit-box; /* Safari and Chrome */
                display:-ms-flexbox; /* Internet Explorer 10 */
                display:box;
                width:100%;
            }
            .child2
            {
                -moz-box-flex:5.0; /* Firefox */
                -webkit-box-flex:5.0; /* Safari and Chrome */
                -ms-flex:9.0; /* Internet Explorer 10 */
                box-flex:9.0;
            }

            `+estilo_prioridad+`
        </style>
    </head>
    <body>
        <div class="font1">
        <div id="container">
            <div id="left">
                <table width="100%" class="font2">
                    <tr>
                        <td width="15%" align="center">
                            <img style='float:left;' src='../../../assets/images/logoGamlp.png' width='50' height='40' alt='IMAGEN' border='0' align='left'>
                        </td>
                        <td width="45%" align="center">
                            SOLICITUD DE EXAMENES DE LABORATORIO IMAGENEOLOGIA / GABINETE Y <br>
                            SERVICIO DE SANGRE SEGURA
                        </td>
                        <td width="15%" align="center"></td>
                        <td width="25%" align="center">
                            UNIDAD DE TERAPIA RENAL <br> `+ (this.datosPaciente.nomcentro || " ") +`
                        </td>
                    </tr>
                </table>

                <div>
                    <table width="100%" class="font2">
                        <tr>
                            <td align="left" class="border2" width="50%">RED: Nro 3 Norte Central</td>
                            <td align="left" class="border2" width="50%">MUNICIPIO: La Paz</td>
                        </tr>
                        <tr>
                            <td colspan="2" class="border2" align="left">Establecimiento: `+ (this.datosPaciente.nomcentro || " ") +`</td>
                        </tr>
                        <tr>
                            <td width="50%" align="left" class="border2">Fecha de Solicitud: `+ (this.datosPaciente.hjfecha || " ") +`</td>
                            <td width="50%" align="left" class="border2">Nro de Registro</td>
                        </tr>
                        <tr>
                            <td align="left" class="border2">Nombres: `+ (nombre_completo || " ")+`</td>
                            <td>
                                <table width="100%" class="font2">
                                    <tr>
                                        <td width="50%" align="left" class="border2">Edad: `+ (edad || " ")+`</td>
                                        <td width="50%" align="left" class="border2">Sexo: `+ (this.datosPaciente.genero || " ") +`</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                          <td colspan="2" class="border2" align="left">Diagnosticos Clinicos:</td> 
                        </tr>
                    </table>

                </div>

                <div class="complete">
                    <div class="container border1">
                        <div align="left"><b>LABORATORIO - SIRVASE REALIZAR</b></div>
                        <table width="100%" class="font1">
                          `+data_table+`
                        </table>
                        <table width="100%" class="font2">
                            <tr>
                                <td colspan="5">IMAGENEOLOGIA - SIRVASE REALIZAR:</td>
                                <td colspan="5">OTROS ESTUDIOS DE LABORATORIO O GABINETE</td>
                            </tr>

                            <tr align="left">
                                <td colspan="1" width="10%">Ecografia</td>
                                <td colspan="4" width="40%" style="border: solid 1px"></td>
                                <td colspan="5" style="border: solid 1px">1</td>
                            </tr>

                            <tr align="left">
                                <td colspan="1" width="10%">Rayos X</td>
                                <td colspan="4" width="40%" style="border: solid 1px"></td>
                                <td colspan="5" style="border: solid 1px">2</td>
                            </tr>

                            <tr align="left">
                                <td colspan= width="10%">TAC</td>
                                <td colspan="4" widt4="30%" style="border: solid 1px"></td>
                                <td colspan="5" style="border: solid 1px">3</td>
                            </tr>

                            <tr align="left">
                                <td colspan="1" width="10%">Endoscopia</td>
                                <td colspan="4" width="40%" style="border: solid 1px"></td>
                                <td colspan="5" style="border: solid 1px">4</td>
                            </tr>
                        </table>

                        <hr align="center" noshade="noshade" size="2" width="100%"/>

                        <table width="100%" class="font1">
                            <tr>
                                <td colspan="5" align="left"><b>SERVICIO DE TRANSFUSION</b></td>
                            </tr>
                            <tr><td colspan="5" align="left">Solicitud de la transfucion</td></tr>
                            <tr>
                                <td>UNIDAD / SERVICIO</td>
                                <td>URGENTE</td>
                                <td style="border: solid 1px;" align="left">&nbsp;&nbsp;</td>
                                <td>PROGRAMADA</td>
                                <td style="border: solid 1px;" align="left">&nbsp;&nbsp;</td>
                            </tr>
                        </table>

                        <hr align="center" noshade="noshade" size="2" width="100%"/>

                        <div align="left"><b>SERVICIO DE BANCO DE SANGRE - SIRVASE OTORGAR:</b></div>

                        <hr align="center" noshade="noshade" size="2" width="100%"/>

                        <table width="85%" align="center" class="font1">
                            <tr align="right">
                                <td width="30%" align="right"></td>
                                <td width="5%" align="left" style="border: solid 1px;">No</td>
                                <td width="40%" align="right"></td>
                                <td width="5%" align="left" style="border: solid 1px;">No</td>
                            </tr>

                            <tr align="right">
                                <td width="30%" align="right">Sangre Total</td>
                                <td width="5%" align="left" style="border: solid 1px;"></td>
                                <td width="40%" align="right">Crioprecipitados</td>
                                <td width="5%" align="left" style="border: solid 1px;"></td>
                            </tr>

                            <tr align="right">
                                <td width="30%" align="right">Paquete Globular</td>
                                <td width="5%" align="left" style="border: solid 1px;"></td>
                                <td width="40%" align="right">Anticuerpos Irregulares</td>
                                <td width="5%" align="left" style="border: solid 1px;"></td>
                            </tr>

                            <tr align="right">
                                <td width="30%" align="right">Plasma Fresco Congelado</td>
                                <td width="5%" align="left" style="border: solid 1px;"></td>
                                <td width="40%" align="right">Plasma Normal</td>
                                <td width="5%" align="left" style="border: solid 1px;"></td>
                            </tr>

                            <tr align="right">
                                <td width="30%" align="right">Concentrado de Plaquetas</td>
                                <td width="5%" align="left" style="border: solid 1px;"></td>
                                <td width="40%" align="right">Globulos Rojos Labados</td>
                                <td width="5%" align="left" style="border: solid 1px;"></td>
                            </tr>
                        </table>
                    </div>
                </div>

                <br><br><br>

                <table width="100%" class="font1">
                    <tr align="center">
                        <td><hr align="center" noshade="noshade" size="2" width="50%"/></td>
                        <td><hr align="center" noshade="noshade" size="2" width="50%"/></td>
                    </tr>

                    <tr align="center">
                        <td>Sello y Firma Medico</td>
                        <td>Establecimiento</td>
                    </tr>
                </table>
            </div>

            <div id="right">

                <table width="100%" class="font2">
                    <tr>
                        <td width="15%" align="center">
                            <img style='float:left;' src='../../../assets/images/logoGamlp.png' width='50' height='40' alt='IMAGEN' border='0' align='left'>
                        </td>
                        <td width="45%" align="center">
                            SOLICITUD DE EXAMENES DE LABORATORIO IMAGENEOLOGIA / GABINETE Y <br>
                            SERVICIO DE SANGRE SEGURA
                        </td>
                        <td width="15%" align="center">IMAGEN</td>
                        <td width="25%" align="center">
                            UNIDAD DE TERAPIA RENAL <br> `+ (this.datosPaciente.nomcentro || " ") +`
                        </td>
                    </tr>
                </table>

                <div>
                    <table width="100%" class="font2">
                        <tr>
                            <td width="50%" class="border2" align="left">RED: Nro 3 Norte Central</td>
                            <td width="50%" class="border2" align="left">MUNICIPIO: La Paz</td>
                        </tr>
                        <tr>
                            <td colspan="2" class="border2" align="left">Establecimiento: `+ (this.datosPaciente.nomcentro || " ") +`</td>
                        </tr>

                        <tr>
                            <td width="50%" class="border2" align="left">Fecha de Solicitud: `+ (this.datosPaciente.hjfecha || " ") +`</td>
                            <td width="50%" class="border2" align="left">Nro de Registro</td>
                        </tr>

                        <tr>
                            <td width="50%" class="border2" align="left">Nombres: `+ (nombre_completo || " ")+`</td>
                            <td width="50%">
                                <table width="100%" class="font2">
                                    <tr>
                                        <td width="50%" class="border2" align="left">Edad: `+ (edad || " ")+`</td>
                                        <td width="50%" class="border2" align="left">Sexo: `+ (this.datosPaciente.genero || " ") +`</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td colspan="2" class="border2" align="left">Diagnosticos Clinicos:</td>
                        </tr>
                    </table>

                </div>

                <div class="complete">
                    <div class="container border1">
                        <div align="left" class="font2"><b>LABORATORIO - SIRVASE REALIZAR</b></div>

                        <table width="100%" style="padding: 10px" class="font2">
                            <tr align="left">
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Cantidad:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Proteinas:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Hematies:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>

                            </tr>

                            <tr align="left">
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Color:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Glucosa:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Leucositos:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>

                            </tr>

                            <tr align="left">
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Olor:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Acetona:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Piocitos:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>

                            </tr>

                            <tr align="left">
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Aspecto:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Sangre:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Cel Epiteliales:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>

                            </tr>

                            <tr align="left">
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Sedimento:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Pig. Biliares:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Cel. Renales:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>

                            </tr>

                            <tr align="left">
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Espuma:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Nitritos:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Bacterias:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>

                            </tr>

                            <tr align="left">
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Densidad:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Bilrubinas:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Cilindros:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>

                            </tr>

                            <tr align="left">
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Reaccion pH:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Urubilirogeno:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>Otros:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>

                            </tr>
                        </table>

                        <div class="font2"><b>COPROPARASITOLOGICO</b></div>

                        <table width="100%" class="font2">
                            <tr>
                                <th>EXAMEN MICROSCOPICO</th>
                                <th>PRIMERA</th>
                                <th>SEGUNDA</th>
                                <th>TERCERA</th>
                            </tr>
                        </table>

                        <div class="font2">
                            <div class='parent'>
                                <div class='child1'>Aspecto</div>
                                <div class='child2'>&nbsp; <hr class="between" /></div>
                            </div>

                            <div class='parent'>
                                <div class='child1'>Consistencia</div>
                                <div class='child2'>&nbsp; <hr class="between" /></div>
                            </div>

                            <div class='parent'>
                                <div class='child1'>Color</div>
                                <div class='child2'>&nbsp; <hr class="between" /></div>
                            </div>

                            <div class='parent'>
                                <div class='child1'><b>EXAMEN MICROSCOPICO TECNICA DIRECTA</b></div>
                                <div class='child2'>&nbsp; <hr class="between" /></div>
                            </div>

                            <div class='parent'>
                                <div class='child2'>&nbsp; <hr class="between" /></div>
                            </div>

                            <div class='parent'>
                                <div class='child1'><b>EXAMEN MICROSCOPICO TECNICA DIRECTA</b></div>
                                <div class='child2'>&nbsp; <hr class="between" /></div>
                            </div>

                            <div class='parent'>
                                <div class='child2'>&nbsp; <hr class="between" /></div>
                            </div>  
                        </div>

                        

                        <div align="left"><b><font style="padding-left: 50px;">CITOLOGIA MOCO FECAL</font></b></div>

                        <table width="100%" align="center" class="font2">
                            <tr align="left">
                                <td width="50%">
                                    <div class='parent'>
                                        <div class='child1'>Consistencia de la muestra:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                                <td>
                                    <div class='parent'>
                                        <div class='child1'>NOTA:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                            </tr>

                            <tr align="left">
                                <td width="50%">
                                    <div class='parent'>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                                <td>
                                    <div class='parent'>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                            </tr>

                            <tr align="left">
                                <td width="50%">
                                    <div class='parent'>
                                        <div class='child1'>Amebas:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                        <div class='child1'>p/c</div>
                                    </div>
                                </td>
                                <td>
                                    <div class='parent'>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                            </tr>

                            <tr align="left">
                                <td width="50%">
                                    <div class='parent'>
                                        <div class='child1'>Hematies:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                        <div class='child1'>p/c</div>
                                    </div>
                                </td>
                                <td>
                                    <div class='parent'>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                            </tr>

                            <tr align="left">
                                <td width="50%">
                                    <div class='parent'>
                                        <div class='child1'>Leucocitos:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                        <div class='child1'>p/c</div>
                                    </div>
                                </td>
                                <td>
                                    <div class='parent'>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                            </tr>

                            <tr align="left">
                                <td width="50%">
                                    <div class='parent'>
                                        <div class='child1'>PMN:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                        <div class='child1'>% </div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                        <div class='child1'>MN </div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                        <div class='child1'>% </div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                                <td></td>
                            </tr>

                            <tr align="left">
                                <td width="50%">
                                    <div class='parent'>
                                        <div class='child1'>Flora Bacteriana:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                                <td></td>
                            </tr>

                            <tr align="left">
                                <td width="50%">
                                    <div class='parent'>
                                        <div class='child1'>Otros:</div>
                                        <div class='child2'>&nbsp; <hr class="between" /></div>
                                    </div>
                                </td>
                                <td></td>
                            </tr>
                        </table>
                    </div>
                    
                    <br><br>
                    <div>
                        <hr align="center" noshade="noshade" size="2" width="50%"/>
                        <div>Sello y Firma del Responsable</div>

                    </div>
                </div>
            </div>
        </div>
        </div>
      </body>
    </html>`;
    return printContents;
  }  

  getObservar(dato : any) {
    console.log("observar", dato);
  }

}
