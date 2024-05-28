import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ReportesGamlpService } from '../../reportes-gamlp.service';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';

export interface programaData {
}

@Component({
  selector: 'app-dialog-por-hospital-especialidad-medico',
  templateUrl: './dialog-por-hospital-especialidad-medico.component.html',
  styleUrls: ['./dialog-por-hospital-especialidad-medico.component.scss']
})
export class DialogPorHospitalEspecialidadMedicoComponent implements OnInit {
  dataSourceEspecialidadesMedico: MatTableDataSource<programaData>;

  displayedColumnsEspecialidadesMedico: string[] = [
    'id',
    'nombre_medico',
    'fichas_planificadas',
    'fichas_solicitadas',
    'fichas_atendidas'
  ];

  titleEspecialidad = "";
  constructor(
    public reportesGamplService: ReportesGamlpService,
    public dialogEspecialidadMedicoRef: MatDialogRef<DialogPorHospitalEspecialidadMedicoComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dataSourceEspecialidadesMedico = new MatTableDataSource();
  }

  ngOnInit(): void {
    console.log("DIALOg DATA YYYYYYYY");
    console.log(this.data);
    this.getPorHospitalEspecialidadMedico();
    this.titleEspecialidad = this.data.especialidad;
  }
  close() {
    this.dialogEspecialidadMedicoRef.close();
  }

  getPorHospitalEspecialidadMedico() {

    var listIndexEspecialidades = new Array();
    var listViewEspecialidades = new Array();

    this.reportesGamplService.getReporteDoctorPrestacion1(this.data.params).subscribe(res => {
      console.log(res);
      this.dataSourceEspecialidadesMedico = res.success.data;
      this.setChartEspecialidadesMedico(res.success.data);
    });
  }

  chartPorHospitalEspecialidadMedico: any;

  setChartEspecialidadesMedico(listViewEspecialidadesMedico: any) {

    var dataPlanificadas = new Array();
    var dataSolicitadas = new Array();

    var dataAtendidas = new Array();
    var seriesData = new Array();
    var categoriesEspecialidadMedico = new Array();

    for (var i = 0; i < listViewEspecialidadesMedico.length; i++) {
      dataPlanificadas.push(listViewEspecialidadesMedico[i].vplanificadas);
      dataSolicitadas.push(listViewEspecialidadesMedico[i].vsolicitadas);
      dataAtendidas.push(listViewEspecialidadesMedico[i].vatendidas);
      categoriesEspecialidadMedico.push(listViewEspecialidadesMedico[i].nombremedico);
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

    console.log(dataPlanificadas);
    console.log(dataSolicitadas);
    console.log(dataAtendidas);

    var options = {
      series: seriesData,
      chart: {
        height: 450,
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
        }
      },
      colors: ['#03d0c8', '#ec3b8a','#805cff'],
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
        categories: categoriesEspecialidadMedico,
        title: {
          text: ''
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

    this.chartPorHospitalEspecialidadMedico = new ApexCharts(document.querySelector("#chart-por-hospital-especialidad-medico"), options);
    this.chartPorHospitalEspecialidadMedico.render();
  }


}
