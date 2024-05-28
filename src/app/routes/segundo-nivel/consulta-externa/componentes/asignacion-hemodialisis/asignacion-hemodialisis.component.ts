import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HemodialisisService } from 'app/routes/segundo-nivel/hemodialisis/hemodialisis.service';

@Component({
  selector: 'app-asignacion-hemodialisis',
  templateUrl: './asignacion-hemodialisis.component.html',
  styleUrls: ['./asignacion-hemodialisis.component.scss']
})
export class AsignacionHemodialisisComponent implements OnInit {

  listaserologia:any;
  formDatosPaciente: any = {};

  sql: any;
  responde: any;

  constructor(
    fb: FormBuilder,
    private toastr: ToastrService,
    private http: HemodialisisService
  ) { 
    this.formDatosPaciente = fb.group({
      fechaAfiliacion: ['', [Validators.required]],
      transferidoDe: ['', [Validators.required]],
      fichaClinica: ['', [Validators.required]],
      procedencia: ['', [Validators.required]],
      tipoSerologia: ['', [Validators.required]],
      lugarVive: ['', [Validators.required]]
    });  
  }

  ngOnInit(): void {
    this.listarSerologia();
  }

  /*listarSerologia(){
    this.sql = {
      consulta: 'select * from hemodialisis.sp_listar_parametros ()'
    };
    this.http.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        console.log(this.responde.success.data[0].sp_dinamico);
        this.listaserologia = this.responde.success.data[0].sp_dinamico;
      } else {
        
      }
    });
  }*/

  listarSerologia() {
    this.http.lstParametricas().subscribe(resp => {
      this.responde = resp as { message: string };
      if (this.responde.success.data != null) {
        this.listaserologia = this.responde.success.data;
        console.log("this.listaserologia", this.listaserologia);
      } else {
        this.listaserologia = [];
      }
    });
  }

  registroDatos() {
    console.log("Datos", this.formDatosPaciente.value);
  }

}
