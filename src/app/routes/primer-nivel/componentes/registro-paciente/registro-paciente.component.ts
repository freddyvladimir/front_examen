import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PrimerNivelService } from '../../primer-nivel.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registro-paciente',
  templateUrl: './registro-paciente.component.html',
  styleUrls: ['./registro-paciente.component.scss']
})
export class RegistroPacienteComponent implements OnInit {
  CODIGO_HOSPITAL = 10;
  formDatosPaciente: FormGroup;
  /////////////////
  fileToUpload: any = null;
	img:any = "assets/images/incognito.png";
  //////////servicios/////////
  sql: any;
  responde: any;
  //////////servicios/////////
  @Input() codigoPaciente: any;
  latitud:any;
  longitud:any;
  distrito:any;
  macroDistrito:any;
  zona:any;
  @Output() retornarDatos = new EventEmitter();
  //////////fechas/////////
  mes: any;
  dia: any;
  fech_mod: any;
  //////////fechas///////// 
  constructor(
    fb: FormBuilder,
    private http: PrimerNivelService,
    private toastr: ToastrService
  ) {
    
    this.formDatosPaciente = fb.group({
      nombre: ['', [Validators.required]],
      apellidoMaterno: ['', [Validators.required]],
      apellidoPaterno: ['', [Validators.required]],
      edad: [{ value: '', disabled: true }],
      ci: [''],
      duplicado: [''],
      expedido: [''],
      fechaNacimiento: ['', [Validators.required]],
      genero: [''],
      nacionalidad: [''],
      lugarNacimiento: ['', [Validators.required]],
      provincia: [''],
      municipio: [''],
      direccion: ['', [Validators.required]],
      telefono: [''],
      email: ['', [Validators.required, Validators.email]],      
      avatar: [''],
      codigoSoap: [''],
      observaciones: ['']
    });
    
  }

  regresar() {
    this.retornarDatos.emit();
  }

  ngOnInit(): void {
    console.log("---------codigoPaciente------",this.codigoPaciente);
    if (this.codigoPaciente) {
      this.obtenerDatos(this.codigoPaciente);  
    }else{
      this.codigoPaciente = 0;
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
    console.log(this.fileToUpload);
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        this.img = reader.result;
    };
    
	}

