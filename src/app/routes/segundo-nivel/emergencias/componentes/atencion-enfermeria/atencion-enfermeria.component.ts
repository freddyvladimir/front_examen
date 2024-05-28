import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DateRange, MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER } from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';

import { EmergenciasService } from '../../emergencias.service';


export interface Triaje {
  tria_id: number;
  tria_clasificacion: string;
}

export interface Cubiculo {
  vcub_id: number;
  vcub_descripcion: string;
}

@Component({
  selector: 'app-atencion-enfermeria',
  templateUrl: './atencion-enfermeria.component.html',
  styleUrls: ['./atencion-enfermeria.component.scss']
})
export class AtencionEnfermeriaComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  formDatosPaciente: FormGroup;
  
  @Input() datosPa: any;
  @Input() tipoAtencion: boolean =  false;
  
  //////////servicios/////////
  sql: any;
  responde: any;
  //////////servicios/////////

  //////  select  triaje  //////////
  selectedTriaje = new FormControl();
  lstTriaje: Triaje[] = [];
  selectedValueT: any; 

  //////  select  cubiculo  //////////
  selectedCubiculo = new FormControl();
  lstCubiculo: Cubiculo[] = [];
  selectedValueC: any; 

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private http: EmergenciasService
  ) {
    this.formDatosPaciente = this.fb.group({
      pesoK: ['', [Validators.required]],
      pesoL: ['', [Validators.required]],
      estatura: ['', [Validators.required]],
      masaCorporal: ['', [Validators.required]],
      tAxialP: ['', [Validators.required]],
      tAxialS: ['', [Validators.required]],
      tRectalP: ['', [Validators.required]],
      tRectalS: ['', [Validators.required]],
      tOralP: ['', [Validators.required]],
      tOralS: ['', [Validators.required]],
      tAuricularP: ['', [Validators.required]],
      tAuricularS: ['', [Validators.required]],
      frecuenciaCardiaca: ['', [Validators.required]],
      presionArterialP: ['', [Validators.required]],
      presionArterialS: ['', [Validators.required]],
      frecuenciaRespiratoria: ['', [Validators.required]],
      saturacionOxigeno: ['', [Validators.required]],
      triaje: ['', [Validators.required]]
    });    
  }

  ngOnInit(): void {
    console.log("tipoAtencion",this.tipoAtencion);
    this.listarTipoTriaje();
    this.listarCubiculo(this.CODIGO_HOSPITAL);
    
    if (this.tipoAtencion == true) {
      this.formDatosPaciente.disable();
    }
    this.recuperarSignosVitales();
  }

  recuperarSignosVitales(){
    console.log("formDatosPaciente",this.datosPa);
    
    try {
      this.sql = {
        consulta: "select atc_datos_enf from primer_nivel.atencion_consulta where atc_atn_id = "+this.datosPa.id_atencion+" "
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          console.log("this.responde.success.data[0].sp_dinamico", this.responde.success.data[0].sp_dinamico);
          
          this.formDatosPaciente.setValue(this.responde.success.data[0].sp_dinamico[0].atc_datos_enf);
        } else {
        }
      });
    } catch (error) {
    }
  }

  guardarSignosVitales(){
    console.log("formDatosPaciente",this.datosPa, JSON.stringify(this.formDatosPaciente.value));
    
    try {
      this.sql = {
        consulta: "select * from primer_nivel.sp_insertar_datos_enfermeria("+this.datosPa.id_atencion+"," + this.CODIGO_HOSPITAL + ","+this.datosPa.codigo+",1,$$"+JSON.stringify(this.formDatosPaciente.value)+"$$)"
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          console.log("this.responde.success.data[0].sp_dinamico", this.responde.success.data[0].sp_dinamico);
        } else {
        }
      });
    } catch (error) {
    }
  }


  listarTipoTriaje(){
    console.log("LISTA TRIAJE");
    this.http.lst_triaje().subscribe(resp => {
      this.responde = resp;
        console.log("this.correlativo", this.responde);
        if (this.responde.success.data != null) {
          this.lstTriaje = this.responde.success.data;
          console.log(this.lstTriaje);
        } else {
          this.lstTriaje = [];
        }
      });
  }


  listarCubiculo(idhsp: any){
    console.log("LISTA CUBICULO",idhsp);
    this.http.lst_cubiculos(idhsp).subscribe(resp => {
    this.responde = resp;
      console.log("this.correlativo", this.responde);
      if (this.responde.success.data != null) {
          this.lstCubiculo = this.responde.success.data;
          console.log(this.lstCubiculo);
        } else {
          this.lstCubiculo = [];
        }
      });
  }

  fechaAtencion(dateRangeStart: HTMLInputElement) {
    console.log(dateRangeStart.value);
  }

}
