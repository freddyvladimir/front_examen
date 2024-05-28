import { Component, OnInit } from '@angular/core';
import { IndicadoresService } from '../indicadores.service';
import * as Highcharts from 'highcharts';


@Component({
  selector: 'app-semaforos',
  templateUrl: './semaforos.component.html',
  styleUrls: ['./semaforos.component.scss']
})
export class SemaforosComponent implements OnInit {
  sql: any;
  responde: any;

  totaltotales:any;
  totalinstitucional:any;
  totalley:any;
  dataS:any;
  datainstS:any;
  dataleyS:any;
  fichas:any;
  
  highcharts = Highcharts;
  
  //chartOptions:any;

  chartOptions = {   
    chart: {
       type: "spline"
    },
    title: {
       text: "Monthly Average Temperature"
    },
    subtitle: {
       text: "Source: WorldClimate.com"
    },
    xAxis:{
       categories:["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    },
    yAxis: {          
       title:{
          text:"Temperature °C"
       } 
    },
    tooltip: {
       valueSuffix:" °C"
    },
    series: [
       {
          name: 'Tokyo',
          data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2,26.5, 23.3, 18.3, 13.9, 9.6]
       },
       {
          name: 'New York',
          data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8,24.1, 20.1, 14.1, 8.6, 2.5]
       },
       {
          name: 'Berlin',
          data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
       },
       {
          name: 'London',
          data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
       }
    ]
 };

 
  constructor(private http: IndicadoresService) { }

  ngOnInit(): void {
    this.listarSemaforo();
    this.initializeChart();
  }


  listarSemaforo() {
    try {
      this.sql = {
        consulta: "select * from sp_lst_indicadores_semaforos_mejorado_fichas_solicitadas(2019,1,3)"
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          console.log("indicadores", this.responde.success.data[0].sp_dinamico);
          this.fichas = this.responde.success.data[0].sp_dinamico;
          this.graficar_semaforos_fichasSolicitadas(this.responde.success.data[0].sp_dinamico);
        } else {
        }
      });
    } catch (error) {
    }
  }

  initializeChart(): void {
    var series = {
      type: 'pie'
   };
   
   
   
   

    /*const chartOptions = {
      chart: {
          type: 'column'
      },
      title: {
          text: 'Ejemplo de gráfico'
      },
      xAxis: {
          categories: ['Manzanas', 'Peras', 'Naranjas']
      },
      yAxis: {
          title: {
              text: 'Cantidad'
          }
      },
      series: []
  };
  
  // Datos de la serie
  const seriesData = [    {        name: 'Juan',        data: [1, 2, 3]
      },
      {
          name: 'Pedro',
          data: [4, 5, 6]
      }
  ];
  
  // Fusionar opciones de configuración con los datos de la serie
  const mergedOptions = Highcharts.merge(chartOptions, { series: seriesData });
  
  // Crear el gráfico
  Highcharts.chart('chart-container', mergedOptions);*/


    /*const options: any = {
      chart: {
        type: 'line',
        zoomType: 'x',
        width: 800,
        height: 600,
        style: {
          fontFamily: 'Arial'
        },
        boost: {
          useGPUTranslations: true,
          usePreallocated: true
        }
      },
      title: {
        text: 'Ejemplo de gráfico de líneas con Highcharts Boost'
      },
      xAxis: {
        categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      },
      yAxis: {
        title: {
          text: 'Cantidad'
        }
      },
      series: [{
        name: 'Datos 1',
        data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]
      }]
    };
    Highcharts.chart('chart-container', options);*/
  }

  graficar_semaforos_fichasSolicitadas = function (datos:any) {
    console.log("datos", datos);
    var gaugeOptions = {
      chart: {
        type: 'solidgauge'
      },
      title: null,
      pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: (Highcharts.theme) || '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }
      },
      tooltip: {
        enabled: false
      },
      yAxis: {
        stops: [
          [0.1, '#f60000'], // rojo
          [0.2, '#f60000'], // rojo
          [0.39, '#f60000'], // rojo
          [0.4, '#29dd23'], // rojo
          [0.59, '#29dd23'], // verde
          [0.6, '#f4f600'], // verde
          [0.7, '#f4f600'], // amarillo
          [0.8, '#f4f600'], // amarillo
          [0.9, '#f4f600'] // amarillo
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickPixelInterval: 400,
        tickWidth: 0,
        title: {
          y: -70
        },
        labels: {
          y: 16
        }
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: 5,
            borderWidth: 0,
            useHTML: true
          }
        }
      }
    };
    var gaugeOptionsArriba = {
      chart: {
        type: 'solidgauge'
      },
      title: null,
      pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: (Highcharts.theme) || '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }
      },
      tooltip: {
        enabled: false
      },
      yAxis: {
        stops: [
          [0.1, '#f60000'], // rojo
          [0.2, '#f60000'], // rojo
          [0.39, '#f60000'], // rojo
          [0.4, '#f60000'], // rojo
          [0.59, '#f60000'], // verde
          [0.6, '#f4f600'], // verde
          [0.7, '#f4f600'], // amarillo
          [0.8, '#29dd23'], // amarillo
          [0.9, '#29dd23'] // amarillo
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickPixelInterval: 400,
        tickWidth: 0,
        title: {
          y: -70
        },
        labels: {
          y: 16
        }
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: 5,
            borderWidth: 0,
            useHTML: true
          }
        }
      }
    };
    for (var i = 0; i < datos.length; i++) {
      var totaltotales = '#' + datos[i].codhospital + 'S';
      var totalinstitucional = '#' + datos[i].codhospital + 'SI';
      var totalley = '#' + datos[i].codhospital + 'SL';
      var dataS = datos[i].porcetaje_total;
      var datainstS = datos[i].porcentaje_i;
      var dataleyS = datos[i].porcentaje_l;
      
      (Highcharts.merge(gaugeOptionsArriba, {
        yAxis: {
          min: 0,
          max: 100,
          title: {
            text: datos[i].hospital
          }
        },
        credits: {
          enabled: false
        },
        series: [{
          name: 'LA MERCED',
          data: [dataS],
          dataLabels: {
            format: '<div style="text-align:center"><span style="font-size:25px;color:' +
              ((Highcharts.theme) || 'black') + '">{y}</span><br/>' +
              '<span style="font-size:12px;color:silver">%</span></div>'
          },
          tooltip: {
            valueSuffix: '%'
          }
        }]
      }));
      (Highcharts.merge(gaugeOptions, {
        yAxis: {
          min: 0,
          max: 100,
          title: {
            text: datos[i].hospital
          }
        },
        credits: {
          enabled: false
        },
        series: [{
          name: 'LA MERCED',
          data: [dataleyS],
          dataLabels: {
            format: '<div style="text-align:center"><span style="font-size:25px;color:' +
              ((Highcharts.theme) || 'black') + '">{y}</span><br/>' +
              '<span style="font-size:12px;color:silver">%</span></div>'
          },
          tooltip: {
            valueSuffix: '%'
          }
        }]
      }));
      (Highcharts.merge(gaugeOptions, {
        yAxis: {
          min: 0,
          max: 100,
          title: {
            text: datos[i].hospital
          }
        },
        credits: {
          enabled: false
        },
        series: [{
          name: 'LA MERCED',
          data: [datainstS],
          dataLabels: {
            format: '<div style="text-align:center"><span style="font-size:25px;color:' +
              ((Highcharts.theme) || 'black') + '">{y}</span><br/>' +
              '<span style="font-size:12px;color:silver">%</span></div>'
          },
          tooltip: {
            valueSuffix: '%'
          }
        }]
      }));
    }
  }
}
