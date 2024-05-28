import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ReportesGamlpService } from '../reportes-gamlp.service';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

interface ModelSelect {
  value: number;
  viewValue: string;
}

export interface programaData {
}

@Component({
  selector: 'app-page-servicio-emergencias',
  templateUrl: './page-servicio-emergencias.component.html',
  styleUrls: ['./page-servicio-emergencias.component.scss']
})

export class PageServicioEmergenciasComponent implements OnInit {

  searchFechaIni: string = "";
  searchFechaFin: string = "";

  dataSource: MatTableDataSource<programaData>;
  dataSourcePDF: any = [];

  displayedColumns: string[] = [
    'id',
    'mes',
    'dia',
    'siis',
    'paciente',
    'tipo_paciente',
    'diagnostico',
    'edad',
    'sexo',
    'referido',
    'referencia',
    'muerte',
    'horario_atencion',
    'triaje',
    'hospital'
  ];

  triajes: ModelSelect[] = [
    { value: 1, viewValue: 'ROJO' },
    { value: 2, viewValue: 'NARANJA' },
    { value: 3, viewValue: 'AMARILLO' },
    { value: 4, viewValue: 'VERDE' },
    { value: 5, viewValue: 'AZUL' },
    { value: 6, viewValue: 'LILA-PROCEDIMIENTOS' },
    { value: 99, viewValue: 'TODOS' }

  ];

  centros: ModelSelect[] = [
    { value: 1, viewValue: 'Hospital La Merced' },
    { value: 2, viewValue: 'Hospital Los Pinos' },
    { value: 3, viewValue: 'Hospital La Portada' },
    { value: 5, viewValue: 'Hospital Cotahuma' },
    { value: 0, viewValue: 'Todos' }
  ];

  selectedTriaje: any = -1;
  selectedCentro: any = -1;

  constructor(
    public reportesGamplService: ReportesGamlpService,
    private toastr: ToastrService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {

  }

  onSelectDateIni(type: string, event: MatDatepickerInputEvent<Date>) {
    const fechaCadena = JSON.stringify(event.value);
    this.searchFechaIni = fechaCadena.substring(1, 11);
    this.validateSearch();
  }
  onSelectDateFin(type: string, event: MatDatepickerInputEvent<Date>) {
    const fechaCadena = JSON.stringify(event.value);
    this.searchFechaFin = fechaCadena.substring(1, 11);
    this.validateSearch();
  }
  onTriajeChange() {
    this.validateSearch();
  }

  validateSearch() {
    if (this.searchFechaIni != "" && this.searchFechaFin != "" && this.selectedCentro >= 0 && this.selectedTriaje >= 0) {
      this.getLstReporteServicioEmergencias();
    }
    else {
      /*this.toastr.success('Los campos de  busqueda son obligatorios', '', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true,
        extendedTimeOut: 0,
        tapToDismiss: false
      });*/

    }
  }

  onCentroChange() {
    this.validateSearch();
  }

  getLstReporteServicioEmergencias() {

    var params = {
      "fechaini": this.searchFechaIni,
      "fechafin": this.searchFechaFin,
      "idhosp": this.selectedCentro,
      "idtriaje": this.selectedTriaje
    };

    this.reportesGamplService.getLstReporteServicioEmergencias(params).subscribe(res => {
      console.log("RES: ");
      console.log(res);
      this.dataSource = res.success.data;
      this.dataSourcePDF = res.success.data;
    });
  }

  createTableBody() {

    this.dataTable = [
      [
        {
          text: 'Nro',
          alignment: 'center',
        },
        {
          text: 'MES',
          alignment: 'center',
        },
        {
          text: 'DÍA',
          alignment: 'center',
        },
        {
          text: 'DIAGNÓSTICO',
          alignment: 'center',
        }
        , {
          text: 'EDAD',
          alignment: 'center',
        },
        {
          text: 'SEXO',
          alignment: 'center',
        },
        {
          text: 'REFERIDO DE QUE ESTABLECIMIENTO (NOMBRE DEL ESTABLECIMIENTO)',
          alignment: 'center',
        },
        {
          text: 'REFERENCIA A OTRO ESTABLECIMIENTO (NOMBRE DEL ESTABLECIMIENTO)',
          alignment: 'center',
        },
        {
          text: 'MUERTE(SI-NO)',
          alignment: 'center',
        },
        {
          text: 'HORARIO DE LA ATENCIÓN',
          alignment: 'center',
        }
      ],
    ];

    var newData = this.dataSourcePDF;
    for (var i = 0; i < newData.length; i++) {
      var row = [
        {
          text: "" + (i + 1),
          alignment: 'left',
        },
        {
          text: newData[i].vmes,
          alignment: 'left',
        },
        {
          text: newData[i].vdia,
          alignment: 'left'
        },
        {
          text: newData[i].vdiagnostico,
          alignment: 'left',
        },
        {
          text: newData[i].vedad,
          alignment: 'left',
        },
        {
          text: newData[i].vsexo,
          alignment: 'left',
        },
        {
          text: newData[i].vreferido_establecimiento,
          alignment: 'left',
        },
        {
          text: newData[i].vestablecimiento_referido,
          alignment: 'left',
        },
        {
          text: newData[i].vmuerte,
          alignment: 'left',
        },
        {
          text: newData[i].vhora_ingreso,
          alignment: 'left',
        }
      ]

      this.dataTable.push(row);
    }
  }
  dataTable: any;
  mesIniPDF: any = "ENERO";
  mesFinPDF: any = "FEBRERO";

  async print() {

    this.createTableBody();

    var url: string = "../../assets/images/logo_gamlp_2021.jpg";
    let docDefinition: any = {
      pageSize: 'LETTER',
      defaultStyle: {
        fontSize: 8
      },
      footer: function (currentPage: any, pageCount: any) { return currentPage.toString() + ' of ' + pageCount; },
      header: {
        margin: 10,
        columns: [
          {
            image: await this.getBase64(
              url
            ),
            width: 80
          },
          {
            text: '\nTRIAJE EN EL SERVICIO DE EMERGENCIAS\nPLANTILLA DE INFORMACION DE ' + this.mesIniPDF + ' A ' + this.mesFinPDF + ' ', bold: true, alignment: 'center'
          }
        ]
      },
      content: [
        {
          margin: [0, 50, 0, 0], text: ''
        },

        {
          style: 'tableExample',
          color: '#555',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            headerRows: 1,
            body: this.dataTable
          },
        }
      ],

    };
    pdfMake.createPdf(docDefinition).open();
  }

  getBase64(url: any) {
    return new Promise((resolve, reject) => {
      var image = new Image();
      image.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var ctx: any = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      image.onerror = error => {
        reject(error);
      };
      image.src = url;
    });
  }


}
