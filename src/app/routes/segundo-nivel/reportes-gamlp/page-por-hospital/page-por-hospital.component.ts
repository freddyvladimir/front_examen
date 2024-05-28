import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ReportesGamlpService } from '../reportes-gamlp.service';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { DialogPorHospitalEspecialidadComponent } from './dialog-por-hospital-especialidad/dialog-por-hospital-especialidad.component';

import * as _ from 'lodash';

interface Reporte {
  value: string;
  viewValue: string;
}

export interface programaData {
}

@Component({
  selector: 'app-page-por-hospital',
  templateUrl: './page-por-hospital.component.html',
  styleUrls: ['./page-por-hospital.component.scss']
})
export class PagePorHospitalComponent implements OnInit {

  isVisibleHospitales: boolean = false;
  isVisibleEspecialidades: boolean = false;
  isVisibleReservas: boolean = false;
  isVisibleReservasPorMeses: boolean = false;
  isVisibleReservasPorMesesAlternativa: boolean = false;
  selectedTabIndex: any = 0;
  selectedTabIndexEspecialidades: any;
  selectedTabIndexReservas: any;
  selectedTabIndexReservasPorMeses: any;

  titleChart = "";
  subTitleChart = "";
  globalDataSource: any;
  displayedColumns: string[] = [
    'id',
    'hospital',
    'fichas_planificadas',
    'fichas_solicitadas',
    'fichas_atendidas',
    'porcentaje_atendidas',
    'porcentaje_solicitadas'
  ];

  displayedColumnsEspecialidades: string[] = [
    'id',
    'especialidad',
    'total_merced',
    'total_pinos',
    'total_portada',
    'total_cotahuma',
    'totales'
  ];

  displayedColumnsReservas: string[] = [
    'id',
    'hospital',
    'fichas_hospital',
    'fichas_internet'
  ];

  currentSignosVitales = {
    "vpeso": "100.0",
    "vestatura": "160",
    "vpulso": "45",
     "vtemperatura": "37.0/38.15/36.0/38.0",    
    "vpresion": "50/2",    
    "vfrecuencia": "0",
    "vmasa": "0.60",
    "venf_saturacion_o2": "78",
    "vtip_temp": "A/R/O/A",
    "vdesc_peso": "",
    "vdesc_estatura": "",
    "vdesc_pres_art": "Pcte.c/yeso",
    "vdesc_frec_res": "Pcte.c/yeso",
    "vdesc_temp": "Pcte.c/yeso",
    "vdesc_pulso": "Pcte.c/yeso",
    "vdesc_saturacion": "Pcte.c/yeso",
    "genero":"M", // M , MASCULINO, F , FEMENINO
    "context":"edit" //read, edit
  }

  reportes: Reporte[] = [
    { value: 'Hospitales', viewValue: 'Hospitales' },
    { value: 'Especialidades', viewValue: 'Especialidades' },
    { value: 'Reservas', viewValue: 'Reservas' },
    { value: 'Reservas por Meses', viewValue: 'Reservas por Meses' }
  ];

  filters: Reporte[] = [
    { value: 'Primer Nivel y Segundo Nivel', viewValue: 'Primer Nivel y Segundo Nivel' },
    { value: 'Primer Nivel', viewValue: 'Primer Nivel' },
    { value: 'Segundo Nivel', viewValue: 'Segundo Nivel' }
  ];

  selectedReporte: any;
  selectedReporteOld: any;

  selectedFilter: any = this.filters[0].value;;
  selectedFilterOld: any;

  searchFechaIni: string = "";
  searchFechaFin: string = "";
  searchFechaIniOld: string = "";
  searchFechaFinOld: string = "";

  dataSource: MatTableDataSource<programaData>;
  dataSourceEspecialidades: MatTableDataSource<programaData>;
  dataSourceReservas: MatTableDataSource<programaData>;
  dataSourceReservasPorMeses: MatTableDataSource<programaData>;

  constructor(
    private toast: ToastrService,
    private reportesGamlpService: ReportesGamlpService,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
    this.dataSourceEspecialidades = new MatTableDataSource();
    this.dataSourceReservas = new MatTableDataSource();
    this.dataSourceReservasPorMeses = new MatTableDataSource();
  }

  getDataOutput(data: any) {
    console.log(data);
  }

  ngOnInit(): void {

  }

  getData() {
    console.log(this.currentSignosVitales);
  }

