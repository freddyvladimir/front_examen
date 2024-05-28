import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';
import { HemodialisisService } from '../../hemodialisis.service';


export interface programaData {
  serial: string,
}

@Component({
  selector: 'app-dialog-medicamentos',
  templateUrl: './dialog-medicamentos.component.html',
  styleUrls: ['./dialog-medicamentos.component.scss']
})
export class DialogMedicamentosComponent implements OnInit {

  responde: any;
  ELEMENT_DATA: programaData[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  dataMedicamentos: any = [];
  datosPaciente: any = [];

  displayedColumns: string[] = ['serial', 'opciones', 'fecha'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  popupWin: any;
  idHoj: any;

  //dataSource: MatTableDataSource<programaData>;

  constructor(
    private hemodialisisService: HemodialisisService,
    public dialogRef: MatDialogRef < DialogMedicamentosComponent >,
    @Inject(MAT_DIALOG_DATA) public data: programaData
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
    console.log(this.data);
    this.listarMedicamentos(this.data);
  }

  listarMedicamentos(datoss : any) {
    console.log("ID", datoss);
    this.idHoj = datoss.idHoja;
    console.log(this.idHoj);
    this.dataMedicamentos = datoss.medicamentos;
    this.datosPaciente = datoss.datosPaciente;
    var params = {
      "num": this.idHoj
    }
    this.hemodialisisService.lstImpriMedicamento(params).subscribe(res => {
      this.responde = res.success.data;
      console.log("RES IMPRESION", this.responde);
      this.dataSource = new MatTableDataSource < any > (this.responde);
      console.log(this.dataSource);
    });
  }

  getImprimir(dato : any) {
    console.log("imprimir", dato);
    this.popupWin = window.open('', '_blank', '"outerWidth=600,width=500,innerWidth=400,resizable,scrollbars,status');
    this.popupWin.document.open();
    this.popupWin.document.write('<html><head></head><body onload="window.print()">' + this.generarReporteImpresion(dato) + '<br><br></html>');
    this.popupWin.document.close();
  }

  generarReporteImpresion(dato: any) {
    console.log(dato);
    var data_table = "";
    var aux1,aux2;
    console.log(this.dataMedicamentos);
    console.log(this.dataMedicamentos.length);
    for (var i = 0; i < this.dataMedicamentos.length; i ++) {
      console.log(i);
      /*for (var j = 0; j < dato.labdatos.length; j ++) {
        console.log(j);
        if (dato.labdatos[j].medi_pre_id == this.dataMedicamentos[i].preid) {
          console.log("VALIDOS", dato.labdatos[j].medi_pre_id);
          aux1 = dato.labdatos[i].medi_modo_empl+" || "+dato.labdatos[i].medi_dosis_recom;
          //aux2 = dato.labdatos[i].medi_cantidad;
          aux2 = "";
        }               
      }
      data_table += "<tr><td>"+this.dataMedicamentos[i].nom_generico+"</td><td>"+aux1+"</td><td>&nbsp;</td><td>"+aux2+"</td><td>&nbsp;</td><td>&nbsp;</td></tr>"; */
      console.log("AEAEA", dato.labdatos[i]);
      if (dato.labdatos[i] != "" && dato.labdatos[i] != null && dato.labdatos[i] != undefined) {
        aux1 = dato.labdatos[i].medi_modo_empl+" || "+dato.labdatos[i].medi_dosis_recom;
        aux2 = dato.labdatos[i].medi_cantidad;
      }else {
            aux1 = ""; aux2 = "";
      }
      data_table += "<tr><td>"+this.dataMedicamentos[i].nom_generico+"</td><td>"+aux1+"</td><td>&nbsp;</td><td>"+aux2+"</td><td>&nbsp;</td><td>&nbsp;</td></tr>";      
    }
    
    console.log(data_table);
    var nombre_completo = this.datosPaciente.nombres + " " +this.datosPaciente.paterno + " " +this.datosPaciente.materno;
    var arrayEdad = this.datosPaciente.hjedad.split(" ");
    console.log(arrayEdad);
    var edad = arrayEdad[0] + " " + arrayEdad[1];
    var printContents = `
      <html>
        <head>
          <title>Recibo recetario</title>
            <style type="text/css">
                .border1 {
                  width: 50%;
                  border: black 1px solid;
                }

                .border2 {
                    border-collapse: collapse;
                    border: 1px solid black;
                }

                .font1 {
                  font-size: 10px;
                }
                .font2 {
                  font-size: 8px;
                }

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
            </style>
        </head>
        <body>
          <div class="font1" width="50%">
          <table width="50%" class="font1">
            <tr>
                <td align="left">
                    <img style='float:left;' src='../../../assets/images/logoGamlp.png' width='50' height='40' alt='IMAGEN' border='0' align='left'>
                </td>
                <td align="center">
                    <div style="font-size: 12px"><b>RECIBO RECETARIO</b></div>
                    <div>ATENCION AMBULATORIA</div>
                </td>
                <td align="right">
                    &nbsp;
                </td>
            </tr>
          </table>

          <table width="50%" class="border2">
            <tr>
              <td width="70%">
                  <table width="100%" border="1" class="border2 font2">
                      <tr>
                          <td>SEDES: La Paz</td>
                          <td>RED: Nro 3 Norte Central</td>
                      </tr>
                      <tr>
                          <td colspan="2">Municipio: La Paz</td>
                      </tr>
                      <tr>
                          <td colspan="2">Establecimiento: Unidad de Terapia Renal `+ (this.datosPaciente.nomcentro || " ") +`</td>
                      </tr>
                      <tr>
                          <td colspan="2">Nombre del Paciente: `+ (nombre_completo || " ")+`</td>
                      </tr>
                  </table>
              </td>
              <td width="30%">
                  <table width="100%" border="1" class="border2 font2">
                      <tr>
                          <td colspan="2" align="left">Ley Nro 475:</td>
                      </tr>
                      <tr>
                          <td colspan="2" align="left">Programas:</td>
                      </tr>
                      <tr>
                          <td align="left">Edad: `+ (edad || " ") +`</td>
                          <td align="left">Venta:</td>
                      </tr>
                      <tr>
                          <td align="left">Sexo: `+ (this.datosPaciente.genero || " ") +`</td>
                          <td align="left">Fecha: `+ (this.datosPaciente.hjfecha || " ") +`</td>
                      </tr>
                  </table>
              </td>
            </tr>
          </table>

          <div class="border1">
            <b>Diagnosticos:</b>
            <table class="font2">
              <tr>
                  <td width="40%" align="right" align="center">HEMODIALISIS CON CATETER&nbsp;</td>
                  <td width="3%" class="font1"><table class = "font1"><tr><td class="border2">N</td><td class="border2">R</td></tr></table></td>
                  <td width="40%" align="right" align="center">DIABETES TIPO 1&nbsp;</td>
                  <td width="3%" class="font1"><table class = "font1"><tr><td class="border2">N</td><td class="border2">R</td></tr></table></td>
                  <!-- <td width="30%">&nbsp;</td>
                  <td width="3%">&nbsp;</td> -->
              </tr>
              <tr>
                  <td width="40%" align="right" align="center">HEMODIALISIS CON FISTULAARTERIOVENOSA&nbsp;</td>
                  <td width="3%" class="font1"><table class = "font1"><tr><td class="border2">N</td><td class="border2">R</td></tr></table></td>
                  <td width="40%" align="right" align="center">DIABETES TIPO 2&nbsp;</td>
                  <td width="3%" class="font1"><table class = "font1"><tr><td class="border2">N</td><td class="border2">R</td></tr></table></td>
                  <!-- <td width="30%">&nbsp;</td>
                  <td width="3%">&nbsp;</td> -->
              </tr>
              <tr>
                  <td width="40%" align="right" align="center">&nbsp;</td>
                  <td width="3%">&nbsp;</td>
                  <td width="40%" align="right" align="center">HIPERTENSION ARTERIAL&nbsp;</td>
                  <td width="3%" class="font1"><table class = "font1"><tr><td class="border2">N</td><td class="border2">R</td></tr></table></td>
                  <!-- <td width="30%">&nbsp;</td>
                  <td width="3%">&nbsp;</td> -->
              </tr>
              <tr>
                  <td colspan="4">
                      <div class='parent'>
                          <div class='child1'>Otro Diagnostico:</div>
                          <div class='child2'>&nbsp; <hr class="between" /></div>
                      </div>
                  </td>
                  <td width="3%" align="right"><table class = "font1"><tr><td class="border2">N</td><td class="border2">R</td></tr></table></td>
              </tr>
              <tr>
                  <td colspan="4">
                      <div class='parent'>
                          <div class='child1'>Otro Diagnostico:</div>
                          <div class='child2'>&nbsp; <hr class="between" /></div>
                      </div>
                  </td>
                  <td width="3%" align="right"><table class = "font1"><tr><td class="border2">N</td><td class="border2">R</td></tr></table></td>
              </tr>
            </table>
          </div>

          <table border="1" width="50%" class="border2 font2">
            <tr>
                <td width="40%" rowspan="2" align="center">Medicamentos e Insumos</td>
                <td rowspan="2" align="center">Indicaciones para el paciente</td>
                <td colspan="2" align="center">Cantidad</td>
                <td colspan="2" align="center">Valor</td>
            </tr>
            <tr>
                <td>Dispensada</td>
                <td>Recetada</td>
                <td>Unitario</td>
                <td>total</td>
            </tr>
            `+data_table+`
            <tr>
                <td colspan="4"></td>
                <td align="right">Costo Total</td>
                <td></td>
            </tr>
            <tr>
                <td colspan="4"></td>
                <td align="right">Costo Total al Usuario</td>
                <td>`+this.dataMedicamentos[0].med_costo+`</td>
            </tr>
          </table>

          <table width="50%" class="font2">
            <tr>
              <td width="25%" align="center">
                  <br><br><hr align="center" noshade="noshade" size="2" width="70%"/>
                  <div align="center">Recibido por</div>
                  <div align="center">Sello y Firma</div>
              </td>

              <td width="25%" align="center">
                  <br><br><hr align="center" noshade="noshade" size="2" width="70%"/>
                  <div align="center">Recibido por</div>
                  <div align="center">Sello y Firma</div>
              </td>

              <td width="25%" align="center" rowspan="2">
                  <div class="border1" align="center">&nbsp;<br>&nbsp;<br>&nbsp;<br>Sello Establecimiento<br>&nbsp;<br>&nbsp;<br>&nbsp;</div>
              </td>

              <td width="25%" align="center">
                  <br><br><hr align="center" noshade="noshade" size="2" width="70%"/>
                  <div align="center">Nombre del (la) Paciente</div>
                  <div align="center">Acompaniante</div>
                  <div class='parent'>
                      <div class='child1'>C.I.:</div>
                      <div class='child2'>&nbsp; <hr class="between" /></div>
                  </div>
              </td>
            </tr>

            <tr>
              <td colspan="2">
                  <div>El prescriptor y el dispensador certifican la veracidad de la informacion redactada en este documento medico legal.</div>
                  <div>El usuario certifica haber recibido los medicamentos señalados en este documento medico legal.</div>
              </td>
            </tr>
          </table>
        </div>
      </body>
    </html>
    `;
    return printContents;
  };

  getObservar(dato : any) {
    console.log("observar", dato);
  }

  eliminar(dato : any) {
    console.log("eliminar", dato);
    var params = {
      "_pmed_id": dato._pmed_id,
      "_hj_id": 0,
      "_med_id": 0,
      "_pmed_data": dato.labdatos,
      "opcion": "D"
    }
    console.log("FERCHO", params);
    this.hemodialisisService.guardarMedicamento(params).subscribe(res => {
      this.responde = res;
      console.log("RES", this.responde);
      console.log(this.idHoj);
      var params = {
        "num": this.idHoj
      }
      this.hemodialisisService.lstImpriMedicamento(params).subscribe(res => {
        this.responde = res.success.data;
        console.log("RES IMPRESION", this.responde);
        this.dataSource = new MatTableDataSource < any > (this.responde);
        console.log(this.dataSource);
      });
    });
  }

}
