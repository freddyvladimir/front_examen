import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, Validators } from '@angular/forms';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { style } from '@angular/animations';

import { EmergenciasService } from '../emergencias.service';

export interface reporteData {
}

@Component({
  selector: 'app-page-reporte-medico',
  templateUrl: './page-reporte-medico.component.html',
  styleUrls: ['./page-reporte-medico.component.scss']
})
export class PageReporteMedicoComponent implements OnInit {

  /////////////////  VARIABLES  //////////////
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  ID_USUARIO = 1050;
  tipoBock = false;
  datos: any = [];
  datos_programacion: any = [];
  resp_reporte: any = [];
  horaini: any;
  horafin: any;
  tipoMedico1: any;
  tipoMedico2: any;

    //////////servicios/////////
    sql: any;
    responde: any;
    result: any;
    //////////servicios/////////

  /////////////////////////////////////////////

  displayedColumns: string[] = [
    'id',
    'sice',
    'asegurado',
    'paciente',
    'edad',
    'sexo',
    'tipo',
    'diagnostico'];
    
  dataSource: MatTableDataSource<reporteData>;  

  constructor(
    private fb: FormBuilder,
    private emergenciasService: EmergenciasService
  ) 
  { 
    this.dataSource = new MatTableDataSource();
   }

  ngOnInit(): void {
  }

  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  recargar() {
    this.dataSource = new MatTableDataSource(this.resp_reporte);
    this.ngAfterViewInit();
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
      console.log(error);
    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  seleccionar_fecha(event: MatDatepickerInputEvent<Date>) {
    console.log(event);
    const fechaCadena = JSON.stringify(event.value);
    const fecha = fechaCadena.substring(1, 11);
    console.log('fecha', fecha);
    this.datos.fechaSelec = fecha;
    //this.onChange();

    this.sql = {
      consulta: 'select * from sp_reporte_atencion_emergencias($$'+ this.datos.fechaSelec +'$$,'+ this.CODIGO_HOSPITAL +','+ this.ID_USUARIO+')'
    };
    this.emergenciasService.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        this.resp_reporte = this.responde.success.data[0].sp_dinamico;
        console.log('RESPUESTA DEL REPORTE', this.resp_reporte);
        this.dataSource = new MatTableDataSource(this.resp_reporte);
        this.ngAfterViewInit();
      } else {
        console.log('ERROR');
      }
    });
  }

  convHora(value: any){
    console.log(value);
  }

  imprimirReporte(datos: any){
    console.log('IMPRIMIR REPORTE', datos);
    this.horaini = datos.horaIngreso._d.getHours() + ':' + datos.horaIngreso._d.getMinutes();
    console.log('horaini',this.horaini);

    this.horafin = datos.horaSalida._d.getHours() + ':' + datos.horaSalida._d.getMinutes();
    console.log('horafin', this.horafin);

    if (datos.tipoMedico == 1) {
      this.tipoMedico1 = 'x';
    } else {
      this.tipoMedico2 = 'x';
    }

    const pdfDefinition: any = {
      // a string or { width: number, height: number }
      pageSize: 'A4',
    
      // by default we use portrait, you can change it to landscape if you wish
      pageOrientation: 'landscape',
    
      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      pageMargins: [ 40, 60, 40, 60 ],
      content: [
        {
          text: this.datos.fechaSelec,
          style: 'fecha'
        },
        {
          columns: [
            {
              image:"data:image/jpeg;base64,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",
              width: 120,
              height: 120,
            },
              
            [
              {
                text: '\n\n\n INFORME DIARIO DEL SERVICIO DE EMERGENCIA',
                style: 'header'
              }
            ],

            {
              text: '',
              width: 120,
              height: 120, 
            }
          ]
        },
        {
          //alignment: 'justify',
          columns: [
            {
              text: 'ESTABLECIMIENTO:', style: 'body', alignment: 'center'
            },
            {
              text: 'HOSPITAL MUNICIPAL COTAHUMA', style: 'text', alignment: 'left'
            },
            {
              text: 'FECHA:', style: 'body', alignment: 'center'
            },
            {
              text: this.datos.fechaSelec, style: 'text', alignment: 'left'
            }
          ]
        },
        '\n',
        {
          style: 'tableExample',
          //color: '#444',
          table: {
            widths: ['*', '*','*', '*','*','*'],
            //headerRows: 2,
            body: [
              [
                {border: [false, false, false, false], text: this.resp_reporte[0].vmedico, style: 'text', alignment: 'center', rowSpan: 2}, 
                {border: [false, false, false, false], text: this.resp_reporte[0].vmatricula, style: 'text', alignment: 'center', rowSpan: 2},
                {border: [false, false, false, false], text: 'FIRMA Y SELLO DEL', style: 'tableHeader', alignment: 'center', colSpan: 2}, 
                {text: '', style: 'text', alignment: 'center'}, 
                {border: [false, false, false, false], text: 'HORARIO DE ATENCION', style: 'tableHeader', alignment: 'center'}, 
                {border: [false, false, false, false], text: this.horaini +' A '+ this.horafin, style: 'text', alignment: 'center'}
              ],
              [
                {border: [false, false, false, false], text: ''}, 
                {border: [false, false, false, false], text: ''},
                {border: [false, false, false, false], text: 'MEDICO', style: 'tableHeader', alignment: 'center', colSpan: 2}, 
                {text: '', style: 'text', alignment: 'center'}, 
                {border: [false, false, false, false], text: 'TITULAR', style: 'tableHeader', alignment: 'center'}, 
                {text: this.tipoMedico1, style: 'text', alignment: 'center'}
              ],
              [
                {border: [false, false, false, false], text: 'NOMBRES Y APELLIDO DEL MEDICO', style: 'tableHeader', alignment: 'center'}, 
                {border: [false, false, false, false], text: 'Nro MATRICULA', style: 'tableHeader', alignment: 'center'},
                {border: [false, false, false, false], text: '', style: 'tableHeader', alignment: 'center', colSpan: 2}, 
                {text: '', style: 'text', alignment: 'center'}, 
                {border: [false, false, false, false], text: 'SUPLENTE', style: 'tableHeader', alignment: 'center'}, 
                {text: this.tipoMedico2, style: 'text', alignment: 'center'}
              ]
            ]
          }
        },
        '\n',
        {
          style: 'tableExample',
          table: {
            widths: [10,40,60,10,40,40,20,20,10,10,10,10,10,40,30,20,20,20,20,20,20,20,10,10,10,10],
            body: [
              [
                {text:'Nro', rowSpan: 2}, 
                {text:'Nro de Historia Clinica', rowSpan: 2}, 
                {text:'Apellido Paterno, Materno y Nombres', rowSpan: 2}, 
                {text:'TIPO DE PACIENTE', rowSpan: 2}, 
                {text:'Hora - Minutos\n(Ingreso)', rowSpan: 2}, 
                {text:'Hora - Minutos\n(Egreso)', rowSpan: 2}, 
                {text:'EDAD Y SEXO', colSpan: 2},{}, 
                {text:'EXAMENES COMPLEMENTARIOS', colSpan: 5},{},{},{},{}, 
                {text:'Diagnostico', rowSpan: 2}, 
                {text:'CIE-10', rowSpan: 2}, 
                {text:'Tratamiento', rowSpan: 2}, 
                {text:'Internacion', rowSpan: 2}, 
                {text:'Referencia\nde', rowSpan: 2}, 
                {text:'Referencia Justificada', rowSpan: 2}, 
                {text:'Referencia Adecuada', rowSpan: 2}, 
                {text:'Referencia Oportuna', rowSpan: 2}, 
                {text:'Contrareferencia', rowSpan: 2}, 
                {text:'Curaciones', colSpan: 3},{},{}, 
                {text:'Suturas', rowSpan: 2}
              ],
              [
                {text:''}, {text:''}, {text:''}, {text:''}, {text:''}, {text:''},
                {text:'M'},{text:'F'},
                {text:'Laboratorio'},{text:'Rayos X'},{text:'Ecografia'},{text:'Electrocardiograma'},{text:'Otros'}, 
                {text:''}, {text:''}, {text:''}, {text:''}, {text:''}, {text:''}, {text:''}, {text:''}, {text:''}, 
                {text:'Mayores'}, {text:'Medianos'}, {text:'Menores'},
                {text:''}
              ],
              [
                {text:''}, 
                {text:'1'}, 
                {text:'2'}, 
                {text:'3'}, 
                {text:'4'}, 
                {text:'5'},
                {text:'6'},
                {text:'7'},
                {text:'8'},
                {text:'9'},
                {text:'10'},
                {text:'12'},
                {text:'13'}, 
                {text:'14'}, 
                {text:'15'}, 
                {text:'16'}, 
                {text:'17'}, 
                {text:'18'}, 
                {text:'19'}, 
                {text:'20'}, 
                {text:'21'}, 
                {text:'22'}, 
                {text:'23'}, 
                {text:'24'}, 
                {text:'25'},
                {text:'26'}
              ],
              /*´for (let index = 0; index < this.resp_reporte.length; index++) {
                const element = this.resp_reporte[index];
                
              }´,*/
              [
                {text:'1'}, 
                {text: this.resp_reporte[0].vhcl_codigoseg, style: 'text'}, 
                {text: this.resp_reporte[0].vpaciente, style: 'text'}, 
                {text: this.resp_reporte[0].vemg_cnslt_externa[0].tipoSeguroSalud, style: 'text'}, 
                {text: this.resp_reporte[0].vemg_cnslt_externa[0].horaingreso, style: 'text'}, 
                {text: this.resp_reporte[0].vemg_cnslt_externa[0].horaegreso, style: 'text'},
                {text: '', style: 'text'},
                {text: this.resp_reporte[0].vemg_cnslt_externa[0].edad, style: 'text'},
                {text: '', style: 'text'},
                {text: '', style: 'text'},
                {text: '', style: 'text'},
                {text: '', style: 'text'},
                {text: '', style: 'text'}, 
                {text: this.resp_reporte[0].vemg_cnslt_externa[0].diagnosticoDescriptivo, style: 'text'}, 
                {text: this.resp_reporte[0].vemg_cnslt_externa[0].diagnosticoIngreso, style: 'text'}, 
                {text: this.resp_reporte[0].vemg_cnslt_externa[0].tratamiento, style: 'text'}, 
                {text: this.resp_reporte[0].vemg_cnslt_externa[0].serviciosHospi, style: 'text'}, 
                {text: this.resp_reporte[0].vemg_cnslt_externa[0].referido_alg, style: 'text'}, 
                {text: '', style: 'text'}, 
                {text: '', style: 'text'}, 
                {text: '', style: 'text'}, 
                {text: '', style: 'text'}, 
                {text: this.resp_reporte[0].vemg_cnslt_externa[0].curacionesMay, style: 'text'}, 
                {text: this.resp_reporte[0].vemg_cnslt_externa[0].curacionesMed, style: 'text'}, 
                {text: this.resp_reporte[0].vemg_cnslt_externa[0].curacionesMen, style: 'text'},
                {text: this.resp_reporte[0].vemg_cnslt_externa[0].suturas, style: 'text'}
              ]
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 12,
          alignment: 'center',
          bold: true
        },
        bigger: {
          fontSize: 15,
          italics: true
        },
        fecha: {
          fontSize: 7
        },
        body:{
          fontSize: 8,
          alignment: 'justify',
        },
        text:{
          fontSize: 7,
          color: '#444'
        },
        firma: {
          fontSize: 10,
          alignment: 'center',
          bold: true
        },
        tableExample: {
          fontSize: 7,
          alignment: 'center'
        }
      },
      defaultStyle: {
        columnGap: 20
      }
    };
 
    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();

  }

}
