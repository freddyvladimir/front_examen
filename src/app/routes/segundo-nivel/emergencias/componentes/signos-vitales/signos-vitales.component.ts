import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { EmergenciasService } from '../../emergencias.service';


@Component({
  selector: 'app-signos-vitales',
  templateUrl: './signos-vitales.component.html',
  styleUrls: ['./signos-vitales.component.scss']
})
export class SignosVitalesComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  formDatosPaciente: FormGroup;
  
  @Input() datosPa: any;
  @Input() tipoAtencion: boolean =  false;
  
  //////////servicios/////////
  sql: any;
  responde: any;
  //////////servicios/////////
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
      saturacionOxigeno: ['', [Validators.required]]
    });    
  }

  ngOnInit(): void {
    console.log("tipoAtencion",this.tipoAtencion);
    
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
}
