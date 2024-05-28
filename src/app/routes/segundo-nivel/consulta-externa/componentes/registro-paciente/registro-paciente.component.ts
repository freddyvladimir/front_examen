import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConsultaExternaService } from '../../consulta-externa.service';
import { parse } from 'querystring';

@Component({
  selector: 'app-registro-paciente',
  templateUrl: './registro-paciente.component.html',
  styleUrls: ['./registro-paciente.component.scss']
})
export class RegistroPacienteComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  //formDatosPaciente: FormGroup;
  /////////////////
  fileToUpload: any = null;
  img: any = "assets/images/incognito.png";
  //////////servicios/////////
  sql: any;
  responde: any;
  //////////servicios/////////
  @Input() tipo: any;
  @Input() codigoPaciente: any;
  @Input() datosSice: any;

  datosSiis: any;
  dataHC: any;
  IDPACIENTE: any;
  listaTipoPaciente: any;
  latitud: any;
  longitud: any;
  distrito: any;
  macroDistrito: any;
  zona: any;
  @Output() retornarDatos = new EventEmitter();
  @Output() guardarDatos = new EventEmitter();
  //////////fechas/////////
  mes: any;
  dia: any;
  fech_mod: any;
  //////////fechas///////// 
  formDatosPaciente: any = {};
  optionsNacionalidad: any[] = [];
  filteredOptionsNacionalidad: any;
  optionsProvincia: any[] = [];
  filteredOptionsProvincia: any;
  optionsMunicipios: any[] = [];
  optionsProfesion: any[] = [];
  filteredOptionsProfesion: any;

  optionsIdiomaNativo: any[] = [];
  filteredOptionsIdiomaNativo: any;
  optionsProvinciaDP: any[] = [];
  filteredOptionsProvinciaDP: any;
  optionsMunicipiosDP: any[] = [];
  optionsZonaDP: any[] = [];
  filteredOptionsZonaDP: any;

  constructor(
    fb: FormBuilder,
    private toastr: ToastrService,
    private http: ConsultaExternaService
  ) {
    this.formDatosPaciente = fb.group({
      nombre: ['', [Validators.required]],
      apellidoMaterno: [''],
      apellidoPaterno: [''],
      edad: [{ value: '', disabled: true }],
      ci: [''],
      duplicado: [''],
      expedido: [''],
      fechaNacimiento: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      nacionalidad: new FormControl(""),
      lugarNacimiento: [''],
      provincia: new FormControl(""),
      municipio: [''],
      estadoCivil: [''],
      telefono: [''],
      celular: [''],
      email: ['', [Validators.email]],
      profesion: new FormControl(""),
      idiomaNativo: new FormControl(""),
      direccion: [''],
      observaciones: [''],
      departamentoDP: [''],
      provinciaDP: new FormControl(""),
      municipioDP: [''],
      zonaDP: new FormControl(""),
      lugar: [''],
      direccionLaboral: [''],
      telefonoLaboral: [''],
      respDeFamilia: [''],
      padreTutor: [''],
      madre: [''],
      telefonoRF: [''],
      conyuge: [''],
      otros: [''],
      nombreAcompananteDPMP: [''],
      relacionDPMP: [''],
      ciudadDPMP: [''],
      zonaDPMP: [''],
      direccionDPMP: [''],
      telefonoDPMP: [''],
      avatar: [''],
      tipo_paciente: ['', [Validators.required]],
      sice: ['']
    });
    setTimeout(() => {
      if (this.tipo == "N-CE" || this.tipo == "M-CE") {
        this.formDatosPaciente = fb.group({
          nombre: ['', [Validators.required]],
          apellidoMaterno: ['', [Validators.required]],
          apellidoPaterno: ['', [Validators.required]],
          edad: [{ value: '', disabled: true }],
          ci: [''],
          duplicado: [''],
          expedido: [''],
          fechaNacimiento: ['', [Validators.required]],
          genero: ['', [Validators.required]],
          nacionalidad: new FormControl(""),
          lugarNacimiento: ['', [Validators.required]],
          provincia: new FormControl("", { validators: Validators.required }),
          municipio: ['', [Validators.required]],
          estadoCivil: ['', [Validators.required]],
          telefono: [''],
          celular: [''],
          email: ['', [Validators.email]],
          profesion: new FormControl("", { validators: Validators.required }),
          idiomaNativo: new FormControl("", { validators: Validators.required }),
          direccion: ['', [Validators.required]],
          observaciones: [''],

          departamentoDP: ['', [Validators.required]],
          provinciaDP: new FormControl("", { validators: Validators.required }),
          municipioDP: ['', [Validators.required]],
          zonaDP: new FormControl("", { validators: Validators.required }),

          lugar: [''],
          direccionLaboral: [''],
          telefonoLaboral: [''],

          respDeFamilia: [''],
          padreTutor: [''],
          madre: [''],
          telefonoRF: [''],
          conyuge: [''],
          otros: [''],

          nombreAcompananteDPMP: [''],
          relacionDPMP: [''],
          ciudadDPMP: [''],
          zonaDPMP: [''],
          direccionDPMP: [''],
          telefonoDPMP: [''],

          avatar: [''],
          tipo_paciente: ['', [Validators.required]],
          sice: ['']
        });
      }
      if (this.tipo == "N-EM" || this.tipo == "M-EM" || this.tipo == "N-HE" || this.tipo == "M-HE") {
        this.formDatosPaciente = fb.group({
          nombre: ['', [Validators.required]],
          apellidoMaterno: [''],
          apellidoPaterno: [''],
          edad: [{ value: '', disabled: true }],
          ci: [''],
          duplicado: [''],
          expedido: [''],
          fechaNacimiento: ['', [Validators.required]],
          genero: ['', [Validators.required]],
          nacionalidad: new FormControl(""),
          lugarNacimiento: [''],
          provincia: new FormControl(""),
          municipio: [''],
          estadoCivil: [''],
          telefono: [''],
          celular: [''],
          email: ['', [Validators.email]],
          profesion: new FormControl(""),
          idiomaNativo: new FormControl(""),
          direccion: [''],
          observaciones: [''],

          departamentoDP: [''],
          provinciaDP: new FormControl(""),
          municipioDP: [''],
          zonaDP: new FormControl(""),

          lugar: [''],
          direccionLaboral: [''],
          telefonoLaboral: [''],

          respDeFamilia: [''],
          padreTutor: [''],
          madre: [''],
          telefonoRF: [''],
          conyuge: [''],
          otros: [''],

          nombreAcompananteDPMP: [''],
          relacionDPMP: [''],
          ciudadDPMP: [''],
          zonaDPMP: [''],
          direccionDPMP: [''],
          telefonoDPMP: [''],

          avatar: [''],
          tipo_paciente: ['', [Validators.required]],
          sice: ['', [Validators.required]]
        });
      }
    }, 1);

  }



  regresar() {
    this.retornarDatos.emit();
  }

  ngOnInit(): void {
    this.cargarTipoAtencion();
    this.listarTipoPaciente();
    this.cargarIdioma();
    this.cargarProfeciones();
    this.cargarPais();
    this.cargarZonas();
  }

  cargarTipoAtencion() {
    if (this.tipo == "M-CE" || this.tipo == "M-EM" || this.tipo == "M-HE") {
      this.verificarHc();
    }
  }

  private _filterNacionalidad(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.optionsNacionalidad.filter(option => option.pais_desc.toString().toLowerCase().includes(filterValue));
  }
  private _filterProvincia(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.optionsProvincia.filter(option => option.prov_nombre.toString().toLowerCase().includes(filterValue));
  }
  private _filterProfesion(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.optionsProfesion.filter(option => option.pro_descripcion.toString().toLowerCase().includes(filterValue));
  }
  private _filterIdiomaNativo(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.optionsIdiomaNativo.filter(option => option.ctlnombre.toString().toLowerCase().includes(filterValue));
  }
  private _filterProvinciaDP(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.optionsProvinciaDP.filter(option => option.prov_nombre.toString().toLowerCase().includes(filterValue));
  }
  private _filterZonaDP(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.optionsZonaDP.filter(option => option.zon_descripcion.toString().toLowerCase().includes(filterValue));
  }

  listarTipoPaciente() {
    try {
      this.sql = {
        tp_id_hospital: this.CODIGO_HOSPITAL
      };
      this.http.tipoSeguro(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.code == 200) {
          this.listaTipoPaciente = this.responde.success.data;
        } else {
          this.listaTipoPaciente = [];
        }
      });
    } catch (error) {
    }
  }

  cargarIdioma() {
    try {
      this.sql = {
        ctl_id_dependencia: "3"
      };
      this.http.listarIdioma(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.code == 200) {
          this.optionsIdiomaNativo = this.responde.success.data;
          this.filteredOptionsIdiomaNativo = this.formDatosPaciente.get('idiomaNativo').valueChanges.pipe(
            startWith(''),
            map(value => this._filterIdiomaNativo(this.formDatosPaciente.get('idiomaNativo').value || '')),
          );
        } else {
          this.optionsIdiomaNativo = [];
        }
      });
    } catch (error) {
    }
  }

  cargarProfeciones() {
    try {
      this.sql = {};
      this.http.listarProfesiones(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.code == 200) {
          this.optionsProfesion = this.responde.success.data;
          for (let x = 0; x < this.optionsProfesion.length; x++) {
            this.optionsProfesion[x].pro_descripcion = this.optionsProfesion[x].pro_descripcion.trim();
          }
          this.filteredOptionsProfesion = this.formDatosPaciente.get('profesion').valueChanges.pipe(
            startWith(''),
            map(value => this._filterProfesion(this.formDatosPaciente.get('profesion').value || '')),
          );
        } else {
          this.optionsIdiomaNativo = [];
        }
      });
    } catch (error) {
    }
  }

  cargarPais() {
    try {
      this.sql = {};
      this.http.listarPaises(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.code == 200) {
          this.optionsNacionalidad = this.responde.success.data;
          this.filteredOptionsNacionalidad = this.formDatosPaciente.get('nacionalidad').valueChanges.pipe(
            startWith(''),
            map(value => this._filterNacionalidad(this.formDatosPaciente.get('nacionalidad').value || '')),
          );
        } else {
          this.optionsIdiomaNativo = [];
        }
      });
    } catch (error) {
    }
  }

  cargarProvincias(data: any, tipo: any) {
    this.formDatosPaciente.get('provincia').setValue('');
    try {
      this.sql = {
        dep_codigo: data.toString()
      };
      this.http.listarProvincias(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.code == 200) {
          this.optionsProvincia = this.responde.success.data;
          for (let x = 0; x < this.optionsProvincia.length; x++) {
            this.optionsProvincia[x].prov_nombre = this.optionsProvincia[x].prov_nombre.trim();
            if (this.optionsProvincia[x].prov_codigo == tipo) {
              this.formDatosPaciente.get('provincia').setValue(this.optionsProvincia[x].prov_nombre);
            }
          }
          this.filteredOptionsProvincia = this.formDatosPaciente.get('provincia').valueChanges.pipe(
            startWith(''),
            map(value => this._filterProvincia(this.formDatosPaciente.get('provincia').value || '')),
          );
        } else {
          this.optionsProvincia = [];
        }
      });
    } catch (error) {
    }
  }

  cargarMinicipios(data: any, tipoP: any) {
    this.formDatosPaciente.get('municipio').setValue("");
    try {
      this.sql = {
        prov_codigo: data.prov_codigo
      };
      this.http.listarMunicipios(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.code == 200) {
          this.optionsMunicipios = this.responde.success.data;
          for (let x = 0; x < this.optionsMunicipios.length; x++) {
            this.optionsMunicipios[x].mun_nombre = this.optionsMunicipios[x].mun_nombre.trim();
            if (this.optionsMunicipios[x].mun_codigo == tipoP) {
              this.formDatosPaciente.get('municipio').setValue(this.optionsMunicipios[x].mun_codigo.toString());
            }
          }
        } else {
          this.optionsMunicipios = [];
        }
      });
    } catch (error) {
    }
  }

  cargarProvinciasDP(data: any, tipoD: any) {
    this.formDatosPaciente.get('provinciaDP').setValue('');
    try {
      this.sql = {
        dep_codigo: data.toString()
      };
      this.http.listarProvincias(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.code == 200) {
          this.optionsProvinciaDP = this.responde.success.data;
          for (let x = 0; x < this.optionsProvinciaDP.length; x++) {
            this.optionsProvinciaDP[x].prov_nombre = this.optionsProvinciaDP[x].prov_nombre.trim();
            if (this.optionsProvinciaDP[x].prov_codigo == tipoD) {
              this.formDatosPaciente.get('provinciaDP').setValue(this.optionsProvinciaDP[x].prov_nombre);
            }
          }
          this.filteredOptionsProvinciaDP = this.formDatosPaciente.get('provinciaDP').valueChanges.pipe(
            startWith(''),
            map(value => this._filterProvinciaDP(this.formDatosPaciente.get('provinciaDP').value || '')),
          );
        } else {
          this.optionsProvinciaDP = [];
        }
      });
    } catch (error) {
    }
  }

  cargarMinicipiosDP(data: any, tipoP: any) {
    this.formDatosPaciente.get('municipioDP').setValue("");
    try {
      this.sql = {
        prov_codigo: data.prov_codigo
      };
      this.http.listarMunicipios(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.code == 200) {
          this.optionsMunicipiosDP = this.responde.success.data;
          for (let x = 0; x < this.optionsMunicipiosDP.length; x++) {
            this.optionsMunicipiosDP[x].mun_nombre = this.optionsMunicipiosDP[x].mun_nombre.trim();
            if (this.optionsMunicipiosDP[x].mun_codigo == tipoP) {
              this.formDatosPaciente.get('municipioDP').setValue(this.optionsMunicipiosDP[x].mun_codigo.toString());
            }
          }
        } else {
          this.optionsMunicipiosDP = [];
        }
      });
    } catch (error) {
    }
  }

  cargarZonas() {
    try {
      this.sql = {
        emp_codigo: "20101"
      };
      this.http.listarZonas(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.code == 200) {
          this.optionsZonaDP = this.responde.success.data;
          this.filteredOptionsZonaDP = this.formDatosPaciente.get('zonaDP').valueChanges.pipe(
            startWith(''),
            map(value => this._filterZonaDP(this.formDatosPaciente.get('zonaDP').value || '')),
          );
        } else {
          this.optionsZonaDP = [];
        }
      });
    } catch (error) {
    }
  }

  getErrorMessage(form: FormGroup) {
    return form.get('email')?.hasError('required')
      ? 'validations.required'
      : form.get('email')?.hasError('email')
        ? 'validations.invalid_email'
        : '';
  }

  handleFileInput(event: any) {
    this.fileToUpload = event.target.files[0] ?? null;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.img = reader.result;
    };

  }

  guardarDatosPersonales() {
    this.guardarDatos.emit(this.IDPACIENTE);
    console.log("VALOR", this.formDatosPaciente.value);
    if (this.codigoPaciente) {
    }
    let cadena = '';
    cadena = cadena + "$$" + (this.formDatosPaciente.value.nombre || '') + "$$,";
    cadena = cadena + "$$" + (this.formDatosPaciente.value.apellidoPaterno || '') + "$$,";
    cadena = cadena + "$$" + (this.formDatosPaciente.value.apellidoMaterno || '') + "$$,";
    cadena = cadena + "$$" + (this.formDatosPaciente.value.ci || '') + "$$,";
    cadena = cadena + "$$" + (this.formDatosPaciente.value.genero || '') + "$$,";
    //cadena = cadena+"$$"+(this.http.comversor(this.formDatosPaciente.value.fechaNacimiento) || '')+"$$,";
    cadena = cadena + "$$" + (this.formDatosPaciente.value.direccion || '') + "$$,";
    cadena = cadena + "$$" + (this.formDatosPaciente.value.telefono || '') + "$$,";
    cadena = cadena + "$$" + (this.formDatosPaciente.value.expedido || '') + "$$,";

    cadena = cadena + "$$" + (this.distrito || '') + "$$,";
    cadena = cadena + "$$" + (this.macroDistrito || '') + "$$,";

    cadena = cadena + "$$1$$,";

    cadena = cadena + "$$" + (this.zona || '') + "$$,";

    cadena = cadena + "$$" + (this.formDatosPaciente.value.email || '') + "$$,";
    cadena = cadena + "$$" + (this.formDatosPaciente.value.duplicado || '') + "$$,";
    cadena = cadena + "$$" + (this.formDatosPaciente.value.lugarNacimiento || '') + "$$,";
    cadena = cadena + "" + this.codigoPaciente + ",";
    //cadena = cadena + "" + (this.formDatosPaciente.value.codigoSoap || '') + ",";
    cadena = cadena + "" + (this.CODIGO_HOSPITAL || '') + ",";
    cadena = cadena + "$$" + (this.latitud || '') + "$$,";
    cadena = cadena + "$$" + (this.longitud || '') + "$$,";
    cadena = cadena + "" + (this.formDatosPaciente.value.nacionalidad || '') + "";

    console.log("Datos", cadena);
    var estCiv = "";
    estCiv = estCiv + "" + (this.formDatosPaciente.value.estadoCivil || '') + "";
    console.log(estCiv);
    var fechaSumi = "";
    fechaSumi = "01/01/01"
    try {
      this.sql = {
        s_auditoria: 'null',
        i_operacion: '',
        i_tipo: 'D',
        i_Emp_Codigo: 20101,
        i_HCL_CODIGO: this.formDatosPaciente.value.sice,
        i_HCL_APPAT: this.formDatosPaciente.value.apellidoPaterno,
        i_HCL_APMAT: this.formDatosPaciente.value.apellidoMaterno,
        i_HCL_NOMBRE: this.formDatosPaciente.value.nombre,
        i_HCL_NUMCI: this.formDatosPaciente.value.ci,
        i_HCL_SEXO: this.formDatosPaciente.value.genero,
        i_HCL_FECNAC: this.formDatosPaciente.value.fechaNacimiento,
        i_DEP_CODIGO_RES: this.formDatosPaciente.value.departamentoDP,
        i_PRO_CODIGO_RES: parseInt(this.formDatosPaciente.value.provinciaDP),
        i_MUN_CODIGO_RES: parseInt(this.formDatosPaciente.value.municipioDP),
        i_HCL_ESTCIV: estCiv,
        i_HCL_DIRECC: this.formDatosPaciente.value.direccion,
        i_HCL_TELDOM: this.formDatosPaciente.value.telefono,
        i_PProCodPro: 15,
        i_HCL_LUGTRA: this.formDatosPaciente.value.lugar,
        i_HCL_DIRTRA: this.formDatosPaciente.value.direccionLaboral,
        i_HCL_TELTRA: this.formDatosPaciente.value.telefonoLaboral,
        i_HCL_NOMFAM: this.formDatosPaciente.value.respDeFamilia,
        i_HCL_TELFAM: this.formDatosPaciente.value.telefonoRF,
        i_HCL_NOMPAD: this.formDatosPaciente.value.padreTutor,
        i_HCL_NOMMAD: this.formDatosPaciente.value.madre,
        i_HCL_CodCSB: '',
        i_HCL_CodSegSoc: this.formDatosPaciente.value.observaciones,
        i_HCL_CodFam: 0,
        i_zon_codigo: 0,
        i_usuario: 1,
        i_DEP_CODIGO_NAC: this.formDatosPaciente.value.departamentoDP,
        i_PRO_CODIGO_NAC: parseInt(this.formDatosPaciente.value.provinciaDP),
        i_MUN_CODIGO_NAC: parseInt(this.formDatosPaciente.value.municipio),
        i_hc_alfa: '',
        i_hc_NivelEstudio: 0,
        i_HCL_SUMI: 'N',
        i_HCL_SUMI_FECHA: fechaSumi,
        i_HCL_TIPODOC: 0,
        i_SegSocial: 'N',
        i_Idioma: 0,
        i_IdiomaMaterno: 0,
        i_Autopertenencia: 0,
        i_LugarExpedicion: this.formDatosPaciente.value.expedido,
      };
      console.log("PARAMETROS", this.sql);
      this.http.insertarActualizarSice(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        console.log("this.responde", this.responde);
        if (this.responde.success.code == 200) {
          let data = this.responde.success.data;
        }
      });
    } catch (error) {
    }
  }

  calcularEdadActual(tipo: String, event: MatDatepickerInputEvent<Date>, fecha: String) {
    let fechaSelect;
    if (tipo == "M") {
      fechaSelect = this.http.comversor(event.value);
    } else {
      fechaSelect = fecha;
    }
    /*this.sql = {
      consulta: "select  (date_part($$year$$, age($$" + fechaSelect + "$$::date)))::text ||$$ años $$ ||(date_part($$month$$, age($$" + fechaSelect + "$$::date)))::text ||$$ meses $$ ||(date_part($$day$$, age($$" + fechaSelect + "$$::date)))::text ||$$ dias$$ as edad"
    };
    this.http.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        this.formDatosPaciente.controls['edad'].setValue(this.responde.success.data[0].sp_dinamico[0].edad);
      } else {

      }
    });*/
    console.log(fechaSelect);
    try {
      this.sql = {
        fecha_nacimiento: fechaSelect
      };
      this.http.listarEdad(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        console.log(this.responde);
        if (this.responde.success.code == 200) {
          this.formDatosPaciente.controls['edad'].setValue(this.responde.success.data[0].edad);
        } else {
        }
      });
    } catch (error) {
    }
  }

  comvertirFecha(fecha: any) {
    var asignado = fecha;
    var fecselect = new Date(asignado);
    this.mes = fecselect.getMonth() + 1;
    this.dia = fecselect.getDate()
    if (fecselect.getDate() < 10) {
      this.dia = "0" + this.dia;
    }
    if (fecselect.getMonth() < 9) {
      this.mes = "0" + this.mes;
    }
    this.fech_mod = (this.dia + 1) + "/" + this.mes + "/" + fecselect.getFullYear();
    return this.fech_mod;
  }


  listarPacientes() {

  }

  verificarHc() {
    try {
      this.sql = {
        hcl_codigoseg: this.datosSice.HC,
        hcl_hsp_id: this.CODIGO_HOSPITAL,
        type: 0
      };
      this.http.verificacionHc(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data.length > 0) {
          this.dataHC = this.responde.success.data;
          this.historialClinico(this.responde.success.data[0].hcl_dtspsl_id);
        } else {
          this.recuperarDatos();
        }
      });
    } catch (error) {
    }
  }

  historialClinico(hc: any) {
    try {
      this.sql = {
        _dtspsl_id: hc,
        _hsp_id: this.CODIGO_HOSPITAL
      };
      this.http.historialClinico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data.length > 0) {
          this.datosSiis = this.responde.success.data;
          this.recuperarDatos();
        } else {
          this.recuperarDatos();
        }
      });
    } catch (error) {
    }
  }

  async recuperarDatos() {
    this.formDatosPaciente.get('nombre').setValue(this.datosSice.dtspsl_nombres);
    this.formDatosPaciente.get('apellidoMaterno').setValue(this.datosSice.dtspsl_materno);
    this.formDatosPaciente.get('apellidoPaterno').setValue(this.datosSice.dtspsl_paterno);
    this.formDatosPaciente.get('ci').setValue(this.datosSice.dtspsl_ci);
    //this.formDatosPaciente.get('duplicado').setValue("");
    this.formDatosPaciente.get('expedido').setValue(parseInt(this.datosSice.dtspsl_expedido));
    this.formDatosPaciente.get('fechaNacimiento').setValue(this.datosSice.dtspsl_fec_nacimiento);
    this.calcularEdadActual('R', this.datosSice.dtspsl_fec_nacimiento, this.datosSice.dtspsl_fec_nacimiento);
    this.formDatosPaciente.get('genero').setValue(this.datosSice.dtspsl_sexo);
    try {
      for (let x = 0; x < this.optionsNacionalidad.length; x++) {
        if (this.optionsNacionalidad[x].pais_codigo == this.datosSiis[0].hcl_nacionalidad) {
          this.formDatosPaciente.get('nacionalidad').setValue(this.optionsNacionalidad[x].pais_desc);
        }
      }
    } catch (error) { }
    this.formDatosPaciente.get('lugarNacimiento').setValue(this.datosSice.hcl_dep_codigo_nac);
    this.cargarProvincias((this.datosSice.hcl_dep_codigo_nac).toString(), this.datosSice.PRO_CODIGO_NAC);
    const valor = { prov_codigo: this.datosSice.PRO_CODIGO_NAC.toString() }
    this.cargarMinicipios(valor, this.datosSice.hcL_num_codigo_nac);
    this.formDatosPaciente.get('estadoCivil').setValue(parseInt(this.datosSice.dtspsl_id_estado_civil));
    this.formDatosPaciente.get('telefono').setValue(this.datosSice.dtspsl_telefono);
    for (let x = 0; x < this.optionsProfesion.length; x++) {
      this.optionsProfesion[x].pro_descripcion = this.optionsProfesion[x].pro_descripcion.trim();
      if (this.optionsProfesion[x].pro_codigo == this.datosSice.dtspsl_ocupacion) {
        this.formDatosPaciente.get('profesion').setValue(this.optionsProfesion[x].pro_descripcion);
      }
    }
    for (let y = 0; y < this.optionsIdiomaNativo.length; y++) {
      if (this.optionsIdiomaNativo[y].ctlcodigo == this.datosSice.hcl_idioma) {
        this.formDatosPaciente.get('idiomaNativo').setValue(this.optionsIdiomaNativo[y].ctlnombre);
      }
    }
    this.formDatosPaciente.get('sice').setValue(this.datosSice.hcl_codigoseg);
    this.formDatosPaciente.get('direccion').setValue(this.datosSice.dtspsl_direccion);
    this.formDatosPaciente.get('departamentoDP').setValue(this.datosSice.hcl_codigo_res_dep);
    this.cargarProvinciasDP((this.datosSice.hcl_codigo_res_dep).toString(), this.datosSice.hcl_codigo_res_pro);
    const valor2 = { prov_codigo: this.datosSice.hcl_codigo_res_pro.toString() }
    this.cargarMinicipiosDP(valor2, this.datosSice.hcl_codigo_res_mun);
    for (let x = 0; x < this.optionsZonaDP.length; x++) {
      if (this.optionsZonaDP[x].zon_codigo == this.datosSice.zon_codigo) {
        this.formDatosPaciente.get('zonaDP').setValue(this.optionsZonaDP[x].zon_descripcion);
      }
    }
    console.log("----",this.dataHC);
    try {
      
      this.IDPACIENTE = this.dataHC[0].hcl_dtspsl_id;
      //sice
      this.formDatosPaciente.get('tipo_paciente').setValue(this.dataHC[0].hcl_tp_id);
      this.formDatosPaciente.get('celular').setValue(this.dataHC[0].dtspsl_celular);
      this.formDatosPaciente.get('email').setValue(this.dataHC[0].dtspsl_correo);
      this.formDatosPaciente.get('observaciones').setValue(this.dataHC[0].hcl_observaciones);
    } catch (error) { }
    this.formDatosPaciente.get('lugar').setValue(this.datosSice.hcl_lugar_trabajo);
    this.formDatosPaciente.get('direccionLaboral').setValue(this.datosSice.hcl_dir_trabajo);
    this.formDatosPaciente.get('telefonoLaboral').setValue(this.datosSice.hcl_tele_trabajo);

    this.formDatosPaciente.get('respDeFamilia').setValue(this.datosSice.hcl_nom_fam);
    this.formDatosPaciente.get('padreTutor').setValue(this.datosSice.hcl_nompa);
    this.formDatosPaciente.get('madre').setValue(this.datosSice.hcl_nom_mad);
    this.formDatosPaciente.get('telefonoRF').setValue(this.datosSice.hcl_telfam);
    try {
      this.formDatosPaciente.get('conyuge').setValue(this.datosSiis[0].hcl_conyuge);
      this.formDatosPaciente.get('otros').setValue(this.datosSiis[0].hcl_otras_personas);

      this.formDatosPaciente.get('nombreAcompananteDPMP').setValue(this.datosSiis[0].hcl_materno_proximo);
      this.formDatosPaciente.get('relacionDPMP').setValue(this.datosSiis[0].hcl_nombre_proximo);
      this.formDatosPaciente.get('ciudadDPMP').setValue(this.datosSiis[0].hcl_ciudad_proximo);
      this.formDatosPaciente.get('zonaDPMP').setValue(this.datosSiis[0].hcl_zona_proximo);
      this.formDatosPaciente.get('direccionDPMP').setValue(this.datosSiis[0].hcl_calle_proximo);
      this.formDatosPaciente.get('telefonoDPMP').setValue(this.datosSiis[0].hcl_telefono_proximo);
    } catch (error) { }
    this.formDatosPaciente.get('avatar').setValue("");
    //this.formDatosPaciente.get('codigoSoap').setValue("");    
  }


}
