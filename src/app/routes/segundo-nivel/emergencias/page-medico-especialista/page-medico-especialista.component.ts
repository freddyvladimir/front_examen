import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { EmergenciasService } from '../emergencias.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { DatosPacientesComponent } from '../../../componentes/datos-pacientes/datos-pacientes.component';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { style } from '@angular/animations';
import { Cie10Component } from 'app/routes/componentes/cie10/cie10.component';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export interface programaData {
}

@Component({
  selector: 'app-page-medico-especialista',
  templateUrl: './page-medico-especialista.component.html',
  styleUrls: ['./page-medico-especialista.component.scss']
})
export class PageMedicoEspecialistaComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  public isVisibleListPaciente: boolean = true;
  public isVisibleTabsDatosPaciente: boolean = false;

  displayedColumns: string[] = [
    'id',
    'siis',
    'sice',
    'fecha',
    'paciente',
    'servicio',
    'tipo',
    'estado',
    'acciones'
  ];

  pacienteForm = this.fb.group({
    input_siis: [''],
    input_sice: [''],
    input_tipo: [''],
    input_hora: [''],
    input_fecha_ingreso: [''],
    input_fecha_nacimiento: [''],
    input_edad: [''],
    input_peso: [''],
    input_estatura: [''],
    input_masa: [''],
    input_presion_arterial: [''],
    input_frecuencia_respiratoria: [''],
    input_temperatura_axilar: [''],
    input_temperatura_oral: [''],
    input_temperatura_rectal: [''],
    input_frecuencia_cardiaca: [''],
    input_saturacion_oxigeno: [''],
    input_llenado_capilar: [''],
    input_motivo_consulta: [''],
    input_enfermedad_actual: [''],
    input_antecedente_patologico: [''],
    input_total: [''],
    input_od: [''],
    input_oi: [''],
    input_craneo_facial: [''],
    input_piel_mucosas: [''],
    input_cardiaco: [''],
    input_pulmonar: [''],
    input_abdomen: [''],
    input_genito_urinario: [''],
    input_extremidades: [''],
    input_otros: [''],
    input_anamnesis: [''],
    input_examen_fisico: [''],
    input_diagnostico_ingreso: [''],
    input_diagnostico_egreso: [''],
    input_impresion_diagnostico_egreso: [''],
  });


  datosConsultaEmergencias:any;


  dataSource: MatTableDataSource<programaData>;

  listaPacientesAsignados: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  datos_programacion: any;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(private fb: FormBuilder, private toastr: ToastrService, public dialog: MatDialog, private emergenciasService: EmergenciasService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    try {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } catch (error) {

    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  listarPacientes(type: string, event: MatDatepickerInputEvent<Date>) {
    const fechaCadena = JSON.stringify(event.value);
    const fecha = fechaCadena.substring(1, 11);

    var params = {
      "hspid": this.CODIGO_HOSPITAL,
      "fechat": fecha,
      "vid_usr": 1086
    }

    this.emergenciasService.listarPacientesAsignadosMedicoEspecialista(params).subscribe(res => {     
      var response_buscar = res;
      this.dataSource = new MatTableDataSource(response_buscar.success.data);
      this.ngAfterViewInit();
    });
  }

  atenderPaciente(row: any) {
    var params = {
      "hspid": row.vhspid,
      "idpres": row.presid,
      "fecha": row.vprs_fecha_atencion,
      "idprespadre": row.vpresidpadre
    }
    this.emergenciasService.listarAtencionMedicoEspecialista(params).subscribe(res => {     
      var response = res.success.data[0];
      this.datosConsultaEmergencias=response;
      
      this.showTabsPaciente();      
    });
  }

  alta_solicitada() {
  }

  imprimir_formulario() {
  }

  onSubmitPaciente() {

  }

  showListPaciente() {
   this.isVisibleListPaciente = true;
   this.isVisibleTabsDatosPaciente = false;     
  }
  showTabsPaciente() {
    this.isVisibleListPaciente = false;
    this.isVisibleTabsDatosPaciente = true;  
  }
}
