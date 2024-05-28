import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ReportesGamlpService } from '../../reportes-gamlp.service';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogPorHospitalEspecialidadMedicoComponent } from '../dialog-por-hospital-especialidad-medico/dialog-por-hospital-especialidad-medico.component';
import { MatTableDataSource } from '@angular/material/table';

export interface programaData {
}

@Component({
  selector: 'app-dialog-por-hospital-especialidad',
  templateUrl: './dialog-por-hospital-especialidad.component.html',
  styleUrls: ['./dialog-por-hospital-especialidad.component.scss']
})
export class DialogPorHospitalEspecialidadComponent implements OnInit {
  dataSourceEspecialidades: MatTableDataSource<programaData>;
  displayedColumnsEspecialidades: string[] = [
    'id',
    'especialidad',
    'fichas_planificadas',
    'fichas_solicitadas',
    'fichas_atendidas'
  ];

  titleHospital = "";

  constructor(
    public reportesGamplService: ReportesGamlpService,
    private dialogEspecialidad: MatDialog,
    public dialogEspecialidadRef: MatDialogRef<DialogPorHospitalEspecialidadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.dataSourceEspecialidades = new MatTableDataSource();
  }

  ngOnInit(): void {
    console.log("DIALOg DATA X");
    console.log(this.data);
    this.getPorHospitalEspecialidad();
    this.titleHospital = this.data.hospital;
  }
  close() {
    this.dialogEspecialidadRef.close();
  }

  getPorHospitalEspecialidad() {

    var listIndexEspecialidades = new Array();
    var listViewEspecialidades = new Array();

    this.reportesGamplService.getReportePrestacion1(this.data.params).subscribe(res => {
      console.log(res);
      this.dataSourceEspecialidades = res.success.data;
      this.setChartEspecialidades(res.success.data);
    });
  }

  chartPorHospitalEspecialidad: any;

  setChartEspecialidades(listViewEspecialidades: any) {
    
    var dataPlanificadas = new Array();
    var dataSolicitadas = new Array();
    var dataAtendidas = new Array();
    var seriesData = new Array();
    var categoriesEspecialidad = new Array();

    for (var i = 0; i < listViewEspecialidades.length; i++) {
      dataPlanificadas.push(listViewEspecialidades[i].vfichasplanificadas);
      dataSolicitadas.push(listViewEspecialidades[i].vsolicitadas);
      dataAtendidas.push(listViewEspecialidades[i].vfichasatendidas);
      categoriesEspecialidad.push(listViewEspecialidades[i].vnombre_hospital);
    }

    seriesData.push({
      name: "Planificadas",
      data: dataPlanificadas
    });
    seriesData.push({
      name: "Solicitadas",
      data: dataSolicitadas
    });
    seriesData.push({
      name: "Atendidas",
      data: dataAtendidas
    });
 
    var options = {
      series: seriesData,
      chart: {
        height: 550,
        type: 'bar',
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
        },
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            console.log(chartContext, config);

          },
          dataPointMouseEnter: (event: any, chartContext: any, config: any) => {
            event.path[0].style.cursor = "pointer";
          },
          click: (event: any, chartContext: any, config: any) => {
            console.log(config.dataPointIndex + " " + config.seriesIndex);
            if (config.dataPointIndex != -1) {
              this.showDialogPorHospitalEspecialidadMedico(listViewEspecialidades[config.dataPointIndex]);
            }
          }
        }

      },
      //colors: ['#03d0c8', '#ec3b8a','#805cff'],
      // dataLabels: {
      //   enabled: true,
      // },
      dataLabels: {
        enabled: true,
        formatter: function (val:any) {
          return val + "";
        },
        offsetY: 20,
        style: {
          fontSize: '10px',
          colors: ["#0"],
          fontWeight: 'normal',      
        }
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
        categories: categoriesEspecialidad,
        title: {
          text: 'Especialidades'
        }
      },
      yaxis: {
        title: {
          text: 'Fichas'
        },
        min: 0
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    };

    this.chartPorHospitalEspecialidad = new ApexCharts(document.querySelector("#chart-por-hospital-especialidad-dialog"), options);
    this.chartPorHospitalEspecialidad.render();
  }

  showDialogPorHospitalEspecialidadMedico(especialidad: any) {    
    var params = {
      "params": {
        "idhospital": especialidad.idhospitalprincipal,
        "idespecialidad": especialidad.vesp_id,
        "fechainicio": this.data.params.fechainicio,
        "fechafin": this.data.params.fechafin
      },
      "especialidad": especialidad.vnombre_hospital
    };
    console.log("DATA SEND");
    console.log(params);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    //dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.height = "80%";
    dialogConfig.data = params;
    this.dialogEspecialidad.open(DialogPorHospitalEspecialidadMedicoComponent, dialogConfig);
  }
}




