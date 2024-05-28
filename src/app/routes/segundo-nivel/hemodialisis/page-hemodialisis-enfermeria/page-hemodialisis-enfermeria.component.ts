import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { FormBuilder, Validators } from '@angular/forms';
//import { DialogFromFichasComponent } from './dialog-from-fichas/dialog-from-fichas.component';
//import { ParametricasService } from '../parametricas.service';
import { HemodialisisService } from '../hemodialisis.service';
import { DialogHoraAtencionComponent } from './dialog-hora-atencion/dialog-hora-atencion.component';

export interface PeriodicElement {
  position1: number;
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface programaData {
  serial: string,
}
@Component({
  selector: 'app-page-hemodialisis-enfermeria',
  templateUrl: './page-hemodialisis-enfermeria.component.html',
  styleUrls: ['./page-hemodialisis-enfermeria.component.scss']
})
export class PageHemodialisisEnfermeriaComponent implements OnInit, AfterViewInit {

  //idhosp = 1;
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  ID_USUARIO = sessionStorage.getItem('IDUSUARIO');
  datos_pacientesEnfermeria: any = [];
  responde: any;
  habHeparina: boolean = true;
  habDosificacion1: boolean = true;
  habDosificacion2: boolean = true;
  datosHorarioAtencion: any = [];
  idHoja: any;

  displayedColumns: string[] = ['serial', 'siis', 'sice', 'nombres', 'paterno', 'materno', 'codigo', 'edad', 'fecha', 'opciones'];
  displayedColumnsHorarioAtencion: string[] = ['nro', 'hora', 'temp', 'pa', 'pvenosa', 'sat', 'flujosangre', 'fc', 'fr', 'qd', 'ptm', 'conductividad', 'observaciones', 'opciones'];


  dataSource: MatTableDataSource<programaData>;

  isVisibleSearch: boolean = true;
  isVisibleFormDatosPaciente: boolean = false;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator2!: MatPaginator;
  @ViewChild(MatSort) sort2!: MatSort;

  constructor(private hemodialisisService: HemodialisisService, private formBuilder: FormBuilder, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
  }

  pacienteForm2 = this.formBuilder.group({
    enf_pesoseco: ['', Validators.required],
    enf_pesoprehd: ['', Validators.required]
  });

  dataHorarioAtencion: any = [];

  pacienteEnfermeriaForm = this.formBuilder.group({
    enf_k: [''],
    enf_ca: [''],
    enf_qb: [''],
    enf_qd: [''],
    enf_uf: [''],
    enf_us: [''],
    enf_ptm: [''],
    enf_hfin: [''],
    enf_devol: [''],
    enf_hinit: [''],
    enf_filtro: [''],
    enf_hdatos: this.dataHorarioAtencion.filteredData,
    enf_lineas: [''],
    enf_perfuf: [''],
    enf_pvenosa: [''],
    enf_temppre: [''],
    enf_heparina: [''],
    enf_pesoseco: [''],
    enf_primming: [''],
    enf_temppost: [''],
    enf_anticoagu: [''],
    enf_filtrouso: [''],
    enf_ktvonline: [''],
    enf_lineasuso: [''],
    enf_parterial: [''],
    enf_perfsodio: [''],
    enf_pesoprehd: [''],
    enf_pesoposthd: [''],
    enf_bicarbonato: [''],
    enf_responsable: [''],
    enf_temperatura: [''],
    enf_ktvonlineval: [''],
    enf_anticoagucont: [''],
    enf_anticoagufrac: [''],
    enf_dosificacion1: [''],
    enf_dosificacion2: [''],
    enf_sodioprescrip: [''],
    enf_evaluacion: [''],
    enf_medicamentos: ['']
  });



  ngOnInit(): void {
    this.obtAtenEnfermeria();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log('filterValue', filterValue);
    let campo = parseInt(filterValue);
    if (isNaN(campo)) {
      if (filterValue.indexOf(' ') >= 0) {
        let nombres = filterValue.split(' ');
      }
    } else {
      if (filterValue.length > 4) {
        console.log('NUMERICO', campo);
      }
    }
  }

  recargar() {
    this.dataSource = new MatTableDataSource(this.datos_pacientesEnfermeria);
    this.ngAfterViewInit();
  }