  getPorHospital() {

    var params = {
      "fechainicio": this.searchFechaIni,
      "fechafin": this.searchFechaFin
    };

    var listIndexHospital = new Array();
    var listViewHospital = new Array();

    this.reportesGamlpService.getPorHospital(params).subscribe(res => {
      this.dataSource = res.success.data;
      var totalPlanificadas = 0;
      var totalSolicitadas = 0;
      var totalAtendidas = 0;
      for (var i = 0; i < res.success.data.length; i++) {
        listIndexHospital.push(res.success.data[i].idhosp);
        if (res.success.data[i].tipo == "P") {
          totalPlanificadas += parseInt(res.success.data[i].cntfichas);
        }
        if (res.success.data[i].tipo == "S") {
          totalSolicitadas += parseInt(res.success.data[i].cntfichas);
        }
        if (res.success.data[i].tipo == "A") {
          totalAtendidas += parseInt(res.success.data[i].cntfichas);
        }
      }
      listIndexHospital = _.uniq(listIndexHospital);

      for (var i = 0; i < listIndexHospital.length; i++) {

        var dataPlanificadas = _.find(res.success.data, { 'idhosp': listIndexHospital[i], 'tipo': 'P' });
        var dataSolicitadas = _.find(res.success.data, { 'idhosp': listIndexHospital[i], 'tipo': 'S' });
        var dataAtendidas = _.find(res.success.data, { 'idhosp': listIndexHospital[i], 'tipo': 'A' });
        let porcentajeAtendidas = parseFloat((parseInt(dataAtendidas.cntfichas) * 100 / dataPlanificadas.cntfichas).toFixed(3));
        console.log("----> " + porcentajeAtendidas);
        if (isNaN(porcentajeAtendidas)) {
          porcentajeAtendidas = 0;
        }
        let porcentajeSolicitadas = parseFloat((parseInt(dataSolicitadas.cntfichas) * 100 / dataPlanificadas.cntfichas).toFixed(3));
        if (isNaN(porcentajeSolicitadas)) {
          porcentajeSolicitadas = 0;
        }

        listViewHospital.push({
          "idhosp": dataPlanificadas.idhosp,
          "planificadas": dataPlanificadas.cntfichas,
          "atendidas": dataAtendidas.cntfichas,
          "solicitadas": dataSolicitadas.cntfichas,
          "porcentaje_atendidas": porcentajeAtendidas,
          "porcentaje_solicitadas": porcentajeSolicitadas,
          "hospital": dataPlanificadas.hspnombrehospital,
          "tipo": dataPlanificadas.tipo
        });
      }

      listViewHospital.push({
        "idhosp": 0,
        "planificadas": totalPlanificadas,
        "atendidas": totalAtendidas,
        "solicitadas": totalSolicitadas,
        "porcentaje_atendidas": (totalAtendidas * 100 / totalPlanificadas).toFixed(2),
        "porcentaje_solicitadas": (totalSolicitadas * 100 / totalPlanificadas).toFixed(2),
        "hospital": "TOTAL",
        "tipo": "T"
      });

      this.globalDataSource = listViewHospital;
      this.setChart(listViewHospital);

      this.searchFechaIniOld = this.searchFechaIni;
      this.searchFechaFinOld = this.searchFechaFin;
      this.selectedReporteOld = this.selectedReporte;
    });
  }
  filterHospital() {

    var listViewHospital = new Array();
    if (this.selectedFilter == "Primer Nivel") {
      for (var i = 0; i < this.globalDataSource.length - 1; i++) {
        if (this.globalDataSource[i].idhosp > 5) {
          listViewHospital.push(this.globalDataSource[i]);
        }
      }
    }
    else {
      if (this.selectedFilter == "Segundo Nivel") {
        for (var i = 0; i < this.globalDataSource.length - 1; i++) {
          if (this.globalDataSource[i].idhosp <= 5 && this.globalDataSource[i].idhosp > 0) {
            listViewHospital.push(this.globalDataSource[i]);
          }
        }
      }
      else {
        for (var i = 0; i < this.globalDataSource.length - 1; i++) {
          listViewHospital.push(this.globalDataSource[i]);
        }
      }
    }
    this.dataSource.data = listViewHospital;
    this.setChart(this.dataSource.data);
  }

  chart: any;

