import { Component, OnInit } from '@angular/core';
import { IndicadoresService } from '../indicadores.service';

@Component({
  selector: 'app-tendencia',
  templateUrl: './tendencia.component.html',
  styleUrls: ['./tendencia.component.scss']
})
export class TendenciaComponent implements OnInit {
  sql:any;
  responde:any;

  constructor(private http:IndicadoresService) { }

  ngOnInit(): void {
    this.listarSemaforo();
  }


  listarSemaforo(){
    try {
      this.sql = {
        consulta: "select * from sp_lst_indicadores_semaforos_mejorado_fichas_solicitadas(2019,1,3)"
      };
      this.http.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          console.log("indicadores",this.responde.success.data[0].sp_dinamico);
        } else {
        }
      });
    } catch (error) {
    }
  }
}