  getEnfermeria(row: any) {
    console.log("Ingresando a el formulario de enfermeria", row);
    this.isVisibleSearch = false;
    this.isVisibleFormDatosPaciente = true;
    this.idHoja = row.hjid;
    var params = {
      "opcion": "L2",
      "hojaid": row.hjid
    }
    this.hemodialisisService.getHojaDatos(params).subscribe(res => {
      var response = res;
      var pacienteEnfermeriaData = response.success.data[0].hj_datos[0];
      this.dataHorarioAtencion = new MatTableDataSource(pacienteEnfermeriaData.enf_hdatos);
      for (var key in pacienteEnfermeriaData) {
        if (pacienteEnfermeriaData.hasOwnProperty(key)) {
          this.pacienteEnfermeriaForm.controls[key].setValue(pacienteEnfermeriaData[key]);
        }
      }
    });
  }

  listEnfermeria(type: string, event: MatDatepickerInputEvent<Date>) {
    const fechaCadena = JSON.stringify(event.value);
    const fecha = fechaCadena.substring(1, 11);
    var params = {
      "_cen_id": this.CODIGO_HOSPITAL,
      "fecha_hoja": fecha
    }
    this.hemodialisisService.buscar(params).subscribe(res => {
      this.responde = res;
      if (this.responde.success.data != null) {
        this.datos_pacientesEnfermeria = this.responde.success.data;
        this.dataSource = new MatTableDataSource(this.datos_pacientesEnfermeria);
        this.ngAfterViewInit();
      } else {
        this.datos_pacientesEnfermeria = [];
        this.dataSource = new MatTableDataSource(this.datos_pacientesEnfermeria);
        this.ngAfterViewInit();
      }
    });
  }


  obtAtenEnfermeria() {
    var params = {
      "_cen_id": this.CODIGO_HOSPITAL
    }
    this.hemodialisisService.listarAtenciones(params).subscribe(res => {
      this.responde = res;
      if (this.responde.success.data != null) {
        this.datos_pacientesEnfermeria = this.responde.success.data;
        this.dataSource = new MatTableDataSource(this.datos_pacientesEnfermeria);
        this.ngAfterViewInit();
      } else {
        this.datos_pacientesEnfermeria = [];
        this.dataSource = new MatTableDataSource(this.datos_pacientesEnfermeria);
        this.ngAfterViewInit();
      }
    });
  }

  showDialogHoraAtencion() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    dialogConfig.data = "";

