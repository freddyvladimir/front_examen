import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ComponentesService } from '../componentes.service';

@Component({
  selector: 'app-datos-pacientes',
  templateUrl: './datos-pacientes.component.html',
  styleUrls: ['./datos-pacientes.component.scss']
})
export class DatosPacientesComponent implements OnInit {
  @Input() valor: any;

  @Input() codigo: any;
  @Output() retornarDatos = new EventEmitter();
  @Output() cancelarDatos = new EventEmitter();

  CODIGO_HOSPITAL = 5;
  responde_datos_personales:any = [];
  constructor(private http:ComponentesService) {
    this.responde_datos_personales.genero = 'incognito';
  }

  ngOnInit(): void {
    //this.listaDatosPaciente();
  }

  regresar() {
    this.retornarDatos.emit();
  }

  cancelar() {
    this.cancelarDatos.emit();
  }

  listaDatosPaciente() {
    var params_data = {
     "codigo_id": this.valor[0].codigo_id
    }
    this.http.datos_paciente(params_data).subscribe(res => {
      this.responde_datos_personales = res.success.data[0];
    });
  }
}
