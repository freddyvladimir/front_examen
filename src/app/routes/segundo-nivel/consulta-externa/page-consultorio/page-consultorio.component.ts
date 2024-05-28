import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ConsultaExternaService } from '../consulta-externa.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface listaPacientes {
}

@Component({
  selector: 'app-page-consultorio',
  templateUrl: './page-consultorio.component.html',
  styleUrls: ['./page-consultorio.component.scss']
})
export class PageConsultorioComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  IDUSUARIO = 1;

  sql: any;
  responde: any;

  displayedColumns: string[] = [
    'serial',
    'siis',
    'sice',
    'tipoPaciente',
    'fecha',
    'paciente',
    'servicio',
    'ficha',
    'enfermeria',
    'codigo',
  ];
  dataSource: MatTableDataSource<listaPacientes>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  listadoFichas:any = [];
  popupWin:any;
  detallesFicha:any;
  tipoAtencion:any;

  formulario:any;
  opciones: String = '';
  constructor(private http: ConsultaExternaService) {
    this.dataSource = new MatTableDataSource();
    this.tipoAtencion = {};
  }

  ngOnInit(): void {
    this.listarPacientes();
    this.listarFormulario();
    this.opciones = 'listaPacientes';
  }

  listarPacientes() {
    this.sql = {
      consulta: "select * from sp_lst_pacientes_asignados_consulta2(1118,"+this.CODIGO_HOSPITAL+",87466)"
    };
    this.http.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      console.log(this.responde);

      if (this.responde.success.data[0].sp_dinamico != null) {
        this.listadoFichas = this.responde.success.data[0].sp_dinamico;
        this.dataSource = new MatTableDataSource(this.listadoFichas);
        this.ngAfterViewInit();
      } else {

      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  listarFormulario() {
    this.sql = {
      consulta: "select inf_formulario,inf_descripcion from _hsp_srv_especialidad inner join _hsp_formlarios_sice  on inf_id = esp_formulario::integer and esp_hospital_id = "+this.CODIGO_HOSPITAL+" and esp_estado = $$A$$ and esp_id = 184 "
    };
    this.http.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        this.formulario = this.responde.success.data[0].sp_dinamico[0].inf_formulario;
        console.log(this.formulario);
      } else {

      }
    });
  }

  atenderPaciente(data: any) {
    console.log("data", data,"---",this.formulario);
    
    this.opciones = 'verPaciente';
  }

  pendienteFicha(){
    this.opciones = 'listaPacientes';
  }

}