  guardarDatosPersonales(){
    console.log("this.formDatosPaciente.value.fechaNacimiento",this.formDatosPaciente.value.fechaNacimiento);
    console.log(this.http.comversor(this.formDatosPaciente.value.fechaNacimiento));
    
    if (this.codigoPaciente) {
      console.log("formDatosPaciente",this.formDatosPaciente.value);  
    }

    
    let cadena = '';
    cadena = cadena+"$$"+(this.formDatosPaciente.value.nombre || '')+"$$,";
    cadena = cadena+"$$"+(this.formDatosPaciente.value.apellidoPaterno || '')+"$$,";
    cadena = cadena+"$$"+(this.formDatosPaciente.value.apellidoMaterno || '')+"$$,";
    cadena = cadena+"$$"+(this.formDatosPaciente.value.ci || '')+"$$,";
    cadena = cadena+"$$"+(this.formDatosPaciente.value.genero || '')+"$$,";
    cadena = cadena+"$$"+(this.http.comversor(this.formDatosPaciente.value.fechaNacimiento) || '')+"$$,";
    cadena = cadena+"$$"+(this.formDatosPaciente.value.direccion || '')+"$$,";
    cadena = cadena+"$$"+(this.formDatosPaciente.value.telefono || '')+"$$,";
    cadena = cadena+"$$"+(this.formDatosPaciente.value.expedido || '')+"$$,";

    cadena = cadena+"$$"+(this.distrito || '')+"$$,";
    cadena = cadena+"$$"+(this.macroDistrito || '')+"$$,";
    
    cadena = cadena+"$$1$$,";
    
    cadena = cadena+"$$"+(this.zona || '')+"$$,";

    cadena = cadena+"$$"+(this.formDatosPaciente.value.email || '')+"$$,";
    cadena = cadena+"$$"+(this.formDatosPaciente.value.duplicado || '')+"$$,";
    cadena = cadena+"$$"+(this.formDatosPaciente.value.lugarNacimiento || '')+"$$,";
    cadena = cadena+""+this.codigoPaciente+",";
    cadena = cadena+""+(this.formDatosPaciente.value.codigoSoap || '')+",";
    cadena = cadena+""+(this.CODIGO_HOSPITAL || '')+",";
    cadena = cadena+"$$"+(this.latitud || '')+"$$,";
    cadena = cadena+"$$"+(this.longitud || '')+"$$,";
    cadena = cadena+""+(this.formDatosPaciente.value.nacionalidad || '')+"";
    console.log("cadena",cadena);
    this.sql = {
      consulta: "select * from primer_nivel.sp_insertar_datos_datos_pacinte("+cadena+")"
    };
    this.http.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        console.log("sp_insertar_datos_datos_pacinte",this.responde.success.data[0].sp_dinamico);
        this.toastr.success('Registro modificado ' , '', {
          timeOut: 2000,
          progressBar: true,
          closeButton: true,
          newestOnTop: false,
          extendedTimeOut: 0,
          tapToDismiss: false
        });
      } else {
        
      }
    });
  }
  
  recuperarDatos(data:any){
    console.log("retorna",data);
    this.latitud = data.lat;
    this.longitud = data.lon;
    this.macroDistrito = data.macro;
    this.distrito = data.distrito;
    this.zona = data.zona;
    
  }
  calcularEdadActual(tipo:String,event: MatDatepickerInputEvent<Date>,fecha:String ){
    let fechaSelect;
    if (tipo == "M") {
      fechaSelect = this.http.comversor(event.value);
    } else {
      fechaSelect = fecha;
    }
    this.sql = {
      consulta: "select * from primer_nivel.sp_calcular_edad_actual($$"+fechaSelect+"$$)"
    };
    this.http.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        console.log("sp_calcular_edad_actual",this.responde.success.data[0].sp_dinamico);
        this.formDatosPaciente.controls['edad'].setValue(this.responde.success.data[0].sp_dinamico[0].edad_actual);
      } else {
        
      }
    });
    console.log("fechaSelect--->",fechaSelect);
    console.log("(this.formDatosPaciente.value.ci || '')--->",(this.formDatosPaciente.value.ci || ''));
    //this.formDatosPaciente.disable();
    if (this.formDatosPaciente.value.ci) {
      //this.Sus(fechaSelect,this.formDatosPaciente.value.ci); 
    }
    //this.comvertirFecha(fechaSelect);
  }
  comvertirFecha(fecha: any) {
    /*fecha = fecha.toString();
    if (fecha.length >= 11) {*/
    console.log("0------->",fecha);
      var asignado = fecha;
      var fecselect = new Date(asignado);
      console.log("2------->",fecselect);
      this.mes = fecselect.getMonth() + 1;
      this.dia = fecselect.getDate()
      if (fecselect.getDate() < 10) {
        this.dia = "0" + this.dia;
      }
      if (fecselect.getMonth() < 9) {
        this.mes = "0" + this.mes;
      }
      this.fech_mod = (this.dia+1) + "/" + this.mes + "/" + fecselect.getFullYear();
    //}
    console.log("3------->",this.fech_mod);
    
    return this.fech_mod;
  }
  Sus(fecha:any,ci:any){
    console.log("entra");
    try {
      this.sql = {
        "ci": ci,//"8332409",
        "fecha_nacimiento": this.comvertirFecha(fecha)//"18/04/1991"
      };
      this.http.servicioSus(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        console.log("this.responde ------->",this.responde.response.datos);
        let datosSus = this.responde.response.datos;
        if (datosSus.code == 200) {
          console.log("datosSus----->",datosSus.data.ci);
          this.formDatosPaciente.controls['nombre'].setValue(datosSus.data.nombres);
          this.formDatosPaciente.controls['apellidoMaterno'].setValue(datosSus.data.segundoapellido);
          this.formDatosPaciente.controls['apellidoPaterno'].setValue(datosSus.data.primerapellido);
          this.formDatosPaciente.controls['ci'].setValue(datosSus.data.ci);
          this.formDatosPaciente.controls['duplicado'].setValue(datosSus.data.complemento);
          //this.formDatosPaciente.controls['expedido'].setValue(datosSus.data.ci);
          this.formDatosPaciente.controls['fechaNacimiento'].setValue(datosSus.data.fechanacimiento);
          this.formDatosPaciente.controls['genero'].setValue(datosSus.data.sexo);

          this.formDatosPaciente.controls['nacionalidad'].setValue(datosSus.data.nacionalidad.toString());
          
          //this.formDatosPaciente.controls['lugarNacimiento'].setValue(datosSus.data.ci);
          //this.calcularEdadActual('R',datosSus.data.fechanacimiento,datosSus.data.fechanacimiento);
          this.formDatosPaciente.controls['direccion'].setValue(datosSus.data.direccion);
          this.formDatosPaciente.controls['telefono'].setValue(datosSus.data.telefono);
          this.formDatosPaciente.controls['email'].setValue(datosSus.data.correoelectronico);
        }
        /*this.formDatosPaciente.controls['nombre'].setValue(dataRecuperada.rec_nombres);
        this.formDatosPaciente.controls['apellidoMaterno'].setValue(dataRecuperada.rec_materno);
        this.formDatosPaciente.controls['apellidoPaterno'].setValue(dataRecuperada.rec_paterno);
        this.formDatosPaciente.controls['ci'].setValue(dataRecuperada.rec_ci);
        this.formDatosPaciente.controls['duplicado'].setValue(dataRecuperada.rec_complemento);
        this.formDatosPaciente.controls['expedido'].setValue(dataRecuperada.rec_expedido);
        this.formDatosPaciente.controls['fechaNacimiento'].setValue(dataRecuperada.rec_fec_nacimiento);
        this.formDatosPaciente.controls['genero'].setValue(dataRecuperada.rec_sexo);

        this.formDatosPaciente.controls['nacionalidad'].setValue(dataRecuperada.rec_nacionalidad.toString());
        
        this.formDatosPaciente.controls['lugarNacimiento'].setValue(dataRecuperada.rec_lugar_nac);
        this.calcularEdadActual('R',dataRecuperada.rec_fec_nacimiento,dataRecuperada.rec_fec_nacimiento);
        this.formDatosPaciente.controls['direccion'].setValue(dataRecuperada.rec_direccion);
        this.formDatosPaciente.controls['telefono'].setValue(dataRecuperada.rec_telefono);
        this.formDatosPaciente.controls['email'].setValue(dataRecuperada.rec_correo);*/
      });
    } catch (error) {
      console.log("------>>>>>>",error);
      
    }
  }
  obtenerDatos(id:number) {
    this.sql = {
      consulta: "select * from primer_nivel.sp_recuperar_datos_paciente("+id+","+this.CODIGO_HOSPITAL+")"
    };
    this.http.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        console.log("sp_recuperar_datos_paciente",this.responde.success.data[0].sp_dinamico);
        let dataRecuperada = this.responde.success.data[0].sp_dinamico[0];
        this.formDatosPaciente.controls['nombre'].setValue(dataRecuperada.rec_nombres);
        this.formDatosPaciente.controls['apellidoMaterno'].setValue(dataRecuperada.rec_materno);
        this.formDatosPaciente.controls['apellidoPaterno'].setValue(dataRecuperada.rec_paterno);
        //this.formDatosPaciente.controls['edad'].setValue(dataRecuperada.);
        this.formDatosPaciente.controls['ci'].setValue(dataRecuperada.rec_ci);
        this.formDatosPaciente.controls['duplicado'].setValue(dataRecuperada.rec_complemento);
        this.formDatosPaciente.controls['expedido'].setValue(dataRecuperada.rec_expedido);
        this.formDatosPaciente.controls['fechaNacimiento'].setValue(dataRecuperada.rec_fec_nacimiento);
        this.formDatosPaciente.controls['genero'].setValue(dataRecuperada.rec_sexo);

        this.formDatosPaciente.controls['nacionalidad'].setValue((dataRecuperada.rec_nacionalidad?.toString() || ''));
        
        this.formDatosPaciente.controls['lugarNacimiento'].setValue(dataRecuperada.rec_lugar_nac);
        this.calcularEdadActual('R',dataRecuperada.rec_fec_nacimiento,dataRecuperada.rec_fec_nacimiento);
        /*this.formDatosPaciente.controls['provincia'].setValue(dataRecuperada.);
        this.formDatosPaciente.controls['municipio'].setValue(dataRecuperada.);*/
        this.formDatosPaciente.controls['direccion'].setValue(dataRecuperada.rec_direccion);
        this.formDatosPaciente.controls['telefono'].setValue(dataRecuperada.rec_telefono);
        this.formDatosPaciente.controls['email'].setValue(dataRecuperada.rec_correo);
        //this.formDatosPaciente.controls['avatar'].setValue(dataRecuperada.);
        this.formDatosPaciente.controls['codigoSoap'].setValue(dataRecuperada.rec_codigo_soap);
        
        

      } else {
        
      }
    });
  }

  listarPacientes() {    
    this.sql = {
      consulta: "select * from primer_nivel.sp_insertar_datos_datos_pacinte()"
    };
    this.http.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        
      } else {
        
      }
    });
  }
}
