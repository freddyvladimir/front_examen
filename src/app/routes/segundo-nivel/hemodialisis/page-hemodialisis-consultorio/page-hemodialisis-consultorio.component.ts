import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HemodialisisService } from '../hemodialisis.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogMedicamentosComponent } from './dialog-medicamentos/dialog-medicamentos.component';
import { DialogLaboratoriosComponent } from './dialog-laboratorios/dialog-laboratorios.component';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { MatRadioChange } from '@angular/material/radio';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


export interface PeriodicElement {
  serial: number;
  name: string;
  weight: number;
  symbol: string;
}

export interface programaData {
  serial: string;
}

export interface PeriodicElementos {
  codigo: number;
  laboratorio: string;
  programado: string;
  opciones: string;
  descripcion: string;
}

export interface PeriodicElements {
  codigo: number;
  laboratorio: string;
  programado: string;
  opciones: string;
}

@Component({
  selector: 'app-page-hemodialisis-consultorio',
  templateUrl: './page-hemodialisis-consultorio.component.html',
  styleUrls: ['./page-hemodialisis-consultorio.component.scss'],
})
export class PageHemodialisisConsultorioComponent implements OnInit, AfterViewInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  NOMBRE_HOSPITAL = sessionStorage.getItem('NOMBRE_HOSPITAL');
  idhosp = 1;
  datos_pacientesConsultorio: any = [];
  valorSolicitud: any;
  idCombo: any;
  responde: any;
  variable: any;
  variableLab: any = [];
  variableFecha: any = [];
  respuesta_combo: any;
  recuperaPaciente: any;
  recuperaVpacId: any;
  recuperaProcedimiento: any;
  recuperaListaLabo: any;
  recuperaCompleto: any;
  varfis: any;
  varcat: any;
  enfermeriaHoja: any;
  enfermeriaHojaDatos: any;
  datosPacientAsignadoData: any;
  hojaId: any;
  popupWin: any;


  public isVisibleListPaciente: boolean = true;
  public isVisibleFormDatosPaciente: boolean = false;
  public isVisibleFormMedicamentos: boolean = false;
  public isVisibleLaboratorio: boolean = false;
  public titleSection = 'Atenciòn Consultorio';
  public medicamentos: any = [];
  public array_laboratorio_programado: any[] = [];
  public array_laboratorio_programado_anual: any[] = [];
  public contador_laboratorio_programado: number = 0;
  public contador_laboratorio_programado_anual: number = 0;
  ELEMENT_DATA: PeriodicElements[] = [];
  ELEMENT_DATA_ANUAL: PeriodicElementos[] = [];
  dataSources = new MatTableDataSource(this.ELEMENT_DATA);
  dataSourcesAnual = new MatTableDataSource(this.ELEMENT_DATA_ANUAL);
  displayedColumnsbar: string[] = ['codigo', 'laboratorio', 'programado', 'opciones'];
  displayedColumnsAnual: string[] = ['codigo', 'laboratorio', 'programado', 'descripcion', 'opciones'];


  //////////////////////////////////////////////////  BRYAN    /////////////////////////////////////////////
  FormMensual = this.formBuilder.group({
    unidad_descripcion_anual: [''],
    unidad_servicio: [''],
    solicitud_transfusion_urgente: [''],
    solicitud_transfusion_programada: [''],
    lab_soltransf: [],
    grupo_sanguineo: [''],
    Sangre_Total: [''],
    Paquete_Globular: [''],
    Plasma_Fresco_Congelado: [''],
    Concentrado_De_Plaquetas: [''],
    Crioprecipitados: [''],
    Anticuerpos_Irregulares: [''],
    Plasma_Normal: [''],
    Globulos_Rojos_Lavados: [''],
    otros: [''],
    Nada: [''],
  });

  prueba(data: any) {
    // console.log('Muestra valores de data', data);
    this.variableFecha = data;
    this.array_laboratorio_programado[this.contador_laboratorio_programado] = {
      codigo: this.contador_laboratorio_programado + 1,
      laboratorio: data.laboratorio,
      programado: data.mes,
      opciones: 'H',
    };
    // console.log('valores de interior de data', this.array_laboratorio_programado);
    this.dataSources = new MatTableDataSource<any>(this.array_laboratorio_programado);
    this.contador_laboratorio_programado = this.contador_laboratorio_programado + 1;
    this.variableLab = this.array_laboratorio_programado;
  }
  vhojaDatosForm = this.formBuilder.group({
    hoja_edad: [''],
    hoja_fhemo: [''],
    hoja_maqid: [null],
    hoja_accvas: [''],
    hoja_riesgo: [''],
    hoja_cateter: [''],
    hoja_fistula: [''],
    hoja_nrodial: [null],
    hoja_nrodias: [''],
    hoja_estatura: [null],
    hoja_catusados: [''],
    hoja_observacion: [''],
    hoja_initultimocat: [''],
  });
  dataSource: MatTableDataSource<programaData>;
  public nombreCompleto: string = 'A';
  public nombreCompletoLab: string = '';

  vhojaDatosConsultorioForm = this.formBuilder.group({
    cnsl_qb: [''], //
    cnsl_qd: [''],
    cnsl_has: [false],
    cnsl_otros: [false],
    cnsl_sodio: [''],
    cnsl_calcio: [''],
    cnsl_mareos: [false],
    cnsl_parocr: [false],
    cnsl_tiempo: [''],
    cnsl_cefalea: [false],
    cnsl_nauseas: [false],
    cnsl_potasio: [''],
    cnsl_vomitos: [false],
    cnsl_ansiedad: [false],
    cnsl_arritmia: [true],
    cnsl_disfaccv: [false],
    cnsl_doltorax: [false],
    cnsl_heparina: [''],
    cnsl_calambres: [true],
    cnsl_emboliare: [false],
    cnsl_presc_obs: [''],
    cnsl_rupfiltro: [false],
    cnsl_ruplineas: [false],
    cnsl_sindrouso: [false],
    cnsl_trombosis: [false],
    cnsl_ematomafis: [true],
    cnsl_reacdesinf: [false],
    cnsl_despltrocar: [false],
    cnsl_hipotension: [false],
    cnsl_observacion: [''],
    cnsl_temperatura: [''],
    cnsl_convulsiones: [false],
    cnsl_diagnosticos: [''],
    cnsl_indicaciones: [''],
    cnsl_infmiocardio: [false],
    cnsl_otrosdescrip: [''],
    cnsl_sangramiento: [false],
    cnsl_ultrafiltrado: [''],
    cnsl_objanam_predial: [''],
    cnsl_subanam_predial: [''],
    cnsl_alergias: [''],
  });
  enfHdatosForm = this.formBuilder.group({
    enf_fr: [''],
    enf_fs: [''],
    enf_pa: [''],
    enf_pc: [''],
    enf_qd: [''],
    enf_obs: [''],
    enf_ptm: [''],
    enf_sat: [''],
    enf_hora: [''],
    enf_temp: [''],
    enf_condu: [''],
    enf_pvenosa: [''],
  });
  vhojaDatosEnfermeriaForm = this.formBuilder.group({
    enf_k: [''],
    enf_ca: [''],
    enf_qb: [''],
    enf_qd: [''],
    enf_uf: [''],
    enf_us: [''],
    enf_ptm: [''],
    enf_hfin: [''],
    enf_devol: [''],
    enf_hinit: [''],
    enf_filtro: [''],
    enf_hdatos: this.enfHdatosForm,
    enf_lineas: [''],
    enf_perfuf: [''],
    enf_evalenf: [''],
    enf_pvenosa: [''],
    enf_temppre: [''],
    enf_heparina: [''],
    enf_pesoseco: [''],
    enf_primming: [''],
    enf_temppost: [''],
    enf_anticoagu: [''],
    enf_filtrouso: [''],
    enf_ktvonline: [''],
    enf_lineasuso: [''],
    enf_parterial: [''],
    enf_perfsodio: [''],
    enf_pesoprehd: [''],
    enf_pesoposthd: [''],
    enf_bicarbonato: [''],
    enf_medicamutil: [''],
    enf_responsable: [''],
    enf_temperatura: [''],
    enf_ktvonlineval: [''],
    enf_anticoagucont: [''],
    enf_anticoagufrac: [''],
    enf_dosificacion1: [''],
    enf_dosificacion2: [''],
    enf_sodioprescrip: [''],
  });
  comboRecuperaAlergias(row: any) {
    var params = {
      siis: row.hc_siis,
    };
    this.hemodialisisService.getAlergias2(params).subscribe(resp => {
      this.respuesta_combo = resp.success.data[0];
    });
  }
  recuperaDatosPaciente(row: any) {
    var params = {
      num: row.hjid,
    };
    this.hemodialisisService.obtenerDatosPacienteSP(params).subscribe(resp => {
      this.recuperaPaciente = resp.success.data[0];
      this.recuperaVpacId = resp.success.data[0].vpac_id;
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    public dialog: MatDialog,
    private hemodialisisService: HemodialisisService,
    private formBuilder: FormBuilder
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.obtAtenConsultorio();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  recuperaDatosLabosSP(row: any) {
    var params = {
      num: row.hjid,
    };
    this.hemodialisisService.sp_listar_imprlabos(params).subscribe(resp => {
      this.recuperaListaLabo = resp.success.data;
    });
  }
  recuperaProcedimientoSP(row: any) {
    var params = {
      opcion: 'L3',
      hojaid: row.hjid,
    };
    this.hemodialisisService.obtenerHojaDatosConsultorio(params).subscribe(resp => {
      this.recuperaProcedimiento = resp.success.data;
      this.recuperaCompleto = this.recuperaProcedimiento[0].hj_datos[0];
      this.vhojaDatosConsultorioForm
        .get('cnsl_diagnosticos')
        ?.setValue(this.recuperaCompleto.cnsl_diagnosticos);
      this.vhojaDatosConsultorioForm.get('cnsl_qd')?.setValue(this.recuperaCompleto.cnsl_qd);
      this.vhojaDatosConsultorioForm.get('cnsl_qb')?.setValue(this.recuperaCompleto.cnsl_qb);
      this.vhojaDatosConsultorioForm.get('cnsl_has')?.setValue(this.recuperaCompleto.cnsl_has);
      this.vhojaDatosConsultorioForm.get('cnsl_otros')?.setValue(this.recuperaCompleto.cnsl_otros);
      this.vhojaDatosConsultorioForm.get('cnsl_sodio')?.setValue(this.recuperaCompleto.cnsl_sodio);
      this.vhojaDatosConsultorioForm
        .get('cnsl_calcio')
        ?.setValue(this.recuperaCompleto.cnsl_calcio);
      this.vhojaDatosConsultorioForm
        .get('cnsl_mareos')
        ?.setValue(this.recuperaCompleto.cnsl_mareos);
      this.vhojaDatosConsultorioForm
        .get('cnsl_parocr')
        ?.setValue(this.recuperaCompleto.cnsl_parocr);
      this.vhojaDatosConsultorioForm
        .get('cnsl_tiempo')
        ?.setValue(this.recuperaCompleto.cnsl_tiempo);
      this.vhojaDatosConsultorioForm
        .get('cnsl_cefalea')
        ?.setValue(this.recuperaCompleto.cnsl_cefalea);
      this.vhojaDatosConsultorioForm
        .get('cnsl_nauseas')
        ?.setValue(this.recuperaCompleto.cnsl_nauseas);
      this.vhojaDatosConsultorioForm
        .get('cnsl_potasio')
        ?.setValue(this.recuperaCompleto.cnsl_potasio);
      this.vhojaDatosConsultorioForm
        .get('cnsl_vomitos')
        ?.setValue(this.recuperaCompleto.cnsl_vomitos);
      this.vhojaDatosConsultorioForm
        .get('cnsl_ansiedad')
        ?.setValue(this.recuperaCompleto.cnsl_ansiedad);
      this.vhojaDatosConsultorioForm
        .get('cnsl_arritmia')
        ?.setValue(this.recuperaCompleto.cnsl_arritmia);
      this.vhojaDatosConsultorioForm
        .get('cnsl_disfaccv')
        ?.setValue(this.recuperaCompleto.cnsl_disfaccv);
      this.vhojaDatosConsultorioForm
        .get('cnsl_doltorax')
        ?.setValue(this.recuperaCompleto.cnsl_doltorax);
      this.vhojaDatosConsultorioForm
        .get('cnsl_heparina')
        ?.setValue(this.recuperaCompleto.cnsl_heparina);
      this.vhojaDatosConsultorioForm
        .get('cnsl_calambres')
        ?.setValue(this.recuperaCompleto.cnsl_calambres);
      this.vhojaDatosConsultorioForm
        .get('cnsl_emboliare')
        ?.setValue(this.recuperaCompleto.cnsl_emboliare);
      this.vhojaDatosConsultorioForm
        .get('cnsl_presc_obs')
        ?.setValue(this.recuperaCompleto.cnsl_presc_obs);
      this.vhojaDatosConsultorioForm
        .get('cnsl_rupfiltro')
        ?.setValue(this.recuperaCompleto.cnsl_rupfiltro);
      this.vhojaDatosConsultorioForm
        .get('cnsl_ruplineas')
        ?.setValue(this.recuperaCompleto.cnsl_ruplineas);
      this.vhojaDatosConsultorioForm
        .get('cnsl_sindrouso')
        ?.setValue(this.recuperaCompleto.cnsl_sindrouso);
      this.vhojaDatosConsultorioForm
        .get('cnsl_trombosis')
        ?.setValue(this.recuperaCompleto.cnsl_trombosis);
      this.vhojaDatosConsultorioForm
        .get('cnsl_ematomafis')
        ?.setValue(this.recuperaCompleto.cnsl_ematomafis);
      this.vhojaDatosConsultorioForm
        .get('cnsl_reacdesinf')
        ?.setValue(this.recuperaCompleto.cnsl_reacdesinf);
      this.vhojaDatosConsultorioForm
        .get('cnsl_despltrocar')
        ?.setValue(this.recuperaCompleto.cnsl_despltrocar);
      this.vhojaDatosConsultorioForm
        .get('cnsl_hipotension')
        ?.setValue(this.recuperaCompleto.cnsl_hipotension);
      this.vhojaDatosConsultorioForm
        .get('cnsl_observacion')
        ?.setValue(this.recuperaCompleto.cnsl_observacion);
      this.vhojaDatosConsultorioForm
        .get('cnsl_temperatura')
        ?.setValue(this.recuperaCompleto.cnsl_temperatura);
      this.vhojaDatosConsultorioForm
        .get('cnsl_convulsiones')
        ?.setValue(this.recuperaCompleto.cnsl_convulsiones);
      this.vhojaDatosConsultorioForm
        .get('cnsl_indicaciones')
        ?.setValue(this.recuperaCompleto.cnsl_indicaciones);
      this.vhojaDatosConsultorioForm
        .get('cnsl_infmiocardio')
        ?.setValue(this.recuperaCompleto.cnsl_infmiocardio);
      this.vhojaDatosConsultorioForm
        .get('cnsl_otrosdescrip')
        ?.setValue(this.recuperaCompleto.cnsl_otrosdescrip);
      this.vhojaDatosConsultorioForm
        .get('cnsl_sangramiento')
        ?.setValue(this.recuperaCompleto.cnsl_sangramiento);
      this.vhojaDatosConsultorioForm
        .get('cnsl_ultrafiltrado')
        ?.setValue(this.recuperaCompleto.cnsl_ultrafiltrado);
      this.vhojaDatosConsultorioForm
        .get('cnsl_objanam_predial')
        ?.setValue(this.recuperaCompleto.cnsl_objanam_predial);
      this.vhojaDatosConsultorioForm
        .get('cnsl_subanam_predial')
        ?.setValue(this.recuperaCompleto.cnsl_subanam_predial);
      this.vhojaDatosConsultorioForm
        .get('cnsl_alergias')
        ?.setValue(this.recuperaCompleto.cnsl_alergias);
    });
  }
  getProcedimiento(row: any) {
    this.variable = row;
    this.nombreCompleto = row.nombres + ' ' + row.paterno + ' ' + row.materno;
    this.showFormDatosPaciente();
    this.comboRecuperaAlergias(row);
    this.recuperaDatosPaciente(row);

    this.recuperaProcedimientoSP(row);
    this.getEnfermeriaHoja(row);
    var params = {
      idhoj: row.hjid,
    };
    this.hemodialisisService.getProcedimiento(params).subscribe(res => {
      var response = res;
      console.log("dadd", response);
      if(response.success.data != null){      
        var hojaDatos = response.success.data[0];
        
        for (var key in hojaDatos) {
          if (hojaDatos.hasOwnProperty(key)) {
            if (
              key != 'vhoja_datos' &&
              key != 'vhoja_datos_consultorio' &&
              key != 'vhoja_datos_enfermeria'
            ) {
              this.procedimientoForm.controls[key].setValue(hojaDatos[key]);
            }
          }
        }
        for (var key in hojaDatos.vhoja_datos[0]) {
          if (hojaDatos.vhoja_datos[0].hasOwnProperty(key)) {
            this.vhojaDatosForm.controls[key].setValue(hojaDatos.vhoja_datos[0][key]);
          }
        }
        for (var key in hojaDatos.vhoja_datos_consultorio[0]) {
          if (hojaDatos.vhoja_datos_consultorio[0].hasOwnProperty(key)) {
            this.vhojaDatosConsultorioForm.controls[key].setValue(
              hojaDatos.vhoja_datos_consultorio[0][key]
            );
          }
        }
        for (var key in hojaDatos.vhoja_datos_enfermeria[0]) {
          if (key != 'enf_hdatos') {
            if (hojaDatos.vhoja_datos_enfermeria[0].hasOwnProperty(key)) {
              this.vhojaDatosEnfermeriaForm.controls[key].setValue(
                hojaDatos.vhoja_datos_enfermeria[0][key]
              );
            }
          }
        }
        for (var key in hojaDatos.vhoja_datos_enfermeria[0].enf_hdatos[0]) {
          if (hojaDatos.vhoja_datos_enfermeria[0].enf_hdatos[0].hasOwnProperty(key)) {
            this.enfHdatosForm.controls[key].setValue(
              hojaDatos.vhoja_datos_enfermeria[0].enf_hdatos[0][key]
            );
          }
        }
      }else{

      }
    });
  }
  getEnfermeriaHoja(row: any) {
    var params = {
      opcion: 'L2',
      hojaid: row.hjid,
    };
    this.hemodialisisService.getHojaDatos(params).subscribe(res => {
      this.enfermeriaHoja = res.success.data[0].hj_datos[0];
      this.enfermeriaHojaDatos = res.success.data[0].hj_datos[0].enf_hdatos[0];
    });
  }
  obtAtenConsultorio() {
    var params = {
      _cen_id: this.CODIGO_HOSPITAL,
    };
    this.hemodialisisService.listarAtenciones(params).subscribe(res => {
      this.responde = res;
      if (this.responde.success.data != null) {
        this.datos_pacientesConsultorio = this.responde.success.data;
        this.dataSource = new MatTableDataSource(this.datos_pacientesConsultorio);
        this.ngAfterViewInit();
      } else {
        this.datos_pacientesConsultorio = [];
        this.dataSource = new MatTableDataSource(this.datos_pacientesConsultorio);
        this.ngAfterViewInit();
      }
    });
  }
  getLaboratorio(row: any) {
    this.variable = row;
    //  console.log('Variable Row  : ', row);
    this.nombreCompletoLab = ' ' + row.nombres + ' ' + row.paterno + ' ' + row.materno + ' ';
    this.showLaboratorio();
    this.recuperaDatosPaciente(row);
    this.recuperaDatosLabosSP(row);
  }

  generaLaboratorioMensual() {
    // console.log(' this.variable  :', this.variable);
    //  console.log('recupera Otros datos del paciente', this.recuperaPaciente);
    //  console.log('purebbaabbaa', this.variableLab);
    let Lab = {
      num: 0,
      num1: this.variable.hjid,
      num2: 1,
      json_dat: [
        {
          lab_periodo: 'mensual',
          lab_laboratorios: [
            {
              cod: 1,
              plabid: this.variableLab.codigo,
              plabnom: this.variableLab.laboratorio,
              plabperid: this.variableLab.opciones,
              plabpernom: this.variableLab.programado,
            },
          ],
          lab_soltransf: 'programada',
          lab_grpsanguineo: this.FormMensual.value.grupo_sanguineo,
          lab_sgrtotal: this.FormMensual.value.Sangre_Total,
          lab_criopre: this.FormMensual.value.Crioprecipitados,
          lab_paqglobul: this.FormMensual.value.Paquete_Globular,
          lab_antirregul: this.FormMensual.value.Anticuerpos_Irregulares,
          lab_plsmacongelado: this.FormMensual.value.Plasma_Fresco_Congelado,
          lab_plsmanormal: this.FormMensual.value.Plasma_Normal,
          lab_concentrplaq: this.FormMensual.value.Concentrado_De_Plaquetas,
          lab_globrojlavados: this.FormMensual.value.Globulos_Rojos_Lavados,
          lab_otros: this.FormMensual.value.otros,
          lab_activeotros: this.FormMensual.value.Nada,
        },
      ],
      dat: 'I',
    };
    // console.log('BODY LAB---- : ', Lab);
    this.hemodialisisService.sp_abm_laboratorio(Lab).subscribe(res => {
      var response = res;
    });
    // console.log('  Response  final ');
    // console.log('GeneraLabo Mensual GENERADO: ', Lab);
  }
  onSubmitHoja() {
    //  console.log("Variable trae : ", this.variable);
    //  console.log("Variable VpacId : ", this.recuperaVpacId);
    let body = {
      num: this.variable.hjid,
      num1: this.recuperaVpacId,
      json_dat: [
        {
          hoja_fhemo: this.vhojaDatosForm.value.hoja_fhemo,
          hoja_maqid: this.vhojaDatosForm.value.hoja_maqid,
          hoja_nrodial: this.vhojaDatosForm.value.hoja_nrodial,
          hoja_edad: this.vhojaDatosForm.value.hoja_edad,
          hoja_estatura: this.vhojaDatosForm.value.hoja_estatura,
          hoja_accvas: this.vhojaDatosForm.value.hoja_accvas,
          hoja_fistula: this.vhojaDatosForm.value.hoja_fistula,
          hoja_riesgo: this.vhojaDatosForm.value.hoja_riesgo,
          hoja_cateter: this.vhojaDatosForm.value.hoja_cateter,
          hoja_catusados: this.vhojaDatosForm.value.hoja_catusados,
          hoja_initultimocat: this.vhojaDatosForm.value.hoja_initultimocat,
          hoja_nrodias: this.vhojaDatosForm.value.hoja_nrodias,
          hoja_observacion: this.vhojaDatosForm.value.hoja_observacion,
        },
      ],
      json_dat1: [
        {
          enf_pesoseco: this.vhojaDatosEnfermeriaForm.value.enf_pesoseco,
          enf_pesoprehd: this.vhojaDatosEnfermeriaForm.value.enf_pesoprehd,
          enf_pesoposthd: this.vhojaDatosEnfermeriaForm.value.enf_pesoposthd,
          enf_temppre: this.vhojaDatosEnfermeriaForm.value.enf_temppre,
          enf_temppost: this.vhojaDatosEnfermeriaForm.value.enf_temppost,
          enf_filtro: this.vhojaDatosEnfermeriaForm.value.enf_filtro,
          enf_filtrouso: this.vhojaDatosEnfermeriaForm.value.enf_filtrouso,
          enf_lineas: this.vhojaDatosEnfermeriaForm.value.enf_lineas,
          enf_lineasuso: this.vhojaDatosEnfermeriaForm.value.enf_lineasuso,
          enf_responsable: this.vhojaDatosEnfermeriaForm.value.enf_responsable,
          enf_primming: this.vhojaDatosEnfermeriaForm.value.enf_primming,
          enf_ptm: this.vhojaDatosEnfermeriaForm.value.enf_ptm,
          enf_parterial: this.vhojaDatosEnfermeriaForm.value.enf_parterial,
          enf_pvenosa: this.vhojaDatosEnfermeriaForm.value.enf_pvenosa,
          enf_qb: this.vhojaDatosEnfermeriaForm.value.enf_qb,
          enf_qd: this.vhojaDatosEnfermeriaForm.value.enf_qd,
          enf_sodioprescrip: this.vhojaDatosEnfermeriaForm.value.enf_sodioprescrip,
          enf_bicarbonato: this.vhojaDatosEnfermeriaForm.value.enf_bicarbonato,
          enf_k: this.vhojaDatosEnfermeriaForm.value.enf_k,
          enf_ca: this.vhojaDatosEnfermeriaForm.value.enf_ca,
          enf_temperatura: this.vhojaDatosEnfermeriaForm.value.enf_temperatura,
          enf_uf: this.vhojaDatosEnfermeriaForm.value.enf_uf,
          enf_perfsodio: this.vhojaDatosEnfermeriaForm.value.enf_perfsodio,
          enf_perfuf: this.vhojaDatosEnfermeriaForm.value.enf_perfuf,
          enf_ktvonline: this.vhojaDatosEnfermeriaForm.value.enf_ktvonline,
          enf_ktvonlineval: this.vhojaDatosEnfermeriaForm.value.enf_ktvonlineval,
          enf_anticoagu: this.vhojaDatosEnfermeriaForm.value.enf_anticoagu,
          enf_anticoagucont: this.vhojaDatosEnfermeriaForm.value.enf_anticoagucont,
          enf_anticoagufrac: this.vhojaDatosEnfermeriaForm.value.enf_anticoagufrac,
          enf_hfin: this.vhojaDatosEnfermeriaForm.value.enf_hfin,
          enf_hinit: this.vhojaDatosEnfermeriaForm.value.enf_hinit,
          enf_hdatos: this.vhojaDatosEnfermeriaForm.value.enf_hdatos,
        },
      ],
      json_dat2: [
        {
          cnsl_diagnosticos: this.vhojaDatosConsultorioForm.value.cnsl_diagnosticos,
          cnsl_subanam_predial: this.vhojaDatosConsultorioForm.value.cnsl_subanam_predial,
          cnsl_objanam_predial: this.vhojaDatosConsultorioForm.value.cnsl_objanam_predial,
          cnsl_arritmia: this.vhojaDatosConsultorioForm.value.cnsl_arritmia,
          cnsl_ansiedad: this.vhojaDatosConsultorioForm.value.cnsl_ansiedad,
          cnsl_despltrocar: this.vhojaDatosConsultorioForm.value.cnsl_despltrocar,
          cnsl_doltorax: this.vhojaDatosConsultorioForm.value.cnsl_doltorax,
          cnsl_calambres: this.vhojaDatosConsultorioForm.value.cnsl_calambres,
          cnsl_disfaccv: this.vhojaDatosConsultorioForm.value.cnsl_disfaccv,
          cnsl_emboliare: this.vhojaDatosConsultorioForm.value.cnsl_emboliare,
          cnsl_cefalea: this.vhojaDatosConsultorioForm.value.cnsl_cefalea,
          cnsl_ematomafis: this.vhojaDatosConsultorioForm.value.cnsl_ematomafis,
          cnsl_has: this.vhojaDatosConsultorioForm.value.cnsl_has,
          cnsl_convulsiones: this.vhojaDatosConsultorioForm.value.cnsl_convulsiones,
          cnsl_otros: this.vhojaDatosConsultorioForm.value.cnsl_otros,
          cnsl_otrosdescrip: this.vhojaDatosConsultorioForm.value.cnsl_otrosdescrip,
          cnsl_hipotension: this.vhojaDatosConsultorioForm.value.cnsl_hipotension,
          cnsl_mareos: this.vhojaDatosConsultorioForm.value.cnsl_mareos,
          cnsl_reacdesinf: this.vhojaDatosConsultorioForm.value.cnsl_reacdesinf,
          cnsl_infmiocardio: this.vhojaDatosConsultorioForm.value.cnsl_infmiocardio,
          cnsl_nauseas: this.vhojaDatosConsultorioForm.value.cnsl_nauseas,
          cnsl_rupfiltro: this.vhojaDatosConsultorioForm.value.cnsl_rupfiltro,
          cnsl_parocr: this.vhojaDatosConsultorioForm.value.cnsl_parocr,
          cnsl_vomitos: this.vhojaDatosConsultorioForm.value.cnsl_vomitos,
          cnsl_ruplineas: this.vhojaDatosConsultorioForm.value.cnsl_ruplineas,
          cnsl_sangramiento: this.vhojaDatosConsultorioForm.value.cnsl_sangramiento,
          cnsl_sindrouso: this.vhojaDatosConsultorioForm.value.cnsl_sindrouso,
          cnsl_trombosis: this.vhojaDatosConsultorioForm.value.cnsl_trombosis,
          cnsl_observacion: this.vhojaDatosConsultorioForm.value.cnsl_observacion,
          cnsl_indicaciones: this.vhojaDatosConsultorioForm.value.cnsl_indicaciones,
          cnsl_tiempo: this.vhojaDatosConsultorioForm.value.cnsl_tiempo,
          cnsl_ultrafiltrado: this.vhojaDatosConsultorioForm.value.cnsl_ultrafiltrado,
          cnsl_sodio: this.vhojaDatosConsultorioForm.value.cnsl_sodio,
          cnsl_temperatura: this.vhojaDatosConsultorioForm.value.cnsl_temperatura,
          cnsl_potasio: this.vhojaDatosConsultorioForm.value.cnsl_potasio,
          cnsl_calcio: this.vhojaDatosConsultorioForm.value.cnsl_calcio,
          cnsl_qb: this.vhojaDatosConsultorioForm.value.cnsl_qb,
          cnsl_qd: this.vhojaDatosConsultorioForm.value.cnsl_qd,
          cnsl_heparina: this.vhojaDatosConsultorioForm.value.cnsl_heparina,
          cnsl_presc_obs: this.vhojaDatosConsultorioForm.value.cnsl_presc_obs,
        },
      ],
      dat: 'U3',
      num2: this.variable.hc_siis,
      num3: this.CODIGO_HOSPITAL,
      num4: 1,
      json_dat3: [
        {
          cnsl_alergia: this.vhojaDatosConsultorioForm.value.cnsl_alergias,
        },
      ],
      dat1: 'antiguo',
    };
    //console.log("BODY : ", body);
    this.hemodialisisService.sp_abm_PacienteHoja(body).subscribe(res => {
      var response = res;
    });
    // console.log("OnSubmitHoja GENERADO: ", body);
  }
  imprimirReporte() {
    //this.enfermeriaHojaDatos = {};
    //    var tamañoPrimero = this.enfermeriaHojaDatos.length;
    var data_table = '';
    for (var i = 0; i < this.enfermeriaHoja.enf_hdatos.length; i++) {
      data_table =
        data_table +
        '<tr>' +
        '<td>' +
        this.enfermeriaHoja.enf_hdatos[i].enf_hora +
        '</td>' +
        '<td>' +
        this.enfermeriaHoja.enf_hdatos[i].enf_pa +
        '</td>' +
        '<td>' +
        this.enfermeriaHoja.enf_hdatos[i].enf_fc +
        '</td>' +
        '<td>' +
        this.enfermeriaHoja.enf_hdatos[i].enf_temp +
        '</td>' +
        '<td>' +
        this.enfermeriaHoja.enf_hdatos[i].enf_fs +
        '</td>' +
        '<td>' +
        this.enfermeriaHoja.enf_hdatos[i].enf_pvenosa +
        '</td>' +
        '<td>' +
        this.enfermeriaHoja.enf_hdatos[i].enf_ptm +
        '</td>' +
        '<td>' +
        this.enfermeriaHoja.enf_hdatos[i].enf_condu +
        '</td>' +
        '</tr>';
    }
    var AccesoVascular = this.variable.hjaccvascular;
    var fistu = '';
    var catet = '';
    // console.log("Valor de acceso vascular   : ", AccesoVascular);
    //(sessionStorage.getItem('NOMBRE_HOSPITAL')?.toUpperCase() || 'HOSPITAL COTAHUMA' )
    if (AccesoVascular == 'Z992') {
      fistu = 'x';
      catet = '';
    } else {
      fistu = '';
      catet = 'x';
    }
    var printContenidos =
      '<html>' +
      '<head>' +
      '<style>' +
      'table {' +
      'font-size:12px;' +
      'border-collapse:collapse;' +
      '}' +
      'tr:first-child { border-top: none; }' +
      'tr:last-child { border-bottom: none; }' +
      'td:first-child { border-left: none; }' +
      'td:last-child { border-right: none; }' +
      'p { font-size: 10px;' +
      'font-size-adjust: 1; ' +
      '}' +
      '</style>' +
      '</head>' +
      '<body>' +
      '<div>' +
      "<FONT FACE='arial'>" +
      "<table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
      '<tr>' +
      '<td>' +
      '&nbsp;' +
      '</td>' +
      "<td width='120' height='90'>" +
      "<img style='float:left;' src='../../../assets/images/logosInstitucionales/logo1.png' width='110' height='80' alt='IMAGEN' border='0' align='left'>" +
      '</td>' +
      "<td align='left'>" +
      "<table width='98%' border='0' cellspacing='0' cellpadding='5'>" +
      '<tr>' +
      '<td>' +
      '<h3><center><strong>' +
      'HOSPITAL COTAHUMA' +
      '</strong><br>' +
      '<br>' +
      '<strong> Detalle de Procedimientos de Hemodialisis </strong><br>' +
      '<br>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '</td>' +
      "<td width='120' height='90'>" +
      "<img style='float:right;' src='../../../assets/images/logosInstitucionales/igob24-7.png' width='110' height='80' alt='IMAGEN' border='0' align='left'>" +
      '</td>' +
      '<td>' +
      '&nbsp;' +
      '</td>' +
      '</tr>' +
      '</table><br>' +
      '<form>' +
      "<table width='100%' border='2' cellspacing='1' cellpadding='5'>" +
      '<tr>' +
      "<td align='left' width='20%'><p><strong>Historia Clínica</strong></p></td>" +
      "<td align='left' width='32%'>" +
      (this.variable.hc_sice || '') +
      '</td>' +
      "<td align='left' width='12%'><p><strong>Cedula de Identidad</strong></p></td>" +
      "<td align='left' width='12%'>" +
      (this.recuperaPaciente.vpac_datos[0].pac_nro_ci || '') +
      '</td>' +
      "<td align='left' width='12%'><p><strong>No: SES HD</strong></p></td>" +
      "<td align='left' width='12%'>" +
      (this.variable.hjanrodial || '') +
      '</td>' +
      '</tr>' +
      '<tr>' +
      "<td align='left' width='20%'><p><strong>Nombres y Apellidos</strong></p></td>" +
      "<td align='left' width='32%'>" +
      (this.variable.nombres || '') +
      ' ' +
      (this.variable.paterno || '') +
      ' ' +
      (this.variable.materno || '') +
      '</td>' +
      "<td align='left' width='12%'><p><strong>Edad</strong></p></td>" +
      "<td align='left' width='12%'>" +
      (this.recuperaPaciente.vpac_datos[0].pac_edad || '') +
      '</td>' +
      "<td align='left' width='12%'><p><strong>Fecha</strong></p></td>" +
      "<td align='left' width='12%'> " +
      (this.variable.hjfecha || '') +
      ' </td>' +
      '</tr>' +
      '</table>' +
      '<br>' +
      "<table width='100%'' border='2' cellspacing='1' cellpadding='5'>" +
      '<tr>' +
      "<td align='left' width='12%'><p><strong>Peso seco</strong></p></td>" +
      "<td align='left' width='8%'>" +
      (this.enfermeriaHoja.enf_pesoseco || '') +
      '</td>' +
      "<td align='left' width='12%'><p><strong>Maquina No.</strong></p></td>" +
      "<td align='left' width='8%'>" +
      (this.variable.hjaidmaq || '') +
      '</td>' +
      "<td align='left' width='12%'><p><strong>Tipo de Filtro</strong></p></td>" +
      "<td align='left' width='8%'>" +
      (this.enfermeriaHoja.enf_filtro || '') +
      '</td>' +
      "<td align='left' width='12%'><p><strong>Devol</strong></p></td>" +
      "<td align='left' width='8%'>" +
      (this.enfermeriaHoja.enf_devol || '') +
      '</td>' +
      "<td align='left' width='12%'><p><strong>P/A Ingreso</strong></p></td>" +
      "<td align='left' width='8%'> " +
      (this.enfermeriaHoja.enf_parterial || '') +
      '</td>' +
      '</tr>' +
      '<tr>' +
      "<td align='left' width='12%'><p><strong>Peso ingreso</strong></p></td>" +
      "<td align='left' width='8%'>" +
      (this.enfermeriaHoja.enf_pesoprehd || '') +
      '</td>' +
      "<td align='left' width='12%'><p><strong>Ultrafiltración Sesión</strong></p></td>" +
      "<td align='left' width='8%'>" +
      (this.enfermeriaHoja.enf_us || '') +
      '</td>' +
      "<td align='left' width='12%'><p><strong>Reutilización Filtro</strong></p></td>" +
      "<td align='left' width='8%'>" +
      (this.enfermeriaHoja.enf_filtrouso || '') +
      '</td>' +
      "<td align='left' width='12%'><p><strong>Heparina:</strong></p></td>" +
      "<td align='left' width='8%'>" +
      (this.enfermeriaHoja.enf_heparina || '') +
      '</td>' +
      "<td align='left' width='12%'><p><strong>Ingest:</strong></p></td>" +
      "<td align='left' width='8%'></td>" +
      '</tr>' +
      '<tr>' +
      "<td align='left' width='12%'><p><strong>Peso Egreso</strong></p></td>" +
      "<td align='left' width='8%'>" +
      (this.enfermeriaHoja.enf_pesoposthd || '') +
      '</td>' +
      "<td align='left' width='12%'><p><strong>Ultrafiltración Final</strong></p></td>" +
      "<td align='left' width='8%'>" +
      (this.enfermeriaHoja.enf_uf || '') +
      '</td>' +
      "<td align='left' width='12%'><p><strong>Reutilización lineas A/V </strong></p></td>" +
      "<td align='left' width='8%'>" +
      (this.enfermeriaHoja.enf_lineasuso || '') +
      '</td>' +
      "<td align='left' width='12%'><p><strong>K/TV</strong></p></td>" +
      "<td align='left' width='8%'>" +
      (this.enfermeriaHoja.enf_ktvonlineval || '') +
      '</td>' +
      "<td align='left' width='12%'><p><strong></strong></p></td>" +
      "<td align='left' width='8%'></td>" +
      '</tr>' +
      '</table>' +
      "<table width='100%' border='0' cellspacing='0' cellpadding='5'>" +
      '<tr>' +
      "<td align='left' width='50%'></td>" +
      "<td align='left' width='50%'><strong>Evaluación de Enfermeria:</strong></td>" +
      '</tr>' +
      '</table>' +
      "<table width='100%' border='0' cellspacing='0' cellpadding='5'>" +
      '<tr>' +
      "<td width='50%'>" +
      "<table width='100%' border='2'>" +
      '<tr>' +
      "<td width='12%'><p><strong>Hora</strong></p></td>" +
      "<td width='12%'><p><strong>PA</strong></p></td>" +
      "<td width='12%'><p><strong>FC</strong></p></td>" +
      "<td width='12%'><p><strong>Temp.</strong></p></td>" +
      "<td width='12%'><p><strong>Flujo de Sangre</strong></p></td>" +
      "<td width='12%'><p><strong>PVenosa</strong></p></td>" +
      "<td width='12%'><p><strong>PTM</strong></p></td>" +
      "<td width='12%'><p><strong>Conductividad/SIIS</strong></p></td>" +
      '</tr>' +
      '<tr>' +
      (data_table || '') +
      '</tr>' +
      '</table>' +
      '<br>' +
      "<table width='50%'' border='0'>" +
      '<tr>' +
      "<td width='30%'><strong>Acceso Vacular:</strong></td>" +
      "<td width='20%'></td>" +
      '</tr>' +
      '</table>' +
      "<table width='50%'' border='1'>" +
      '<tr>' +
      "<td width='10%'><strong>Fistula</strong></td>" +
      "<td width='20%'>" +
      (fistu || '') +
      '</td>' +
      "<td width='10%'><strong>Cateter</strong></td>" +
      "<td width='20%'>" +
      (catet || '') +
      '</td>' +
      '</tr>' +
      '</table>' +
      '</td>' +
      "<td width='50%'>" +
      "<textarea cols='50%' rows='10'>" +
      (this.enfermeriaHoja.enf_evaluacion || '') +
      '</textarea>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      "<table width='100%' border='0' cellspacing='0' cellpadding='5'>" +
      '<tr>' +
      "<td align='left' width='100%'><strong>Evaluación Clínica durante la sesión:</strong></td>" +
      '</tr>' +
      '</table>' +
      "<table width='100%' border='0' cellspacing='0' cellpadding='5'>" +
      '<tr>' +
      "<td width='100%'><textarea cols='105%' rows='5'>" +
      (this.recuperaCompleto.cnsl_subanam_predial || '') +
      '  ' +
      this.recuperaCompleto.cnsl_objanam_predial +
      '</textarea></td>' +
      '</tr>' +
      '</table>' +
      "<table width='100%' border='0' cellspacing='0' cellpadding='5'>" +
      '<tr>' +
      "<td align='left' width='50%'><strong>Tratamiento y/o recomendaciones:</strong></td>" +
      "<td align='left' width='50%'><strong>Medicamentos Utilizados:</strong></td>" +
      '</tr>' +
      '</table>' +
      "<table width='100%' border='0' cellspacing='0' cellpadding='5'>" +
      '<tr>' +
      "<td width='50%'><textarea cols='50%' rows='5'>" +
      (this.recuperaCompleto.cnsl_presc_obs || '') +
      '</textarea></td>' +
      "<td width='50%'><textarea cols='50%' rows='5'>" +
      (this.enfermeriaHoja.enf_medicamentos || '') +
      '</textarea></td>' +
      '</tr>' +
      '</table>' +
      '<br><br><br><br>' +
      "<table width='100%' border='0' cellspacing='0' cellpadding='5'>" +
      '<tr>' +
      "<td><center><hr style='border:1px dashed black; width:80%'/></td>" +
      "<td><center><hr style='border:1px dashed black; width:80%'/></td>" +
      "<td><center><hr style='border:1px dashed black; width:80%'/></td>" +
      '</tr>' +
      '<tr>' +
      '<td><center><b>Firma y sello del Nefrólogo</b><br>  </center></td>' +
      '<td><center><b>Firma y sello lic. Enfermería</b><br></center></td>' +
      '<td><center><b>Firma y Nombre del Paciente</b></center></td>' +
      '</tr>' +
      '</table><br>' +
      '</form>' +
      '</font>' +
      '</div>' +
      '</body>' +
      '</html>';
    this.popupWin = window.open('', '_blank', 'width=800,height=800');
    this.popupWin.document.open();
    this.popupWin.document.write(
      '<html><head></head><body onload="window.print()">' + printContenidos + '<br><br></html>'
    );
    this.popupWin.document.close();
  }
  guardar(data: any) {
    //  console.log('GUARDAR', data);
    //  console.log(' this.variable  :', this.variable);
    //  console.log('recupera Otros datos del paciente', this.recuperaPaciente);
    //  console.log('Variable contiene selecciones', this.variableLab);
    //  console.log('Varialbe Fecha contiene fehca de labo', this.variableFecha);

    //var data_table = '';
    //  console.log('----------', this.variableLab.length);
    // console.log('------2222----', this.variableLab.length());

    for (var i = 0; i < this.variableLab.length; i++) {
      // this.data_table = this.variableLab[i].codigo[i];
      // data_table = this.variableLab[i].descripcion;
      // data_table = this.variableLab[i].laboratorio;
      // data_table = this.variableLab[i].opciones;
      // data_table = this.variableLab[i].programado;
      //  console.log('----aaa------', this.variableLab[i]);
      this.data_table.push({
        codigo: this.variableLab[i].codigo[i],
        descripcion: this.variableLab[i].descripcion,
        laboratorio: this.variableLab[i].laboratorio,
        lab_descripcion_anual:this.FormMensual.value.unidad_descripcion_anual,
        opciones: this.variableLab[i].opciones,
        programado: this.variableLab[i].programado,
      });
    }
    // console.log('Valor de la tabla', this.data_table);
    let Lab = {
      num: 0,
      num1: this.variable.hjid,
      num2: 1,
      json_dat: [
        {
          lab_periodo: this.variableFecha.mes,

          lab_laboratorios: this.data_table,

          lab_soltransf: this.valorSolicitud,
          lab_grpsanguineo: this.FormMensual.value.grupo_sanguineo,
          lab_sgrtotal: this.FormMensual.value.Sangre_Total,
          lab_criopre: this.FormMensual.value.Crioprecipitados,
          lab_paqglobul: this.FormMensual.value.Paquete_Globular,
          lab_antirregul: this.FormMensual.value.Anticuerpos_Irregulares,
          lab_plsmacongelado: this.FormMensual.value.Plasma_Fresco_Congelado,
          lab_plsmanormal: this.FormMensual.value.Plasma_Normal,
          lab_concentrplaq: this.FormMensual.value.Concentrado_De_Plaquetas,
          lab_globrojlavados: this.FormMensual.value.Globulos_Rojos_Lavados,
          lab_otros: this.FormMensual.value.otros,
          lab_activeotros: this.FormMensual.value.Nada,
        },
      ],
      dat: 'I',
    };
    // console.log('BODY LAB---- : ', Lab);
    this.hemodialisisService.sp_abm_laboratorio(Lab).subscribe(res => {
      var response = res;
    });
    // console.log('  Response  final ');
    // console.log('GeneraLabo Mensual GENERADO: ', Lab);
  }


/////////////////////////////////////////////////// FIN BRYAN //////////////////////////////////////////////////


  agregarA(data: any) {
    console.log('ANUAL', data);
    this.array_laboratorio_programado_anual[this.contador_laboratorio_programado_anual] = {
      codigo: this.contador_laboratorio_programado_anual + 1,
      laboratorio: data.laboratorio,
      programado: data.mes,
      opciones: 'H',
      descripcion: data.descripcion,
    };
    console.log(this.array_laboratorio_programado_anual);
    this.dataSourcesAnual = new MatTableDataSource<any>(this.array_laboratorio_programado_anual);
    this.contador_laboratorio_programado_anual = this.contador_laboratorio_programado_anual + 1;
  }

  procedimientoForm = this.formBuilder.group({
    vpaciente: ['', Validators.required],
    vsiis: [null],
    vmedico: [''],
    vhoja_id: [null],
    vhoja_pac_id: [null],
    vhoja_fecha: [''],
    vhoja_datos: this.vhojaDatosForm,
    vhoja_datos_enfermeria: this.vhojaDatosEnfermeriaForm,
    vhoja_datos_consultorio: this.vhojaDatosConsultorioForm,
  });
  displayedColumns: string[] = [
    'serial',
    'siis',
    'sice',
    'nombres',
    'paterno',
    'materno',
    'codigo',
    'edad',
    'fecha',
    'opciones',
  ];

  showListConsultorio() {
    this.isVisibleListPaciente = true;
    this.isVisibleFormDatosPaciente = false;
    this.isVisibleFormMedicamentos = false;
    this.isVisibleLaboratorio = false;
  }
  showFormDatosPaciente() {
    this.isVisibleListPaciente = false;
    this.isVisibleFormDatosPaciente = true;
    this.isVisibleFormMedicamentos = false;
    this.isVisibleLaboratorio = false;
  }
  showFormMedicamentos() {
    this.isVisibleListPaciente = false;
    this.isVisibleFormDatosPaciente = false;
    this.isVisibleFormMedicamentos = true;
    this.isVisibleLaboratorio = false;
  }
  showLaboratorio() {
    this.isVisibleListPaciente = false;
    this.isVisibleFormDatosPaciente = false;
    this.isVisibleFormMedicamentos = false;
    this.isVisibleLaboratorio = true;
  }
  listConsultorio(type: string, event: MatDatepickerInputEvent<Date>) {
    this.titleSection = 'Registro de Laboratorios y Examenes del Paciente';
    const fechaCadena = JSON.stringify(event.value);
    const fecha = fechaCadena.substring(1, 11);
    var params = {
      _cen_id: this.CODIGO_HOSPITAL,
      fecha_hoja: fecha,
    };
    this.hemodialisisService.buscar(params).subscribe(res => {
      this.responde = res;
      if (this.responde.success.data != null) {
        this.datos_pacientesConsultorio = this.responde.success.data;
        this.dataSource = new MatTableDataSource(this.datos_pacientesConsultorio);
        this.ngAfterViewInit();
      } else {
        this.datos_pacientesConsultorio = [];
        this.dataSource = new MatTableDataSource(this.datos_pacientesConsultorio);
        this.ngAfterViewInit();
      }
    });
  }


  generarRegistroResultadosNuevaHoja() {
    var printContents = `
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
                        <p align="center"><font face="Lucida Console"><span style="font-size:20pt;">INFORME 
                        DIARIO DEL SERVICIO DE RAYOS X</span></font></p>
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
                          <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="left"><font face="Lucida Console"><span style="font-size:12pt;">RADIOLOGO 
                          DE TURNO: </span></font></p>
                      </td>
                  </tr>
                  <tr>
                      <td width="1704">
                          <p style="lin-height:100%; margin-top:0; margin-bottom:0;" align="left"><font face="Lucida Console"><span style="font-size:12pt;">HORARIO:</span></font></p>
                      </td>
                  </tr>
                  <tr>
                      <td width="1704">
                          <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="left"><font face="Lucida Console"><span style="font-size:12pt;">FECHA:</span></font></p>
                      </td>
                  </tr>
              </table>
            </div>
            <table border="1" width="100%">
              <tr>
                  <td width="20" rowspan="2">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">N°</span></font></p>
                  </td>
                  <td width="60" rowspan="2">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">NUMERO 
                      DE EC</span></font></p>
                  </td>
                  <td width="80" rowspan="2">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">APELLIDO 
                      PATERNO</span></font></p>
                  </td>
                  <td width="80" rowspan="2">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">APELLIDO 
                      MATERNO</span></font></p>
                  </td>
                  <td width="70" rowspan="2">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">NOMBRES</span></font></p>
                  </td>
                  <td width="40" rowspan="2">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">EDAD</span></font></p>
                  </td>
                  <td width="106" colspan="3">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">TIPO 
                      DE PACIENTE</span></font></p>
                  </td>
                  <td width="68" colspan="2">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">SEXO</span></font></p>
                  </td>
                  <td width="142" colspan="4">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">SERVICIO 
                      DE ORIGEN</span></font></p>
                  </td>
                  <td width="150" rowspan="2">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">ESPECIALIDAD</span></font></p>
                  </td>
                  <td width="150" rowspan="2">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">MEDICO 
                      SOLICITANTE</span></font></p>
                  </td>
                  <td width="151" rowspan="2">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">ESTUDIO 
                      SOLICITADO</span></font></p>
                  </td>
                  <td width="140" colspan="2">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">INFORME 
                      COMPLEMENTARIO</span></font></p>
                  </td>
                  <td width="366" colspan="10">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">TAMAÑO 
                      DE PLACA RADIOGRAFICA</span></font></p>
                  </td>
              </tr>
              <tr>
                  <td width="31" valign="middle" align="center">
                      <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="center"><font face="Lucida Console"><span style="font-size:12pt;">LEY<br/>475<br/><br/> 
                      </span></font></p>
                  </td>
                  <td width="32" align="center" valign="middle">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">INST.</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">SOAT</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">F</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">M</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">EXT.</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">C.E.<br/></span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">HOS.<br/></span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">EMER.</span></font></p>
                  </td>
                  <td width="67" align="center">
                      <p><font face="Lucida Console" ><span style="font-size:12pt;">SI</span></font></p>
                  </td>
                  <td width="67" align="center">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">NO</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">1<br/>8<br/>x<br/>2<br/>4<br/>c<br/>m<br/></span></font></p>
                  </td>
                  <td width="32" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">2<br/>0<br/>x<br/>2<br/>5<br/>c<br/>m<br/></span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">2<br/>4<br/>x<br/>3<br/>0<br/>c<br/>m</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">2<br/>5<br/>x<br/>3<br/>0<br/>c<br/>m</span></font></p>
                  </td>
                  <td width="32" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">3<br/>0<br/>x<br/>4<br/>0<br/>c<br/>m</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">3<br/>5<br/>x<br/>3<br/>5<br/>c<br/>m</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">3<br/>5<br/>x<br/>4<br/>3<br/>c<br/>m</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">O<br/>D<br/>O<br/>N<br/></span></font></p>
                      <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="center"></p>
                      <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="center"><font face="Lucida Console"><span style="font-size:12pt;">3<br/>x<br/>4<br/>c<br/>m</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p align="center"><font face="Lucida Console"><span style="font-size:12pt;">P<br/>E<br/>R.<br/></span></font></p>
                      <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="center"></p>
                      <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="center"><font face="Lucida Console"><span style="font-size:12pt;">P<br/>E<br/>D.<br/></span></font></p>           
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">T<br/>O<br/>T<br/>A<br/>L</span></font></p>
                  </td>
              </tr>
              
              <tr>
                  <td width="20">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="60">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="80">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="80">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="70">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="40">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" valign="middle" align="center">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="32" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="150">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="150">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="151">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="67">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="67">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="32" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="32" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
              </tr>
              <tr>
                  <td width="20" style="border:0">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="60" style="border:0">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="80" style="border:0">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="80" style="border:0">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">&nbsp;</span></font></p>
                  </td>
                  <td width="116" colspan="2">
                      <p><font face="Lucida Console"><span style="font-size:12pt;">TOTAL:</span></font></p>
                  </td>

                  <td width="31" valign="middle" align="center">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="32" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="150" style="border:0">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="306" >
                      <p><font face="Lucida Console"><span style="font-size:12pt;">TOTAL:</span></font></p>
                  </td>
                  <td width="306" align="center">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="67" align="center">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="67" align="center">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="32" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="32" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="31" align="center" valign="middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
                  <td width="31" align="center" valign="5u3m middle">
                      <p><font face="Lucida Console"><span style="font-size:12pt;"></span></font></p>
                  </td>
              </tr>
            </table>
            <table border="0" width="100%">
              <tr>
                  <td width="70%">
                      <p align="right">&nbsp;</p>
                      <p align="right">&nbsp;</p>
                  </td>
                  <td width="30%">
                      <p align="center" style="line-height:100%; margin-top:0; margin-bottom:0;">&nbsp;</p>
                      <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="center">&nbsp;</p>
                      <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="center">&nbsp;</p>
                      <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="center">&nbsp;</p>
                      <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="center">&nbsp;</p>
                      <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="center"><font face="Lucida Console"><span style="font-size:12pt;">____________________________________</span></font></p>
                      <p style="line-height:100%; margin-top:0; margin-bottom:0;" align="center"><font face="Lucida Console"><span style="font-size:12pt;">Firma 
                      y sello</span></font></p>
                  </td>
              </tr>
            </table>
            </body>

            </html>

    `;
    return printContents;
  }

  onSubmit() {
    console.log(this.procedimientoForm.value);
    console.log("ID DE LA HOJA", this.hojaId);
    var params = {
      "_hj_id": this.hojaId,
      "_pac_id": 0,
      "_hj_data": [
        this.procedimientoForm.value.vhoja_datos
      ],
      "_hj_data_enf": [
        this.procedimientoForm.value.vhoja_datos_enfermeria
      ],
      "_hj_data_consul": [
        this.procedimientoForm.value.vhoja_datos_consultorio
      ],
      "opcion": "U2",
      "idsiis": 0,
      "hspid": this.idhosp,
      "usrid": 1,
      "alergias": [
        {}
      ],
      "tipo": ""
    }

    this.hemodialisisService.updateHemoEnfermeria(params).subscribe(res => {
      var response = res;
    });
  }

  volver() {
    this.showListConsultorio();
  }

  eliminarLaboraorioProgrmado(row: any) {
    console.log('DATOS', row);
    var cont = 0;
    var new_array = [];
    for (let index = 0; index < this.array_laboratorio_programado.length; index++) {
      if (this.array_laboratorio_programado[index].codigo != row) {
        new_array[cont] = this.array_laboratorio_programado[index];
        new_array[cont].codigo = cont + 1;
        cont = cont + 1;
      }
    }
    this.array_laboratorio_programado = new_array;
    this.dataSources = new MatTableDataSource<any>(this.array_laboratorio_programado);
    this.contador_laboratorio_programado = this.contador_laboratorio_programado - 1;
  }

  eliminar_laboraorio_array(event: StepperSelectionEvent) {
    this.array_laboratorio_programado = [];
    this.contador_laboratorio_programado = 0;
    this.dataSources = new MatTableDataSource<any>(this.array_laboratorio_programado);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSubmitLaboratorio() {
    const body = this.FormMensual.value;
    alert(body.unidad_servicio);
    console.log('labbb', alert);
  }
  getBase64(url: any) {
    return new Promise((resolve, reject) => {
      var image = new Image();
      image.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        var ctx: any = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        var dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      image.onerror = error => {
        reject(error);
      };
      image.src = url;
    });
  }

  imprimir() {
    console.log('ACCEDIO A IMPRIMIR');
  }
  data_table: any = [];
  operacionSeleccionada: string = 'suma';
  tipoOperaciones = ['suma', 'resta', 'multiplicacion', 'division'];

  radioButtonChange(data: MatRadioChange) {
    this.valorSolicitud = data.value;
  }

  /**  YEISON MEDICAMENTOS */

  medicamentos2: any = [];
  datosPac: any;
  getMedicamentos(row: any) {
    console.log("DAA", row);
    this.hojaId = row.hjid;
    this.datosPac = row;
    this.showFormMedicamentos();    
    var params = {
      "cod_pre": row.hjaccvascular
    }
    this.hemodialisisService.getMedicamentos(params).subscribe(res => {
      this.responde = res;
      console.log(this.responde);
      this.medicamentos2 = this.responde.success.data;
      console.log("Meddd", this.medicamentos2);
      for (var i = 0; i < this.medicamentos2.length; i++) {
        this.medicamentos2[i]["medi_dosis_recom"] = "";
        this.medicamentos2[i]["medi_modo_empl"] = "";
        this.medicamentos2[i]["medi_medi_cantidad"] = "";
        this.medicamentos2[i]["medi_pre_id"] = "";
      }
      this.medicamentos = this.medicamentos2;
      this.medicamentos = this.responde.success.data;
    });
    
    this.getDatosPaciente();
  }


  getDatosPaciente() {
    console.log("Datos del paciente", this.hojaId);
    var params = {
      "idpac": this.hojaId
    }
    this.hemodialisisService.getDatosPaciente(params).subscribe(res => {
      this.responde = res;
      console.log("RES", this.responde);
    });
  }

  njson: any;
  nuevaData: any = [];
  onSubmitMedicamento() { 
  }

  guardarDatos() {
    console.log("GUARDAR");
    console.log(this.nuevaData);
    //this.onSubmitMedicamento();
    console.log(this.medicamentos);
    console.log("DESPUES DE GUARDAR");
    var arrayDataPrint = [];
    for (var i = 0; i < this.medicamentos.length; i++) {
      if (this.medicamentos[i]["medi_dosis_recom"].trim() != "") {
        console.log("FOR",this.medicamentos[i]);
        var medicamentoPrint = {
          "medi_pre_id": this.medicamentos[i]["preid"],
          "medi_dosis_recom": this.medicamentos[i]["medi_dosis_recom"],
          "medi_modo_empl": this.medicamentos[i]["medi_modo_empl"],
          "medi_cantidad": this.medicamentos[i]["medi_cantidad"]
        }
        arrayDataPrint.push(medicamentoPrint);
      }
    }
    console.log("DATOS MED", arrayDataPrint);
    this.nuevaData = arrayDataPrint;
    console.log(this.nuevaData);

    var params = {
      "_pmed_id": 0,
      "_hj_id": this.hojaId,
      "_med_id": 1,
      "_pmed_data": this.nuevaData,
      "opcion": "I"
    }
    console.log("FERCHO", params);
    this.hemodialisisService.guardarMedicamento(params).subscribe(res => {
      this.responde = res;
      console.log("RES", this.responde);
    });
    var data_table = "";
    var aux1,aux2;
    console.log(this.medicamentos2);
    console.log(this.medicamentos2.length);
    for (var i = 0; i < this.medicamentos2.length; i ++) {
      console.log(i);
      /*for (var j = 0; j < this.nuevaData.length; j ++) {
        console.log(j);
        if (this.nuevaData[j].medi_pre_id == this.medicamentos2[i].preid) {
          console.log("VALIDOS", this.nuevaData[j].medi_pre_id);
          console.log(this.nuevaData[i]);
          aux1 = this.nuevaData[j].medi_modo_empl+" || "+this.nuevaData[j].medi_dosis_recom;
          //aux2 = dato.labdatos[i].medi_cantidad;
          aux2 = "";
        }               
      }*/
      console.log("AEAEA", this.nuevaData[i]);
      if (this.nuevaData[i] != "" && this.nuevaData[i] != null && this.nuevaData[i] != undefined) {
        aux1 = this.nuevaData[i].medi_modo_empl+" || "+this.nuevaData[i].medi_dosis_recom;
        aux2 = this.nuevaData[i].medi_cantidad;
      }else {
            aux1 = ""; aux2 = "";
      }
      data_table += "<tr><td>"+this.medicamentos2[i].nom_generico+"</td><td>"+aux1+"</td><td>&nbsp;</td><td>"+aux2+"</td><td>&nbsp;</td><td>&nbsp;</td></tr>";       
    }
    
    console.log(data_table);

    console.log("DATOS DEL CIUDADANO", this.datosPac);
    var nombre_completo = this.datosPac.nombres + " " +this.datosPac.paterno + " " +this.datosPac.materno;
    var arrayEdad = this.datosPac.hjedad.split(" ");
    console.log(arrayEdad);
    var edad = arrayEdad[0] + " " + arrayEdad[1];
    console.log("INGRESO AL GUARDADO");
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
                          <td colspan="2">Establecimiento: Unidad de Terapia Renal `+ (this.datosPac.nomcentro || " ") +`</td>
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
                          <td align="left">Sexo: `+ (this.datosPac.genero || " ") +`</td>
                          <td align="left">Fecha: `+ (this.datosPac.hjfecha || " ") +`</td>
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
                <td>`+this.medicamentos[0].med_costo+`</td>
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
    this.popupWin = window.open('', '_blank', '"outerWidth=600,width=500,innerWidth=400,resizable,scrollbars,status');
    this.popupWin.document.open();
    this.popupWin.document.write('<html><head></head><body onload="window.print()">' + printContents + '<br><br></html>');
    this.popupWin.document.close();
  }

  reimprimir() {
    console.log("REIMPRIMIR");
    this.dialog.open(DialogMedicamentosComponent, {
      disableClose: true,
      width: '1300px',
      data: {idHoja: this.hojaId, medicamentos: this.medicamentos2, datosPaciente: this.datosPac }
    }).afterClosed().subscribe(result => {
      console.log(result);
    });
  }


  /*  LABORATORIO  */

  reimprimirLab() {
    console.log("REIMPRIMIR LABORATORIO", this.hojaId);
    this.dialog.open(DialogLaboratoriosComponent, {
      disableClose: true,
      width: '1300px',
      data: {idHoja: this.hojaId, datosPaciente: this.datosPac}
    }).afterClosed().subscribe(result => {
      console.log(result);
    });
  }


  imprimirLab(){
    console.log("IMPRESION DE LABORATORIO");
    var estilo_prioridad = "";
    /*console.log(dato.labdatos[0].lab_soltransf);
    if (dato.labdatos[0].lab_soltransf == "urgente") {
        estilo_prioridad = `
            body {
              font-size: 16px;
            }
            body:after {
              content: "URGENTE"; 
              font-size: 10em;  
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
    }*/
    console.log(this.datosPac);    

    var nombre_completo = this.datosPac.nombres + " " +this.datosPac.paterno + " " +this.datosPac.materno;
    var arrayEdad = this.datosPac.hjedad.split(" ");
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
                            UNIDAD DE TERAPIA RENAL <br> 
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
                            <td colspan="2" class="border2" align="left">Establecimiento: </td>
                        </tr>
                        <tr>
                            <td width="50%" align="left" class="border2">Fecha de Solicitud: </td>
                            <td width="50%" align="left" class="border2">Nro de Registro</td>
                        </tr>
                        <tr>
                            <td align="left" class="border2">Nombres: </td>
                            <td>
                                <table width="100%" class="font2">
                                    <tr>
                                        <td width="50%" align="left" class="border2">Edad: </td>
                                        <td width="50%" align="left" class="border2">Sexo: </td>
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
                            UNIDAD DE TERAPIA RENAL <br> 
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
                            <td colspan="2" class="border2" align="left">Establecimiento: </td>
                        </tr>

                        <tr>
                            <td width="50%" class="border2" align="left">Fecha de Solicitud: </td>
                            <td width="50%" class="border2" align="left">Nro de Registro</td>
                        </tr>

                        <tr>
                            <td width="50%" class="border2" align="left">Nombres: </td>
                            <td width="50%">
                                <table width="100%" class="font2">
                                    <tr>
                                        <td width="50%" class="border2" align="left">Edad: </td>
                                        <td width="50%" class="border2" align="left">Sexo: </td>
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
    this.popupWin = window.open('', '_blank', '"outerWidth=600,width=500,innerWidth=400,resizable,scrollbars,status');
    this.popupWin.document.open();
    this.popupWin.document.write('<html><head></head><body onload="window.print()">' + printContents + '<br><br></html>');
    this.popupWin.document.close();
  }

}