    const dialogRef = this.dialog.open(DialogHoraAtencionComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result != null && result != undefined && result != '') {
        //this.registrar(result);
        this.datosHorarioAtencion.push(result);
        console.log(this.datosHorarioAtencion);
        this.dataHorarioAtencion = new MatTableDataSource(this.datosHorarioAtencion);
        this.ngAfterViewInit();
      } else {
        console.log('NO HAY NADA');
      }
    });

    /*this.dataMaq = [];
    const dialogRef = this.dialog.open(DialogNuevaMaquinaComponent, {
      disableClose: true,
      width: '50%',
    data: { cenid: 'Hospital Cotahuma', idmaq: 0, codmaq: '', descrp: '', tipo: 'REGISTRO'},
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result != null && result != undefined && result != '') {
        this.registrar(result);
      }else{
        console.log('NO HAY NADA');
      }
    }); */
  }

  onSubmit() {
    console.log("CERRAR MODAL");
    /*var params = {
      "_hj_id": 1,
      "_pac_id": 0,
      "_hj_data": [
        {}
      ],
      "_hj_data_enf": [
        this.pacienteEnfermeriaForm.value
      ],
      "_hj_data_consul": [
        {}
      ],
      "opcion": "U2",
      "idsiis": 0,
      "hspid": this.CODIGO_HOSPITAL,
      "usrid": this.ID_USUARIO,
      "alergias": [
        {}
      ],
      "tipo": ""
    }
    this.hemodialisisService.updateHemoEnfermeria(params).subscribe(res => {
      var responde = res;
    });*/
  }
  showListEnfermeria() {
    this.isVisibleSearch = true;
    this.isVisibleFormDatosPaciente = false;
  }
  showFormDatosPaciente() {
    this.isVisibleSearch = false;
    this.isVisibleFormDatosPaciente = true;
  }


  accesoAnticoagu(data: any) {
    console.log(data);
    if (data == 'Si') {
      this.habHeparina = true;
    } else {
      this.habHeparina = false;
    }
  }

  accesoAnticoaguCont(data: any) {
    console.log(data);
    if (data == 'Si') {
      this.habDosificacion1 = true;
    } else {
      this.habDosificacion1 = false;
    }
  }

  accesoAnticoaguFracc(data: any) {
    console.log(data);
    if (data == 'Si') {
      this.habDosificacion2 = true;
    } else {
      this.habDosificacion2 = false;
    }
  }

  editar(datos: any) {
    console.log(datos);
  }

  eliminar(id: any, datos: any) {
    console.log(id, datos);
  }

  guardarRegistro() {
    console.log("Almacenando los datos");
    console.log("ID HOJA", this.idHoja);
    console.log("DATOS FORMULARIO", this.pacienteEnfermeriaForm.value);
    console.log("DATOS TABLA", this.dataHorarioAtencion.filteredData);

    var params = {
      "_hj_id": this.idHoja,
      "_pac_id": 0,
      "_hj_data": [{ "fake": "fake" }],
      "_hj_data_enf": [
        {
          "enf_pesoseco": this.pacienteEnfermeriaForm.value.enf_pesoseco,
          "enf_pesoprehd": this.pacienteEnfermeriaForm.value.enf_pesoprehd,
          "enf_pesoposthd": this.pacienteEnfermeriaForm.value.enf_pesoposthd,
          "enf_temppre": this.pacienteEnfermeriaForm.value.enf_temppre,
          "enf_temppost": this.pacienteEnfermeriaForm.value.enf_temppost,
          "enf_filtro": this.pacienteEnfermeriaForm.value.enf_filtro,
          "enf_filtrouso": this.pacienteEnfermeriaForm.value.enf_filtrouso,
          "enf_lineas": this.pacienteEnfermeriaForm.value.enf_lineas,
          "enf_lineasuso": this.pacienteEnfermeriaForm.value.enf_lineasuso,
          "enf_responsable": this.pacienteEnfermeriaForm.value.enf_responsable,
          "enf_primming": this.pacienteEnfermeriaForm.value.enf_primming,
          "enf_ptm": this.pacienteEnfermeriaForm.value.enf_ptm,
          "enf_parterial": this.pacienteEnfermeriaForm.value.enf_parterial,
          "enf_pvenosa": this.pacienteEnfermeriaForm.value.enf_pvenosa,
          "enf_qb": this.pacienteEnfermeriaForm.value.enf_qb,
          "enf_qd": this.pacienteEnfermeriaForm.value.enf_qd,
          "enf_sodioprescrip": this.pacienteEnfermeriaForm.value.enf_sodioprescrip,
          "enf_bicarbonato": this.pacienteEnfermeriaForm.value.enf_bicarbonato,
          "enf_k": this.pacienteEnfermeriaForm.value.enf_k,
          "enf_ca": this.pacienteEnfermeriaForm.value.enf_ca,
          "enf_temperatura": this.pacienteEnfermeriaForm.value.enf_temperatura,
          "enf_uf": this.pacienteEnfermeriaForm.value.enf_uf,
          "enf_perfsodio": this.pacienteEnfermeriaForm.value.enf_perfsodio,
          "enf_perfuf": this.pacienteEnfermeriaForm.value.enf_perfuf,
          "enf_ktvonline": this.pacienteEnfermeriaForm.value.enf_ktvonline,
          "enf_ktvonlineval": this.pacienteEnfermeriaForm.value.enf_ktvonlineval,
          "enf_anticoagu": this.pacienteEnfermeriaForm.value.enf_anticoagu,
          "enf_anticoagucont": this.pacienteEnfermeriaForm.value.enf_anticoagucont,
          "enf_anticoagufrac": this.pacienteEnfermeriaForm.value.enf_anticoagufrac,
          "enf_us": this.pacienteEnfermeriaForm.value.enf_us,
          "enf_devol": this.pacienteEnfermeriaForm.value.enf_devol,
          "enf_heparina": this.pacienteEnfermeriaForm.value.enf_heparina,
          "enf_dosificacion1": this.pacienteEnfermeriaForm.value.enf_dosificacion1,
          "enf_dosificacion2": this.pacienteEnfermeriaForm.value.enf_dosificacion2,
          "enf_hdatos": this.dataHorarioAtencion.filteredData,
          "enf_evaluacion": this.pacienteEnfermeriaForm.value.enf_evaluacion,
          "enf_medicamentos": this.pacienteEnfermeriaForm.value.enf_medicamentos

        }
      ],
      "_hj_data_consul": [{ "fake": "fake" }],
      "opcion": "U2",
      "idsiis": 0,
      "hspid": this.CODIGO_HOSPITAL,
      "usrid": this.ID_USUARIO,
      "alergias": [{ "fake": "fake" }],
      "tipo": ""
    }
    console.log("PARAMETROS", params);
    this.hemodialisisService.hojaHemodialisis(params).subscribe(res => {
      this.responde = res;
      console.log("RESPUESTA DATA", this.responde);
    });
  }

}
