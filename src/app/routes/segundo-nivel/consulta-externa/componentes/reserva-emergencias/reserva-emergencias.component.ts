import { Component, OnInit } from '@angular/core';
import { ConsultaExternaService } from '../../consulta-externa.service';

@Component({
  selector: 'app-reserva-emergencias',
  templateUrl: './reserva-emergencias.component.html',
  styleUrls: ['./reserva-emergencias.component.scss']
})
export class ReservaEmergenciasComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');

  listadoMedicos:any;
  sql: any;
  responde: any;
  constructor(private http: ConsultaExternaService) { }

  ngOnInit(): void {
    this.listarMedicos();
  }

  listarMedicos(){
    this.sql = {
      consulta: 'select * from sp_asignacion_med_emergencias('+this.CODIGO_HOSPITAL+')'
    };
    this.http.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        console.log(this.responde.success.data[0].sp_dinamico);
        this.listadoMedicos = this.responde.success.data[0].sp_dinamico;
      } else {
        
      }
    });
  }

}
