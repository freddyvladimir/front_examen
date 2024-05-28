import { Component, OnInit, Input } from '@angular/core';
import { PrimerNivelService } from '../../primer-nivel.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-formulario-medico',
  templateUrl: './formulario-medico.component.html',
  styleUrls: ['./formulario-medico.component.scss']
})
export class FormularioMedicoComponent implements OnInit {
  CODIGO_HOSPITAL = 10;
  data:any = [];
  //////////servicios/////////
  sql: any;
  responde: any;
  //////////servicios/////////
  @Input() datosPaCo: any;
  constructor(
    private toastr: ToastrService,
    private http: PrimerNivelService
  ) { }

  ngOnInit(): void {
    this.recuperarFormulario();
  }

  recuperarFormulario(){
    try {
      this.sql = {
        consulta: "select atc_datos_medico from primer_nivel.atencion_consulta where atc_atn_id = "+this.datosPaCo.id_atencion+" "
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico[0].atc_datos_medico != null) {
          console.log("atc_datos_medico", this.responde.success.data[0].sp_dinamico[0].atc_datos_medico);
          
          this.data = this.responde.success.data[0].sp_dinamico[0].atc_datos_medico;
        } else {
          this.data = [];
        }
      });
    } catch (error) {
    }
  }

  guardarFormulario(){
    console.log("data--",this.data);
    
    try {
      this.sql = {
        consulta: "select * from primer_nivel.sp_insertar_datos_medico("+this.datosPaCo.id_atencion+"," + this.CODIGO_HOSPITAL + ","+this.datosPaCo.codigo+",1,$$"+JSON.stringify(this.data)+"$$)"
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          console.log("sp_insertar_datos_medico", this.responde.success.data[0].sp_dinamico);
        } else {
        }
      });
    } catch (error) {
    }
  }
}
