import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PrimerNivelService } from '../../primer-nivel.service';

@Component({
  selector: 'app-datos-paciente',
  templateUrl: './datos-paciente.component.html',
  styleUrls: ['./datos-paciente.component.scss']
})
export class DatosPacienteComponent implements OnInit {
  @Input() codigo: any;
  @Output() retornarDatos = new EventEmitter();
  paciente_seleccionado:any = [];
  
  CODIGO_HOSPITAL = 10;
  //////////servicios/////////
  sql: any;
  responde: any;
  //////////servicios/////////
  constructor(private http: PrimerNivelService) {
    this.paciente_seleccionado.genero = 'incognito';
  }

  ngOnInit(): void {
    this.listar_datos_paciente();
  }
  regresar() {
    this.retornarDatos.emit();
  }
  listar_datos_paciente() {
    try {
      this.sql = {
        consulta: "select * from primer_nivel.sp_listar_datos_paciente("+this.codigo+")"
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          console.log("datos paciente", this.responde.success.data[0].sp_dinamico);
          this.paciente_seleccionado = this.responde.success.data[0].sp_dinamico[0];
        } else {
        }
      });
    } catch (error) {
    }
  }
}