  setChart(listViewHospital: any) {
    if (this.chart != null) {
      this.chart.destroy();
    }
    var dataPlanificadas = new Array();
    var dataSolicitadas = new Array();
    var dataAtendidas = new Array();
    var dataHospitales = new Array();
    for (var i = 0; i < listViewHospital.length - 1; i++) {
      dataPlanificadas.push(listViewHospital[i].planificadas);
      dataSolicitadas.push(listViewHospital[i].solicitadas);
      dataAtendidas.push(listViewHospital[i].atendidas);
      dataHospitales.push(listViewHospital[i].hospital);
    }

    var options = {
      series: [{
        name: 'Planificadas',
        data: dataPlanificadas
      }, {
        name: 'Solicitadas',
        data: dataSolicitadas
      }, {
        name: 'Atendidas',
        data: dataAtendidas
      }],
      chart: {
        type: 'bar',
        height: 550,
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            console.log(chartContext, config);
          },
          dataPointMouseEnter: (event: any, chartContext: any, config: any) => {
            event.path[0].style.cursor = "pointer";
          },
          click: (event: any, chartContext: any, config: any) => {
            if (config.dataPointIndex != -1) {
              this.showDialogPorHospitalEspecialidad(listViewHospital[config.dataPointIndex]);
            }
          }
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: dataHospitales,
      },
      yaxis: {
        title: {
          text: ''
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return " " + val + " "
          }
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    };

    this.chart = new ApexCharts(document.querySelector("#chart-por-hospital"), options);
    this.chart.render();
  }


  getEspecialidades() {

    if (this.searchFechaIni != "" && this.searchFechaFin != "") {
      var params = {
        "fechainicio": this.searchFechaIni,
        "fechafin": this.searchFechaFin
      };

      this.reportesGamlpService.getEspecialidades(params).subscribe(res => {
        this.dataSourceEspecialidades = res.success.data;
        this.setChartEspecialidades(res.success.data);
        this.searchFechaIniOld = this.searchFechaIni;
        this.searchFechaFinOld = this.searchFechaFin;
        this.selectedReporteOld = this.selectedReporte;
      });
    }
  }

  chartEspecialidades: any;

  setChartEspecialidades(listViewEspecialidades: any) {
    // if (this.chart != null) {
    //   this.chart.destroy();
    // }

    var dataMerced = new Array();
    var dataPinos = new Array();
    var dataPortada = new Array();
    var dataCotahuma = new Array();
    var dataEspecialidades = new Array();
    for (var i = 0; i < listViewEspecialidades.length - 1; i++) {
      dataMerced.push(listViewEspecialidades[i].vmerced);
      dataPinos.push(listViewEspecialidades[i].vpinos);
      dataPortada.push(listViewEspecialidades[i].vportada);
      dataCotahuma.push(listViewEspecialidades[i].vcotahuma);
      dataEspecialidades.push(listViewEspecialidades[i].vespecilidad);
    }
 

    var options = {
      series: [{
        name: 'Hospital La Merced',
        data: dataMerced
      }, {
        name: 'Hospital Los Pinos',
        data: dataPinos
      }, {
        name: 'Hospital La Portada',
        data: dataPortada
      }, {
        name: 'Hospital Cotahuma',
        data: dataCotahuma
      }
      ],
      chart: {
        type: 'bar',
        height: 550
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: dataEspecialidades,
      },
      yaxis: {
        title: {
          text: ''
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return "" + val + ""
          }
        }
      }
    };

