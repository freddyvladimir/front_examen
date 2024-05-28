import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HemodialisisService } from '../../hemodialisis.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

export interface DialogData {
  campos: any;
}
@Component({
  selector: 'app-dialog-registro-hoja',
  templateUrl: './dialog-registro-hoja.component.html',
  styleUrls: ['./dialog-registro-hoja.component.scss'],
})
export class DialogRegistroHojaComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  ID_USUARIO = sessionStorage.getItem('IDUSUARIO');
  public seleccionar: boolean = false;
  public seleccionar2: boolean = false;

  newForm: FormGroup;
  disableSelect: any;
  aux: any;
  idCombo: any;
  idComboMaq: any;
  idAccesoVasc: any;
  idCombi2: any;
  idCombo3: any;
  variable_combo1: any;
  variable_combo2: any;
  varialbe_combo3: any;
  response: any = [];
  JsonHoja: any = [];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      //datos de calendario
      fechaSesion: Date;
      //------------
      servicioMaquina: string;
      nroDial: number;
      nombres: string;
      edad: string;
      estatura: number;
      //aqui se selecciona el combo 'Cateter' || 'Fistula'
      accesoVascular: string;
      //Cateter
      cateter: string;
      nroCatetersUsados: number;
      inicioUltimoCateter: Date;
      nroDias: number;
      //opcion combo Fistula
      fistula: string;
      riesgo: string;
      //Observaciones General para todos
      observaciones: string;
    },
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogRegistroHojaComponent>,
    private HemdialisisServices: HemodialisisService
  ) {
    this.aux = this.data;
    this.disableSelect = new FormControl(true);
    this.newForm = this.fb.group({
      var_fechaSesion: ['', Validators.required],
      fecha_session: ['', Validators.required],
      servicio_maquina: [this.aux.campos.maqid, Validators.required],
      nro_dial: ['', Validators.required],
      _nombres: [
        this.aux.campos.pacnom + ' ' + this.aux.campos.pacpat + ' ' + this.aux.campos.pacmat,
        Validators.required,
      ], //
      _edad: [this.aux.campos.vedad, Validators.required], //
      _estatura: ['', Validators.required],
      var_accVascular: ['', Validators.required],
      _fistula: ['', Validators.required],
      _riesgo: ['', Validators.required],
      var_cateter: ['', Validators.required],
      var_nroCateterUsds: ['', Validators.required],
      var_fechaCateter: ['', Validators.required],
      var_nroDias: ['', Validators.required],
      var_observaciones: ['', Validators.required],
      var_pacid: [this.aux.campos.pacid, Validators.required],
      var_asid: [this.aux.campos.asid, Validators.required],
    });
  }
  fechSes: any;
  fechIni: any;
  ngOnInit(): void {
    // console.log("valos de aux campos macnom",this.aux.campos.pacpat)
    //console.log("Valor de aux ", this.aux.campos);
    this.combo1(this.CODIGO_HOSPITAL);
    this.combo2(this.CODIGO_HOSPITAL);
    this.pacientes_asignados(this.CODIGO_HOSPITAL);
    // console.log("Valor de form ", this.newForm.value);
    // console.log("---------------", this.aux.campos.asid)
  }
  fechaSesion(type: string, event: MatDatepickerInputEvent<Date>) {
    const fechaCadena = JSON.stringify(event.value);
    const fecha = fechaCadena.substring(1, 11);
    // console.log("Fecha para la Sesion *******---- : ", fecha);
    this.fechSes = fecha;
  }
  fechaInicioCateter(type: string, event: MatDatepickerInputEvent<Date>) {
    const fechaCadena = JSON.stringify(event.value);
    const fechaIni = fechaCadena.substring(1, 11);
    //  console.log("Fecha inicio ultimo Cateter ----------....: ", fechaIni);
    this.fechIni = fechaIni;
  }
  combo1(idhosp: any) {
    this.HemdialisisServices.lst_maquinas(idhosp).subscribe(resp => {
      this.variable_combo1 = resp.success.data;
      //   console.log("Datos de combo1 :", this.variable_combo1);
    });
  }
  combo2(idhosp: any) {
    this.HemdialisisServices.lst_tipo_vascular(idhosp).subscribe(resp2 => {
      this.variable_combo2 = resp2.success.data;
      //    console.log("Datos de combo2 :", this.variable_combo2);
    });
  }
  pacientes_asignados(idhosp: any) {
    this.HemdialisisServices.lst_asignados(idhosp).subscribe(res => {
      this.response = res.success.data;
      //   console.log("Lista de pacientes asignados : ", this.response);
    });
  }
  valueComboMaquina(dato: any) {
    this.idComboMaq = dato;
    //  console.log("VALOR DE COMBO MAQUINAS :", this.idComboMaq);
  }
  valuesAccesoVascualr(dato: any) {
    this.idAccesoVasc = dato;
    console.log('Datos del combo de Acceso Vascular : ', this.idAccesoVasc);
    if (this.idAccesoVasc == 'Z992') {
      this.seleccionar = true;
      this.seleccionar2 = false;
    } else if ((this.idAccesoVasc = 'Z491')) {
      this.seleccionar2 = true;
      this.seleccionar = false;
    }
  }

  valueCombo(dato: any) {
    this.idCombo = dato;
    //  console.log("VALOR DE COMBO AccesoVascualr :", this.idCombo);
    if (this.idCombo == 19) {
      console.log('fistula');
      this.seleccionar = true;
      this.seleccionar2 = false;
    } else if (this.idCombo == 14) {
      console.log('catetter');
      this.seleccionar2 = true;
      this.seleccionar = false;
    }
  }
  guardaRegistro() {
    // console.log("///////////////////////--- Monstrando el valor de Form despues del click", this.newForm.value);

    this.JsonHoja.push({
      hoja_fecha_hemodia: this.fechSes,
      hoja_maquinaHemo: this.newForm.value.servicio_maquina,
      hoja_nroDial: this.newForm.value.nro_dial,
      hoja_nombre_apellidos: this.newForm.value._nombres,
      hoja_edad: this.newForm.value._edad,
      hoja_estatura: this.newForm.value._estatura,
      hoja_acceso_vascular: this.newForm.value.var_accVascular,
      hoja_fistula: this.newForm.value._fistula,
      hoja_riesgo: this.newForm.value._riesgo,
      hoja_cateter: this.newForm.value.var_cateter,
      hoja_nro_catet_usados: this.newForm.value.var_nroCateterUsds,
      hoja_ini_ultimo_catet: this.fechIni,
      hoja_nro_dias: this.newForm.value.var_nroDias,
      hoja_observaciones: this.newForm.value.var_observaciones,
    });
    //  console.log(" JSON HOJA :", this.JsonHoja);
    const JsonHoja = JSON.stringify(this.JsonHoja);
    //  console.log('Convirtiendo en una cadena de texto json pero : ', JsonHoja);
    this.dialogRef.close(JsonHoja);
  }
  onSubmit(parametros: any) {
   // console.log(parametros);
   // console.log("sssssss",this.newForm.value.nro_dial);
    if (
      this.newForm.value.nro_dial != null &&
      this.newForm.value.nro_dial != undefined &&
      this.newForm.value.nro_dial != ''
      || this.newForm.value._estatura != null
    ) {
      let body = {
        _hj_id: 1, // si se envia con "_hj_id"=0 no genera nro de hoja para consultorio y enfermeria
        _pac_id: this.newForm.value.var_pacid,
        _hj_data: [
          {
            hoja_fhemo: this.fechSes,
            hoja_maqid: this.newForm.value.servicio_maquina,
            hoja_nrodial: this.newForm.value.nro_dial,
            hoja_edad: this.newForm.value._edad,
            hoja_estatura: this.newForm.value._estatura,
            hoja_accvas: this.newForm.value.var_accVascular,
            hoja_fistula: this.newForm.value._fistula,
            hoja_riesgo: this.newForm.value._riesgo,
            hoja_cateter: this.newForm.value.var_cateter,
            hoja_catusados: this.newForm.value.var_nroCateterUsds,
            hoja_initultimocat: this.fechIni,
            hoja_nrodias: this.newForm.value.var_nroDias,
            hoja_observacion: this.newForm.value.var_observaciones,
          },
        ],
        _hj_data_enf: [
          {
            enf_pesoseco: '',
            enf_pesoprehd: '',
            enf_pesoposthd: '',
            enf_temppre: '',
            enf_temppost: '',
            enf_filtro: '',
            enf_filtrouso: '',
            enf_lineas: '',
            enf_lineasuso: '',
            enf_responsable: '',
            enf_primming: '',
            enf_ptm: '',
            enf_parterial: '',
            enf_pvenosa: '',
            enf_qb: '',
            enf_qd: '',
            enf_sodioprescrip: '',
            enf_bicarbonato: '',
            enf_k: '',
            enf_ca: '',
            enf_temperatura: '',
            enf_uf: '',
            enf_perfsodio: '',
            enf_perfuf: '',
            enf_ktvonline: '',
            enf_ktvonlineval: '',
            enf_anticoagu: '',
            enf_anticoagucont: '',
            enf_anticoagufrac: '',
            enf_hfin: '',
            enf_hinit: '',
            enf_hdatos: [],
          },
        ],
        _hj_data_consul: [
          {
            cnsl_alergia: '',
            cnsl_diagnosticos: '',
            cnsl_subanam_predial: '',
            cnsl_objanam_predial: '',
            cnsl_arritmia: false,
            cnsl_ansiedad: false,
            cnsl_despltrocar: false,
            cnsl_doltorax: false,
            cnsl_calambres: false,
            cnsl_disfaccv: false,
            cnsl_emboliare: false,
            cnsl_cefalea: false,
            cnsl_ematomafis: false,
            cnsl_has: false,
            cnsl_convulsiones: false,
            cnsl_otros: false,
            cnsl_hipotension: false,
            cnsl_mareos: false,
            cnsl_reacdesinf: false,
            cnsl_infmiocardio: false,
            cnsl_nauseas: false,
            cnsl_rupfiltro: false,
            cnsl_parocr: false,
            cnsl_vomitos: false,
            cnsl_ruplineas: false,
            cnsl_sangramiento: false,
            cnsl_sindrouso: false,
            cnsl_trombosis: false,
          },
        ],
        opcion: 'I',
        idsiis: this.newForm.value.var_pacid,
        hspid: this.CODIGO_HOSPITAL,
        usrid: this.ID_USUARIO,
        alergias: [{}],
        tipo: '',
      };
      //  console.log("Mostrando el contenido de LET despues del click", body);
      this.HemdialisisServices.updateHemoEnfermeria(body).subscribe(resp => {
        this.response = resp;
        this.dialogRef.close('true');
        //  console.log("Listado de datos body", this.response);
        const respuestaDinamic = this.response.success.data;
        //  console.log("Listado de datos body", respuestaDinamic);
      });
    } else {
      console.log('no ingeress id');
    }
  }
}
/*
{
  "_hj_id": 1,
    "_pac_id": 0,
      "_hj_data": [
        {}
      ],a
        "_hj_data_enf": [
          {
            "opcion": "L2",
            "hojaid": 1,
            "descripcion": "prueba"
          }
        ],
          "_hj_data_consul": [
            {}
          ],
            "opcion": "U2",
              "idsiis": 0,
                "hspid": 5,
                  "usrid": 1,
                    "alergias": [
                      {}
                    ],
                      "tipo": ""
}
*/
