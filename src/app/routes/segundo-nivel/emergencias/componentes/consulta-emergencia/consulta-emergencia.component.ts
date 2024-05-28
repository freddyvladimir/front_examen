import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
@Component({
  selector: 'app-consulta-emergencia',
  templateUrl: './consulta-emergencia.component.html',
  styleUrls: ['./consulta-emergencia.component.scss']
})
export class ConsultaEmergenciaComponent implements OnInit {

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  constructor() { }

  @Input() datosConsultaEmergencias: any = "";

  /*datosConsultaEmergencias: any = {
    "id_emerg": 96891,
    "presid": 1388462,
    "vconsultexter": [
      {
        "tipoSeguroSalud": "INSTITUCIONAL",
        "cubiculo_aten": "CUB - 1",
        "referido_inst1": "",
        "horaingreso": "11:25:00",
        "fechaingreso": "2022-09-14",
        "fechaNacimiento": "2009-09-25",
        "edad": "12 años 11 meses 19 dias",
        "peso": "34,0",
        "estatura": "134",
        "indicemasa": "18.94",
        "tipotemp": "AXILAR,",
        "presionalterial": "0/0",
        "frecuenciaresp": "32",
        "temperatura": "36,0",
        "temperaturaO": "",
        "temperaturaR": "",
        "pulso": "101",
        "saturacion": "93",
        "llenadoCapilar": "3",
        "motivo_consulta": "ASD",
        "historiaEnf": "ASDAS",
        "antecedentes": "ASDASD",
        "apertura_ocular": "1",
        "respuesta_verbal": "2",
        "respuesta_motora": "3",
        "total": 6,
        "od": "2",
        "oi": "3",
        "craneo_facial": "CRANEO-FACIAL:",
        "piel_mucosas": "PIEL Y MUCOSAS:",
        "cardiaco": "CARDIACO",
        "pulmonar": "PULMONAR",
        "abdomen": "ABDOMEN",
        "genito_urinario": "URINARIO",
        "extremidades": "EXTREMIDADES",
        "otros": "OTROS",
        "ananmesis": "-ASD\n-ASDAS\n-ASDASD",
        "examenfisico": "-6\n-2\n-3\n-CRANEO-FACIAL:\n-PIEL Y MUCOSAS:\n-CARDIACO\n-PULMONAR\n-ABDOMEN\n-URINARIO\n-EXTREMIDADES\n-OTROS",
        "diagnosticoDescriptivo": "IMPRESIÓN DIAGNÓSTICA DE INGRESO",
        "diagnosticoDescriptivoFin": "IMPRESIÓN DIAGNÓSTICA DE EGRESO:",
        "diagnosticoIngreso": "*U07.2-COVID-19 ,virus no identificado-N\n",
        "diagnosticoEgreso": "",
        "tratamiento": "ASDASD",
        "observaciones": "ASDASD",
        "ambulatoria": "ASDASD",
        "resultados": "",
        "conducta": "",
        "recomendacion": "",
        "situacion": "1",
        "serviciosHospi": "",
        "alta_solicitada": "",
        "horaegreso": "",
        "nota_rechazo": "",
        "referido_alg": "",
        "inyectable": "",
        "suero": "",
        "suturas": "",
        "curacionesMay": "",
        "curacionesMed": "",
        "curacionesMen": "",
        "nebulizacion": "",
        "drenaje": "",
        "monitarizacion": "",
        "retiro_yeso": "",
        "soporte_o2": "",
        "anestesia_local": "",
        "otrasActdds": "",
        "retiro_puntos": "",
        "toma_presion": "",
        "triaje": 3,
        "cie10Ingreso": [
          {
            "alfa": "U07.2",
            "id_cie10": 90181,
            "tipodepa": null,
            "descripcion": "COVID-19 ,virus no identificado",
            "tipo_cie10": "NUEVO"
          }
        ],
        "diagnosticoEgresoImpresion": ""
      }
    ],
    "vinternacion": {},
    "vcies10_ing": [
      {
        "alfa": "U07.2",
        "id_cie10": 90181,
        "tipodepa": null,
        "descripcion": "COVID-19 ,virus no identificado",
        "tipo_cie10": "NUEVO"
      }
    ],
    "vcies10_egre": [],
    "vusuario": 142877,
    "vidmedic": 1050,
    "vquirofano": {},
    "vpartos": {},
    "vcirugia": {},
    "vneonatologia": {},
    "vterapia_intermedia": {},
    "vexamenes": "",
    "vespid": 190,
    "usrid": 1086,
    "hora_soltd_interconsulta": "12:30",
    "fecha_soltd_interconsulta": "2022-09-15",
    "vprestacion_id": 190,
    "vpres_hu_medico_id": 1086,
    "vdtspsl_id": 142877,
    "vdtspsl_nombres": "GAEL ANTHONY",
    "vdtspsl_paterno": "SARAVIA",
    "vdtspsl_materno": "ROCHA",
    "vdtspsl_ci": "00013967380",
    "vdtspsl_fec_nacimiento": "2009-09-25",
    "vdtspsl_sexo": "1",
    "vdtspsl_id_estado_civil": "1",
    "vdtspsl_expedido": "2",
    "vhcl_codigoseg": "321"
  };*/

  currentSignosVitales = {
    "peso": "78",
    "altura": "1.80",
    "temperaturaAxilar": "37",
    "temperaturaRectal": "37",
    "temperaturaOral": "37",
    "temperaturaAuricular": "37",

    "frecuenciaCardiaca": "16",
    "presionArterial": "90",
    "frecuenciaRespiratoria": "12",
    "saturacionOxigeno": "90",

    "genero": "M",
    "context": ""
  }

  ngOnInit(): void {

    this.currentSignosVitales = {
      "peso": this.datosConsultaEmergencias.vconsultexter[0].peso,
      "altura": this.datosConsultaEmergencias.vconsultexter[0].estatura,
      "temperaturaAxilar": this.datosConsultaEmergencias.vconsultexter[0].temperatura,
      "temperaturaRectal": this.datosConsultaEmergencias.vconsultexter[0].temperaturaR,
      "temperaturaOral": this.datosConsultaEmergencias.vconsultexter[0].temperaturaO,
      "temperaturaAuricular": "0",
      "frecuenciaCardiaca": this.datosConsultaEmergencias.vconsultexter[0].pulso,
      "presionArterial": this.datosConsultaEmergencias.vconsultexter[0].presionalterial,
      "frecuenciaRespiratoria": this.datosConsultaEmergencias.vconsultexter[0].frecuenciaresp,
      "saturacionOxigeno": this.datosConsultaEmergencias.vconsultexter[0].saturacion,
      "genero": "M",
      "context": "edit"
     
    }

  }
  ngAfterViewInit(): void {
    this.accordion.openAll();
  }

  onSubmit() {

  }

}