    this.chart = new ApexCharts(document.querySelector("#chart-especialidades"), options);
    this.chart.render();
  }

  getReservas() {

    if (this.searchFechaIni != "" && this.searchFechaFin != "") {
      var params = {
        "fechainicio": this.searchFechaIni,
        "fechafin": this.searchFechaFin
      };

      this.reportesGamlpService.getReservas(params).subscribe(res => {
        this.dataSourceReservas = res.success.data;
        this.setChartReservas(this.dataSourceReservas);
        this.searchFechaIniOld = this.searchFechaIni;
        this.searchFechaFinOld = this.searchFechaFin;
        this.selectedReporteOld = this.selectedReporte;
      });
    }

  }

  chartReservas: any;


  setChartReservas(listViewEspecialidades: any) {
    // if (this.chart != null) {
    //   this.chart.destroy();
    // }

    var dataHospital = new Array();
    var dataInternet = new Array();

    var dataEspecialidades = new Array();
    for (var i = 0; i < listViewEspecialidades.length; i++) {
      dataHospital.push(listViewEspecialidades[i].vfichas_hospital);
      dataInternet.push(listViewEspecialidades[i].vfichas_internet);
      dataEspecialidades.push(listViewEspecialidades[i].vnombre_hospital);
    }

    var options = {
      series: [{
        name: 'Reserva por Hospital',
        data: dataHospital
      }, {
        name: 'Reserva por Internet',
        data: dataInternet
      },
      ],
      chart: {
        type: 'bar',
        height: 550
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: dataEspecialidades,
      },
      yaxis: {
        title: {
          text: ''
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return " " + val + " "
          }
        }
      }
    };

    this.chart = new ApexCharts(document.querySelector("#chart-reservas"), options);
    this.chart.render();
  }


  getReservasPorMeses() {

    if (this.searchFechaIni != "" && this.searchFechaFin != "") {
      var params = {
        "fechainicio": this.searchFechaIni,
        "fechafin": this.searchFechaFin
      };


      this.reportesGamlpService.getReservasPorMeses(params).subscribe(res => {
        this.dataSourceReservasPorMeses = res.success.data;
        this.setChartReservasPorMeses(res.success.data);
        this.searchFechaIniOld = this.searchFechaIni;
        this.searchFechaFinOld = this.searchFechaFin;
        this.selectedReporteOld = this.selectedReporte;
      });
    }

  }

  getReservasPorMesesAlternativa() {

    if (this.searchFechaIni != "" && this.searchFechaFin != "") {
      var params = {
        "fechainicio": this.searchFechaIni,
        "fechafin": this.searchFechaFin
      };

      this.reportesGamlpService.getReservasPorMeses(params).subscribe(res => {
        this.dataSourceReservasPorMeses = res.success.data;
        this.setChartReservasPorMesesAlternativa(res.success.data);
        this.searchFechaIniOld = this.searchFechaIni;
        this.searchFechaFinOld = this.searchFechaFin;
        this.selectedReporteOld = this.selectedReporte;
      });
    }

  }

  chartReservasPorMeses: any;

  setChartReservasPorMeses(listViewEspecialidades: any) {
    // if (this.chart != null) {
    //   this.chart.destroy();
    // }

    var dataHospital = new Array();
    var dataInternet = new Array();

    var dataEspecialidades = new Array();
    var seriesData = new Array();
    for (var i = 0; i < listViewEspecialidades.length; i++) {
      seriesData.push({
        name: listViewEspecialidades[i].vind_nombre_hospital,
        data: listViewEspecialidades[i].vind_fichas
      });
    }

    var labelMonth = listViewEspecialidades[0].vind_meses;

   

    var options = {
      series: seriesData,
      chart: {
        height: 550,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      //colors: ['#77B6EA', '#545454'],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: '',
        align: 'left'
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      markers: {
        size: 1
      },
      xaxis: {
        categories: labelMonth,
        title: {
          text: 'Meses'
        }
      },
      yaxis: {
        title: {
          text: 'Pacientes'
        },
        min: 5,
        max: 40
      },

    };

    this.chart = new ApexCharts(document.querySelector("#chart-reservas-por-meses"), options);
    this.chart.render();
  }

  setChartReservasPorMesesAlternativa(listViewEspecialidades: any) {
    // if (this.chart != null) {
    //   this.chart.destroy();
    // }

    var dataHospital = new Array();
    var dataInternet = new Array();

    var dataEspecialidades = new Array();
    var seriesData = new Array();
    for (var i = 0; i < listViewEspecialidades.length; i++) {
      seriesData.push({
        name: listViewEspecialidades[i].vind_nombre_hospital,
        data: listViewEspecialidades[i].vind_fichas
      });
    }

    var labelMonth = listViewEspecialidades[0].vind_meses;

    var options = {
      series: seriesData,
      chart: {
        height: 350,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      // colors: ['#77B6EA', '#545454'],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'REPORTE DE RESERVAS SOLICITADAS POR INTERNET POR MESES',
        align: 'left'
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      markers: {
        size: 1
      },
      xaxis: {
        categories: labelMonth,
        title: {
          text: 'Meses'
        }
      },
      yaxis: {
        title: {
          text: 'Pacientes'
        },
        min: 5,
        max: 40
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    };

    this.chart = new ApexCharts(document.querySelector("#chart-reservas-por-meses-alternativa"), options);
    this.chart.render();
  }

  showDialogPorHospitalEspecialidad(data: any) {
    var params = {
      "params": {
        "idhospital": data.idhosp,
        "fechainicio": this.searchFechaIni,
        "fechafin": this.searchFechaFin
      },
      "hospital": data.hospital,
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    //dialogConfig.autoFocus = true;
    dialogConfig.width = "90%";
    dialogConfig.height = "90%";
    dialogConfig.data = params;
    this.dialog.open(DialogPorHospitalEspecialidadComponent, dialogConfig);
  }

  onReportesChange() {
    this.goInitTab(0);
    this.verifyContext();
  }

  onFilterChange() {
    this.goInitTab(0);
    this.filterHospital();
  }

  verifyContext() {
    if (this.searchFechaIni != "" && this.searchFechaFin != "") {
      switch (this.selectedReporte) {
        case "Hospitales":
          if (this.searchFechaIni != this.searchFechaIniOld || this.searchFechaFin != this.searchFechaFinOld || this.selectedReporte != this.selectedReporteOld) {
            this.getPorHospital();
          }
          this.showHospitales();
          break;
        case "Especialidades":
          if (this.searchFechaIni != this.searchFechaIniOld || this.searchFechaFin != this.searchFechaFinOld || this.selectedReporte != this.selectedReporteOld) {
            this.getEspecialidades();
          }
          this.showEspecialidades();
          break;
        case "Reservas":
          if (this.searchFechaIni != this.searchFechaIniOld || this.searchFechaFin != this.searchFechaFinOld || this.selectedReporte != this.selectedReporteOld) {
            this.getReservas();
          }
          this.showReservas();
          break;
        case "Reservas por Meses":
          if (this.searchFechaIni != this.searchFechaIniOld || this.searchFechaFin != this.searchFechaFinOld || this.selectedReporte != this.selectedReporteOld) {
            this.getReservasPorMeses();
          }
          this.showReservasPorMeses();
          break;
      }
    }
  }

  verifyContextChart() {

    switch (this.selectedReporte) {
      case "Hospitales":
        this.setChart(this.dataSource.data);
        break;
      case "Especialidades":
        this.setChartEspecialidades(this.dataSourceEspecialidades);
        break;
      case "Reservas":
        this.setChartReservas(this.dataSourceReservas);
        break;
      case "Reservas por Meses":
        break;
    }
  }

  onSelectDateIni(type: string, event: MatDatepickerInputEvent<Date>) {
    const fechaCadena = JSON.stringify(event.value);
    this.searchFechaIni = fechaCadena.substring(1, 11);
    this.verifyContext();
  }
  onSelectDateFin(type: string, event: MatDatepickerInputEvent<Date>) {
    const fechaCadena = JSON.stringify(event.value);
    this.searchFechaFin = fechaCadena.substring(1, 11);
    this.verifyContext();
  }

  onTabChanged($event: any) {
    let clickedIndex = $event.index;
  }

  onTabChangedEspecialidades($event: any) {
    let clickedIndex = $event.index;    
  }

  onTabChangedReservas($event: any) {
    let clickedIndex = $event.index;   
  }

  onTabChangedReservasPorMeses($event: any) {
    let clickedIndex = $event.index;
  }

  goInitTab(position: any) {
    this.selectedTabIndex = position;
  }

  showHospitales() {
    this.isVisibleHospitales = true;
    this.isVisibleEspecialidades = false;
    this.isVisibleReservas = false;
    this.isVisibleReservasPorMeses = false;
    this.isVisibleReservasPorMesesAlternativa = false;
    this.titleChart = "REPORTE DE FICHAS EMITIDAS POR HOSPITAL";
  }

  showEspecialidades() {
    this.isVisibleHospitales = false;
    this.isVisibleEspecialidades = true;
    this.isVisibleReservas = false;
    this.isVisibleReservasPorMeses = false;
    this.isVisibleReservasPorMesesAlternativa = false;
    this.titleChart = "FICHAS SOLICITADAS DE ESPECIALIDADES POR HOSPITAL";
    this.subTitleChart = "";
  }

  showReservas() {
    this.isVisibleHospitales = false;
    this.isVisibleEspecialidades = false;
    this.isVisibleReservas = true;
    this.isVisibleReservasPorMeses = false;
    this.isVisibleReservasPorMesesAlternativa = false;
    this.titleChart = "REPORTE DE RESERVAS SOLICITADAS POR INTERNET";
  }

  showReservasPorMeses() {
    this.isVisibleHospitales = false;
    this.isVisibleEspecialidades = false;
    this.isVisibleReservas = false;
    this.isVisibleReservasPorMeses = true;
    this.isVisibleReservasPorMesesAlternativa = false;
    this.titleChart = "REPORTE DE RESERVAS SOLICITADAS POR INTERNET POR MESES";
  }
  showReservasPorMesesAlternativa() {
    this.isVisibleHospitales = false;
    this.isVisibleEspecialidades = false;
    this.isVisibleReservas = false;
    this.isVisibleReservasPorMeses = false;
    this.isVisibleReservasPorMesesAlternativa = true;
    this.titleChart = "FICHAS PLANIFICADAS Y ATENDIDAS POR HOSPITAL";

  }

}

